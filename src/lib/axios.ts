import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

export const API_BASE_URL = 'https://a3c630d951a9.ngrok-free.app';

const apiClient = axios.create({
    baseURL: 'https://a3c630d951a9.ngrok-free.app',
    headers: {
        'ngrok-skip-browser-warning': 'true'
    }
});
apiClient.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

//interceptor token in request
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