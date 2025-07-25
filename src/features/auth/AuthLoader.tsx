// src/features/auth/AuthLoader.tsx
// lấy thông tin người dùng và cập nhật vào authStore 
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios'; // Giả sử bạn dùng axios
import { useAuthStore } from '@/store/authStore';
import type { User } from '@/types/index';

// Hàm gọi API để lấy thông tin người dùng
const fetchUserProfile = async (): Promise<User> => {
    // Backend sẽ đọc session cookie từ request này
    const { data } = await axios.get('/api/auth/me'); // Thay bằng endpoint thật của bạn
    return data;
};

export const AuthLoader = ({ children }: { children: React.ReactNode }) => {
    const setUser = useAuthStore((state) => state.setUser);

    // Dùng useQuery để lấy dữ liệu, React Query sẽ tự quản lý caching
    const { data: user, isError } = useQuery({
        queryKey: ['me'], // Khóa để cache dữ liệu người dùng
        queryFn: fetchUserProfile,
        retry: 1, // Chỉ thử lại 1 lần nếu lỗi
    });

    useEffect(() => {
        if (user) {
            setUser(user);
        }
        if (isError) {
            // Nếu có lỗi (vd: 401 Unauthorized), tức là session không hợp lệ
            setUser(null);
        }
    }, [user, isError, setUser]);

    return <>{children}</>;
};