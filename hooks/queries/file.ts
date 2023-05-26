import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface FileObject {
    id: number;
    fileName: string;
    mim: string;
    contents?: string;
}

const FileQueryKey = {
    FILE_LIST: "/file/list",
    FILE: "/file",
};

const useFileListQuery = (userId: number) => {
    return useQuery(
        [FileQueryKey.FILE_LIST, userId],
        async () => {
            const { data } = await axios.get(FileQueryKey.FILE_LIST);

            return data as Array<Partial<FileObject>>;
        },
        {
            enabled: Boolean(userId),
        },
    );
};

const useFileQuery = (id: number | undefined) => {
    return useQuery(
        [FileQueryKey.FILE, id],
        async () => {
            const { data } = await axios.get(`${FileQueryKey.FILE}/${id}`);

            return data as FileObject;
        },
        {
            enabled: Boolean(id),
        },
    );
};

const useInsertFileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (data: { fileName: string; base64: string }) => {
            const { data: insertedFile } = await axios.post(FileQueryKey.FILE, data);

            return insertedFile;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries([FileQueryKey.FILE_LIST]);
            },
        },
    );
};

const useUpdateFileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (data: { id: number; contents: string }) => {
            const { data: insertedFile } = await axios.patch(`${FileQueryKey.FILE}/${data.id}`, data);

            return insertedFile;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries([FileQueryKey.FILE_LIST]);
            },
        },
    );
};

export { FileQueryKey, useFileListQuery, useInsertFileMutation, useFileQuery, useUpdateFileMutation };
