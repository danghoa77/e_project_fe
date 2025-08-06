// api.ts
import type { ProductApiResponse } from "@/types/product";
import apiClient from "@/lib/axios";


export const fetchProducts = async (): Promise<ProductApiResponse> => {
    try {
        const res = await apiClient.get<ProductApiResponse>('/products/');
        return res.data;
    } catch (error: any) {
        console.error(" API error:", error.response?.data || error.message);
        throw new Error(`Fetch failed: ${error.message}`);
    }
};

export const findOneProduct = async (id: string) => {
    const response = await apiClient.get(`/products/${id}/`);
    return response.data;
};

