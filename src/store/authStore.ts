// src/store/authStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    setUser: (user: User | null, token: string | null) => void;
    setLoading: (isLoading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isLoading: false,

            setUser: (user, token) => set({ user, token }),
            setLoading: (isLoading) => set({ isLoading }),
            logout: () => set({ user: null, token: null }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
            }),
        }
    )
);
