import { useState } from "react";
import {postAdd} from "../api/productAPI.ts";

function useRegister() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAddProduct = (formData: FormData) => {
        setIsLoading(true);
        postAdd(formData)
            .then(res => {
                console.log("Product added:", res);
            })
            .catch(err => {
                console.error("Error adding product:", err);
                setError("제품 추가 중 오류가 발생했습니다.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return {
        isLoading,
        error,
        handleAddProduct
    };
}

export default useRegister;
