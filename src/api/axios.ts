import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://82e7bf679657.ngrok-free.app',
    headers: {
        'ngrok-skip-browser-warning': 'true'
    }
});

// Sử dụng interceptor để tự động thêm token vào mỗi request
apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;