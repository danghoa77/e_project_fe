import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/api/axios';
import type { User } from '@/types';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

// Hàm gọi API để lấy thông tin người dùng
const fetchUserProfile = async (): Promise<User> => {
    const { data } = await apiClient.get('/users/me');
    return data;
};

// Component AuthLoader
export const AuthLoader = ({ children }: { children: ReactNode }) => {
    // Lấy token và hàm setUser từ store
    const token = useAuthStore((state) => state.token);
    const setUser = useAuthStore((state) => state.setUser);
    const logout = useAuthStore((state) => state.logout);

    // Sử dụng useQuery để gọi API, nhưng chỉ khi có token
    const { data: user, isLoading, isError } = useQuery({
        queryKey: ['me'],
        queryFn: fetchUserProfile,
        enabled: !!token, // Rất quan trọng: chỉ chạy query này khi token tồn tại
        retry: 1, // Thử lại 1 lần nếu lỗi
        staleTime: 5 * 60 * 1000, // Dữ liệu được coi là mới trong 5 phút
    });

    useEffect(() => {
        // Sau khi query kết thúc
        if (!isLoading) {
            if (user) {
                // Nếu có dữ liệu user trả về, cập nhật lại store
                // Giữ nguyên token cũ đang hợp lệ
                setUser(user, token);
            } else if (isError) {
                // Nếu query lỗi (ví dụ: token hết hạn), thực hiện logout
                logout();
            }
        }
    }, [user, isLoading, isError, token, setUser, logout]);

    // Trong khi đang chờ API trả về, hiển thị màn hình loading
    // Điều này ngăn việc các component con render với trạng thái đăng nhập sai
    if (isLoading && token) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <p className="text-lg">Authenticating...</p>
            </div>
        );
    }

    // Khi đã xử lý xong, hiển thị các component con
    return <>{children}</>;
};