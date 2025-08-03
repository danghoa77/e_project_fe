// api.ts
import type { ProductApiResponse } from "@/types";
import apiClient from "@/lib/axios";

export const fetchProducts = async (): Promise<ProductApiResponse> => {
    try {
        const res = await apiClient.get<ProductApiResponse>('/products');
        return res.data;
    } catch (error: any) {
        console.error("Fetch products failed:", error);
        throw new Error(`HTTP error! ${error.response?.status || error.message}`);
    }
};
