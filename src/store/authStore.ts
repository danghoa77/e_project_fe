// src/store/authStore.ts
// 1. Component gọi useAuthStore(...) để subscribe vào store.
// 2. Khi gọi setUser / setLoading / logout → hàm set() được chạy.
// 3. set() cập nhật state trong store.
// 4. Zustand notify tất cả component đã subscribe.
// 5. React rerender component với state mới → UI cập nhật realtime.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserType } from '@/types/user';

interface AuthState {
    user: UserType | null;
    token: string | null;
    isLoading: boolean;
    setUser: (user: UserType | null, token: string | null) => void;
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
