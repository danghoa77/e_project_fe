import apiClient from "@/lib/axios";


const adminApi = {

  getProducts: async () => {
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

  getAllCategory: async () => {
    const response = await apiClient.get('/products/categories/all');
    return response.data;
  },

  getCategory: async (id: string) => {
    const response = await apiClient.get(`/products/category/${id}/`);
    return response.data;
  },

  addCategory: async (name: string) => {
    const response = await apiClient.post('/products/category/', { name });
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await apiClient.delete(`/products/category/${id}/`);
    return response.data;
  },

  updateCateogory: async (id: string, name: string) => {
    const response = await apiClient.patch(`/products/category/${id}/`, { name });
    return response.data;
  },

  orderDashboard: async () => {
    const response = await apiClient.get('/orders/dashboard/');
    return response.data;
  },

  topCategory: async () => {
    const response = await apiClient.get('/orders/top-categories/');
    return response.data;
  },

  userDashboard: async () => {
    const response = await apiClient.get('/users/dashboard/');
    return response.data;
  },


};

export default adminApi;