// src/features/auth/api.ts
import * as z from 'zod';
import { LoginSchema, RegisterSchema } from './schemas';
import apiClient, { API_BASE_URL } from '../../lib/axios';
import type { LoginResponse } from '@/types/user';

export const authApi = {
    login: async (data: z.infer<typeof LoginSchema>): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>("/auth/login/", data);
        return response.data;
    },

    register: async (
        data: Omit<z.infer<typeof RegisterSchema>, 'confirmPassword'> & { role: string }
    ): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/register/', data);
        return response.data;
    },

    logout: () => {
        return apiClient.post('/auth/logout');
    },

    getUserProfile: () => {
        return apiClient.get('/users/me');
    },

    getGoogleUrl: () => {
        return `${API_BASE_URL}/auth/google/`;
    }
};
