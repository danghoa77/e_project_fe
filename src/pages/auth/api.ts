// src/features/auth/api.ts

import * as z from 'zod';
import { LoginSchema, RegisterSchema } from './schemas';
import apiClient, { API_BASE_URL } from '../../lib/axios';
import type { LoginResponse, UserType } from '@/types/user';

export const login = async (data: z.infer<typeof LoginSchema>): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/login/", data);
    return response.data;
};

export const register = async (
    data: Omit<z.infer<typeof RegisterSchema>, 'confirmPassword'> & { role: string }
): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/register/', data);
    return response.data;
};

export const logout = () => {
    return apiClient.post('/auth/logout');
};

export const getUserProfile = () => {
    return apiClient.get<UserType>('/users/me/');
};


export const getGoogleUrl = () => {
    return `${API_BASE_URL}/auth/google/`;
};
