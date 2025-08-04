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

  updateProduct: async ({ id, formData }: { id: string, formData: FormData }) => {
    const response = await apiClient.patch(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await apiClient.delete(`/products/${id}/`);
    return response.data;
  }
};

export default adminApi;