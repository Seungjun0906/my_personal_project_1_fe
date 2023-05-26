import { useCallback, useState } from "react";

function useForm<T>(initialState: T) {
    const [savedInitialState] = useState(initialState);
    const [data, setData] = useState(initialState);

    const setInForm = useCallback((key: keyof T, value: T[keyof T]) => {
        setData((prev) => {
            const newData = { ...prev };

            newData[key] = value;

            return newData;
        });
    }, []);

    const setForm = useCallback((value: T) => {
        setData(value);
    }, []);

    const resetForm = useCallback(() => {
        setData(savedInitialState);
    }, [savedInitialState]);

    return {
        form: data,
        setForm,
        setInForm,
        resetForm,
    };
}
export default useForm;
