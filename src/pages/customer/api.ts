// api.ts
import type { ProductApiResponse } from "@/types/user";
import apiClient from "@/lib/axios";


export const fetchProducts = async (): Promise<ProductApiResponse> => {
    try {
        const res = await apiClient.get<ProductApiResponse>('/products/');
        console.log("✅ API success:", res.data);
        return res.data;
    } catch (error: any) {
        console.error(" API error:", error.response?.data || error.message);
        throw new Error(`Fetch failed: ${error.message}`);
    }
};
