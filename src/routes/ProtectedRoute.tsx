// src/routes/ProtectedRoute.tsx
import type { ReactNode } from 'react'; // 1. Thêm import ReactNode
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import type { UserRole } from '@/types';

// Giả sử bạn đang dùng logic này, không phải logic với isHydrated
// Nếu dùng isHydrated, chỉ cần áp dụng thay đổi tương tự

interface ProtectedRouteProps {
    allowedRoles: UserRole[];
    children: ReactNode; // 2. Khai báo prop 'children'
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => { // 3. Nhận prop 'children'
    const { user } = useAuthStore();

    if (!user) {
        // Nếu chưa đăng nhập, chuyển về trang login
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        // Nếu vai trò không hợp lệ, chuyển về trang chủ
        return <Navigate to="/" replace />;
    }

    // 4. Nếu hợp lệ, render 'children' thay vì <Outlet />
    return <>{children}</>;
};

export default ProtectedRoute;