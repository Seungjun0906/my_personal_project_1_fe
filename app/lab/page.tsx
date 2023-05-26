"use client";

import {
    ChangeEvent,
    CSSProperties,
    FunctionComponent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import * as JSZip from "jszip";
import { useFileListQuery, useInsertFileMutation, useFileQuery, useUpdateFileMutation } from "hooks/queries/file";
import axios from "axios";

// This is a Client Component. It receives data as props and
// has access to state and effects just like Page components
// in the `pages` directory.
const TAB_CONSTANTS = ["GPT", "FILE"];

interface MenuButtonProps {
    width?: number;
    height?: number;
    // size?: string;
    text: string;
    onClick?: () => void;
}

const MenuButton: FunctionComponent<MenuButtonProps> = (props) => {
    const {
        width = 100,
        height = 30,
        // size = "M",
        text,
        onClick,
    } = props;
    const buttonStyles = useCallback((): CSSProperties => {
        return { width, height, borderRadius: 100 };
    }, [height, width]);
    return (
        <button className="border-2 border-indigo-500" style={buttonStyles()} type="button" onClick={onClick}>
            {text}
        </button>
    );
};

const Gpt: FunctionComponent = () => {
    // const handlePrompt = async (prompt: string) => {};
    return (
        <form>
            <input type="text" />
            <button type="button">확인</button>
        </form>
    );
};
/*--------------------------테스트----------------------*/

const File: FunctionComponent = () => {
    // const fileExtensionList = ["zip", "tar"];
    const [fileList, setFileList] = useState<Array<JSZip.JSZipObject>>([]);
    const [selectedFile, setSelectedFile] = useState<JSZip.JSZipObject | undefined>();
    const [fileContents, setFileContents] = useState<string>("");
    const [selectedZipFileId, setSelectedZipFileId] = useState<number>();
    const { mutateAsync: insertProject } = useInsertFileMutation();
    const { mutateAsync: updateProject } = useUpdateFileMutation();
    const { data: zipFileList } = useFileListQuery(1);
    const { data: zipFile } = useFileQuery(selectedZipFileId);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!zipFile) return;

        const zip = JSZip.default();

        const base64 = (zipFile?.contents as string)?.split("base64,")[1] as string;

        zip.loadAsync(base64 as string, { base64: true }).then(({ files }) => {
            setFileList(Object.values(files));
        });
    }, [zipFile]);

    const filteredFileList = useMemo(() => {
        if (!fileList) return [];

        return fileList.filter((fileObj) => !fileObj.dir);
    }, [fileList]);

    const isFileLoaded = useMemo(() => {
        return filteredFileList?.length;
    }, [filteredFileList?.length]);

    const disabledButton = useMemo(() => {
        return Boolean(!fileContents?.length);
    }, [fileContents?.length]);

    const fileInputTriggerHandler = () => {
        if (!inputRef?.current) return;

        inputRef.current.click();
    };

    const fileInputHandler = async (e: ChangeEvent<HTMLInputElement>) => {
        const fileFromInput = e?.target?.files?.[0];

        if (!fileFromInput) return;

        const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(fileFromInput as File);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

        await insertProject({ fileName: fileFromInput?.name, base64: dataUrl as string });

        alert("프로젝트가 업로드 되었습니다.");
    };

    const fileContentsEditHandler = async () => {
        if (!selectedFile) return;

        const confirmEdit = confirm("정말 수정하시겠습니까?");

        if (!confirmEdit) return;

        // eslint-disable-next-line
        const zip = new JSZip.default();

        for (let i = 0; i < fileList?.length; i++) {
            const fileObj = fileList?.[i];
            if (fileObj?.name !== selectedFile?.name) {
                const contents = await fileObj?.async("text");

                zip.file(fileObj.name, contents);
            } else {
                zip.file(fileObj.name, fileContents);
            }
        }

        const result = await zip.generateAsync({ type: "base64" });

        const blob = atob(result);

        const updatedFiles = (await zip.loadAsync(blob)).files;

        const fileObjectList = Object.values(updatedFiles);

        const mime = zipFile?.contents?.split(",")?.[0];

        await updateProject({ id: zipFile?.id as number, contents: `${mime},${result}` });

        setFileList(fileObjectList);

        alert("수정되었습니다.");
    };

    const contentsChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setFileContents(e.target.value);
    };

    const contentsLoadHandler = async (file: JSZip.JSZipObject) => {
        const contents = await file.async("text");

        setFileContents(contents);
        setSelectedFile(file);
    };

    const savedFileClickHandler = async (fileId: number) => {
        if (!fileId) return;
        setSelectedZipFileId(fileId);
        setFileContents("");
    };

    const downloadFileHandler = async (fileId: number | undefined) => {
        if (!fileId) return;

        const { data } = await axios.get(`file/getDataUrl/${fileId}`);

        if (!data) return;

        const { fileName, dataUrl } = data;

        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = fileName as string;
        a.click();
    };

    return (
        <div className="grid grid-cols-5 border-2">
            {/* 파일 목록 */}
            <div className="col-span-1 border-r-2">
                <h3 className="font-bold text-lg text-center">프로젝트 목록</h3>
                <button onClick={fileInputTriggerHandler} className="border-2 w-full">
                    파일 업로드
                </button>

                <input ref={inputRef} onChange={fileInputHandler} type="file" hidden />

                {zipFileList ? (
                    <ul className="pl-4 mt-4">
                        {zipFileList.map((fileObj, idx) => (
                            <li key={idx} className="flex items-center justify-between px-4">
                                <p
                                    className="hover:text-primary cursor-pointer"
                                    onClick={() => savedFileClickHandler(fileObj.id as number)}
                                >
                                    {fileObj?.fileName}
                                </p>
                                <button onClick={() => downloadFileHandler(fileObj?.id)}>다운</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center">저장 된 파일이 없습니다.</p>
                )}
            </div>

            {/* 파일 업로드 */}
            <div className="col-span-2 flex flex-col gap-4">
                <h3 className="font-bold text-lg text-center">파일 목록</h3>

                {isFileLoaded ? (
                    <ul className="pl-2">
                        {filteredFileList.map((file, idx) => (
                            <li
                                className="cursor-pointer hover:text-primary"
                                key={idx}
                                onClick={() => contentsLoadHandler(file)}
                            >
                                {file?.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center">파일을 업로드 해주세요</p>
                )}
            </div>

            {/* 에디터 */}
            <div className="col-span-2 flex flex-col gap-2 w-full">
                <h3 className="font-bold text-lg text-center">에디터</h3>
                <textarea rows={30} className="border-4" value={fileContents} onChange={contentsChangeHandler} />

                <button
                    disabled={disabledButton}
                    className="border-2"
                    type="button"
                    onClick={() => fileContentsEditHandler()}
                >
                    저장
                </button>
            </div>
        </div>
    );
};
/*--------------------------테스트---------------------- */

export default function HomePage() {
    const [selectedTab, setSelectedTab] = useState("FILE");

    const handleTabChange = (tab: string) => {
        setSelectedTab(tab);
    };

    return (
        <>
            <nav>
                {TAB_CONSTANTS.map((tabTitle) => (
                    <MenuButton key={`${tabTitle}`} text={tabTitle} onClick={() => handleTabChange(tabTitle)} />
                ))}
            </nav>

            <div className="pt-4">
                {selectedTab === TAB_CONSTANTS[0] && <Gpt />}
                {selectedTab === TAB_CONSTANTS[1] && <File />}
            </div>
        </>
    );
}
