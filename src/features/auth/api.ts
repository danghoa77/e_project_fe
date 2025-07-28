import apiClient from '@/api/axios';
import { LoginSchema, RegisterSchema } from './schemas';
import * as z from 'zod';

// Định nghĩa kiểu dữ liệu trả về từ API login
interface LoginResponse {
    user: any; // Thay 'any' bằng type User của bạn
    accessToken: string;
}

// Hàm xử lý đăng nhập
export const loginUser = async (data: z.infer<typeof LoginSchema>): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
};

// Hàm xử lý đăng ký
export const registerUser = async (data: Omit<z.infer<typeof RegisterSchema>, 'confirmPassword'>) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
};

// Hàm lấy URL đăng nhập Google
export const getGoogleAuthUrl = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://82e7bf679657.ngrok-free.app';
    return `${baseUrl}/auth/google`;
};