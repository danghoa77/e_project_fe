import apiClient from "@/lib/axios";


const adminApi = {

  fetchProducts: async () => {
    const response = await apiClient.get('/products/');
    return response.data;
  },
  createProduct: async (formData: FormData) => {
    const response = await apiClient.post('/products/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  findOneProduct: async (id: string) => {
    const response = await apiClient.get(`/products/${id}/`);
    return response.data;
  },

  updateProduct: async (id: string, data: FormData) => {
    const res = await apiClient.patch(`/products/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },


  deleteProduct: async (id: string) => {
    const response = await apiClient.delete(`/products/${id}/`);
    return response.data;
  },

  fetchAllUser: async () => {
    const response = await apiClient.get('/users/all/');
    return response.data;
  },

  createUser: async (data: any) => {
    const rq = await apiClient.post("/auth/register/", data);
    return rq;
  },

  deleteUser: async (id: string) => {
    const response = await apiClient.delete(`/users/${id}/`);
    return response.data;
  },

  getCurrentAdmin: async () => {
    const response = await apiClient.get('/users/me/');
    return response.data;
  },

  fetchOrders: async () => {
    const response = await apiClient.get('/orders/');
    return response.data;
  },

  updateStatusOrder: async (id: string, status: any) => {
    const response = await apiClient.put(`/orders/${id}/status/`, status);
    return response.data;
  },

  getAllPayments: async (orderId?: string) => {
    const response = await apiClient.post('/payments/getPayment/', { orderId });
    return response.data;
  },

  getListConversations: async () => {
    const response = await apiClient.get('/talkjs/conversations/me/');
    console.log(response.data);
    return response.data;
  },

  deleteConversation: async (id: string) => {
    const response = await apiClient.delete(`/talkjs/conversations/${id}/`);
    return response.data;
  },

  getConversation: async (targetCustomerId: string) => {
    try {
      const res = await apiClient.post("/talkjs/conversations/", { targetCustomerId });
      return res.data;
    } catch (error: any) {
      console.error("API error:", error.response?.data || error.message);
      throw new Error(`Fetch failed: ${error.message}`);
    }
  },
  
};

export default adminApi;