// src/store/authStore.ts
import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
    user: User | null;
    isLoading: boolean; // Trạng thái cho lần kiểm tra đăng nhập đầu tiên
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true, // Ban đầu, ta mặc định là đang kiểm tra
    setUser: (user) => set({ user, isLoading: false }),
    logout: () => set({ user: null, isLoading: false }),
}));