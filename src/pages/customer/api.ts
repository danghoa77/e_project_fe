// customerApi.ts
import type { GetProductsResponse } from "@/types/product";
import apiClient from "@/lib/axios";



export const customerApi = {
    fetchProducts: async (payload?: any): Promise<GetProductsResponse> => {
        try {
            const query = new URLSearchParams();

            if (payload?.category) query.append("category", payload.category);
            if (payload?.sortBy) query.append("sortBy", payload.sortBy);
            if (payload?.page) query.append("page", String(payload.page));
            if (payload?.limit) query.append("limit", String(payload.limit));

            if (payload?.price) {
                if (payload.price.min !== undefined) {
                    query.append("priceMin", String(payload.price.min));
                }
                if (payload.price.max !== undefined) {
                    query.append("priceMax", String(payload.price.max));
                }
            }

            // size là string (BE định nghĩa IsString) => FE chỉ gửi 1 giá trị tại 1 request
            if (payload?.size && Array.isArray(payload.size) && payload.size.length > 0) {
                // nếu FE cho phép chọn nhiều size => gửi từng request hoặc BE phải hỗ trợ mảng
                query.append("size", payload.size[0]);
            } else if (payload?.size && typeof payload.size === "string") {
                query.append("size", payload.size);
            }

            if (payload?.color) query.append("color", payload.color);

            const res = await apiClient.get<GetProductsResponse>(
                `/products/?${query.toString()}`
            );
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


    removeItemFromCart: async (pid: string, vid: string, sid: string) => {
        try {
            const res = await apiClient.delete(`/carts/${pid}/${vid}/${sid}/`);
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },

    updateQuantity: async (pid: string, vid: string, sid: string, quantity: number) => {
        try {
            const res = await apiClient.put(`/carts/${pid}/${vid}/${sid}/`, { quantity });
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

    createOrGetConversation: async () => {
        try {
            const adminId = await customerApi.getAdmin1st();
            const res = await apiClient.post("/talkjs/conversations/", { adminId });
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },


    setMode: async (mode: string) => {
        try {
            const res = await apiClient.post("/talkjs/mode/set/", { mode });
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },

    getMode: async () => {
        try {
            const res = await apiClient.get("/talkjs/mode/get/");
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },

    handleMessage: async (conversationId: string, message: string) => {
        try {
            const res = await apiClient.post("/talkjs/messages/handle/", {
                conversationId,
                message,
            });
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },

    createRating: async (payload: any) => {
        const response = await apiClient.post('/products/rating/', payload);
        return response.data;
    },

    deleteRating: async (pId: string) => {
        const response = await apiClient.delete(`/products/${pId}/rating/`);
        return response.data;
    },

    topProducts: async () => {
        try {
            const res = await apiClient.get("/orders/top-products/");
            return res.data;
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            throw new Error(`Fetch failed: ${error.message}`);
        }
    },
}
