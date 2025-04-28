import { useState, useEffect } from "react";

export const useDebouncedValue = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState("");
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(timerId)
    }, [value, delay])
    return debouncedValue;
}
