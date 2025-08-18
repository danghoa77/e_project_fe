// src/features/auth/api.ts
import * as z from 'zod';
import { LoginSchema, RegisterSchema } from './schemas';
import apiClient, { API_BASE_URL } from '../../lib/axios';
import type { LoginResponse } from '@/types/user';

export const authApi = {
    // Đăng nhập
    login: async (data: z.infer<typeof LoginSchema>): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>("/auth/login/", data);
        return response.data;
    },

    // Đăng ký
    register: async (
        data: Omit<z.infer<typeof RegisterSchema>, 'confirmPassword'> & { role: string }
    ): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/register/', data);
        return response.data;
    },

    // Đăng xuất
    logout: () => {
        return apiClient.post('/auth/logout');
    },

    // Lấy thông tin user hiện tại
    getUserProfile: () => {
        return apiClient.patch('/users/me');
    },

    // Lấy URL đăng nhập Google
    getGoogleUrl: () => {
        return `${API_BASE_URL}/auth/google/`;
    }
};
