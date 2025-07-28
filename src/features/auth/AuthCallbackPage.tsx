import { useEffect, } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/api/axios'; // <-- Sử dụng apiClient đã cấu hình
import type { User } from '@/types';
import { Logger } from '../../utils/logger';



export const AuthCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUser } = useAuthStore();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // 1. Lấy token từ URL
            console.log('Received token:', token);

            // 2. Dùng token để gọi API lấy thông tin người dùng
            const fetchUser = async () => {
                try {
                    // Gắn token vào header cho request này
                    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    const response = await apiClient.get<User>('/users/me'); // <-- Cần có endpoint này ở backend
                    const user = response.data;

                    // 3. Cập nhật state với token và thông tin user
                    setUser(user, token);
                    Logger.info('User profile fetched', user);
                    Logger.debug('Token received (masked)', token?.slice(0, 10) + '...');
                    // 4. Chuyển hướng về trang chủ
                    navigate('/');

                } catch (error) {
                    console.error('Failed to fetch user profile:', error);
                    // Nếu lỗi, xóa state và chuyển về trang login
                    setUser(null, null);
                    navigate('/login');
                }
            };

            fetchUser();
        } else {
            // Không có token, chuyển về trang login
            console.error('No token found in callback URL');
            navigate('/login');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, navigate, setUser]);

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p className="text-lg">Đang xử lý đăng nhập...</p>
        </div>
    );
};