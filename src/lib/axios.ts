import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
        if (error.response?.status === 401) { //no permission
            const authStore = useAuthStore.getState();
            authStore.logout();
            if (window.location.pathname !== '/login') {
                toast.error('Please login again.');
            }
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);

            return;
        }

        return Promise.reject(error);
    }
);


export default apiClient;