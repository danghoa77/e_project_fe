// customerApi.ts
import type { ProductApiResponse } from "@/types/product";
import apiClient from "@/lib/axios";


export const customerApi = {
    fetchProducts: async (): Promise<ProductApiResponse> => {
        try {
            const res = await apiClient.get<ProductApiResponse>("/products/");
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },

    findOneProduct: async (id: string) => {
        try {
            const res = await apiClient.get(`/products/${id}/`);
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },

    getCart: async () => {
        try {
            const res = await apiClient.get("/carts/");
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },

    addItemToCart: async (payload: any) => {
        try {
            const res = await apiClient.post("/carts/", payload);
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },


    removeItemFromCart: async (pid: string, vid: string) => {
        try {
            const res = await apiClient.delete(`/carts/${pid}/${vid}`);
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },

    updateQuantity: async (pid: string, vid: string, quantity: number) => {
        try {
            const res = await apiClient.put(`/carts/${pid}/${vid}/`, { quantity });
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },

    deleteCart: async () => {
        try {
            const res = await apiClient.delete("/carts/");
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },

    createOrder: async (payload: any) => {
        try {
            const res = await apiClient.post("/orders/", payload);
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },

    getOrderId: async (id: string) => {
        try {
            const res = await apiClient.get(`/orders/${id}`);
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },

    getOrderbyRole: async () => {
        try {
            const res = await apiClient.get("/orders/");
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },

    cancelOrder: async (id: string) => {
        try {
            const res = await apiClient.put(`/orders/${id}/cancel/`);
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },

    updateProfile: async (payload: any) => {
        try {
            const res = await apiClient.patch("/users/me/", payload);
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },


    getAddresses: async () => {
        try {
            const res = await apiClient.get("/users/me/");
            return res.data.addresses = res.data.addresses || [];

        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },


    deleteUser: async (id: string) => {
        try {
            const res = await apiClient.delete(`/users/${id}/`);
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },

    deleteAddress: async (id: string) => {
        try {
            const res = await apiClient.delete(`/users/me/addresses/${id}/`);
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },

    createMomoUrl: async (orderId: string, amount: number) => {
        try {
            const res = await apiClient.post("/payments/momo/create/", { orderId, amount });
            console.log(res.data);
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },

    momoUrlReturn: async (orderId: string, resultCode: string) => {
        try {
            const res = await apiClient.post("/payments/momo/return/", { orderId, resultCode });
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },

    createVnpayUrl: async (orderId: string, amount: number) => {
        try {
            const res = await apiClient.post("/payments/vnpay/create/", { orderId, amount });
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },

    vnpayReturn: async (orderId: string, responseCode: string) => {
        try {
            const res = await apiClient.post("/payments/vnpay/return/", { orderId, responseCode });
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },


    decreaseStock: async (items: { productId: string; variantId: string; quantity: number }[]) => {
        try {
            const res = await apiClient.patch("/products/stock/decrease/", {
                items: items,
            });
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw error;
        }
    },

    createConversation: async () => {
        try {
            const res = await apiClient.post("/talkjs/conversations/");
            console.log(res.data);
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },

    sendMessage: async (conversationId: string, message: any,) => {
        try {
            const res = await apiClient.post("/talkjs/messages/", { conversationId, message });
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },

    getAdmin1st: async () => {
        try {
            const res = await apiClient.get("/users/admin1st/");
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
};
