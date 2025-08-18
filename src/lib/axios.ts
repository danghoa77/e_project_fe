import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

export const API_BASE_URL = 'https://18a1a04c87f4.ngrok-free.app';

const apiClient = axios.create({
    baseURL: 'http://localhost:80',
    headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json'
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
// interceptor token in response
apiClient.interceptors.response.use(
    response => response,
    async (error) => {
        if (error.response?.status === 401) {
            const authStore = useAuthStore.getState();
            authStore.logout();
            window.location.href = '/login';

            return;
        }

        return Promise.reject(error);
    }
);


export default apiClient;