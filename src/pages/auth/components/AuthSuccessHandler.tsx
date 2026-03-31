import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '../api';
import { toast } from 'sonner';

export const AuthSuccessHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setUser } = useAuthStore();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        // Kiểm tra nếu đường dẫn là /auth-success và có token
        if (location.pathname === '/auth-success' && token) {
            const handleLogin = async () => {
                try {
                    // Lưu token vào store
                    useAuthStore.setState({ token });

                    // Lấy thông tin user
                    const { data: user } = await authApi.getUserProfile();
                    setUser(user, token);
                    
                    toast.success('Đăng nhập Google thành công!');
                    
                    // Sau khi xử lý xong, điều hướng về trang chủ và xóa query params
                    navigate('/', { replace: true });
                } catch (err) {
                    console.error('Lỗi auth popup:', err);
                    toast.error('Không thể xác thực thông tin người dùng.');
                    navigate('/login', { replace: true });
                }
            };

            handleLogin();
        }
    }, [location, navigate, setUser]);

    return null; // Component này không hiển thị gì lên UI
};
