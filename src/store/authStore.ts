import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
    user: User | null;
    token: string | null;
    setUser: (user: User | null, token: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            // Trạng thái ban đầu là chưa đăng nhập
            user: null,
            token: null,
            setUser: (user, token) => set({ user, token }),
            logout: () => {
                // Khi logout, xóa cả trong localStorage
                set({ user: null, token: null });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);