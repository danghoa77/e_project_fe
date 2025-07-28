// src/App.tsx

import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from 'react-router-dom';
import * as React from 'react';
import './index.css';

// Component và Page imports
import { Navbar } from './components/shared/Navbar';
import { Footer } from './components/shared/Footer';
import { Toaster } from "@/components/ui/sonner";
import { HomePage } from './features/products/HomePage';
import { AuthPage } from './features/auth/AuthPage';
import { ProductListPage } from './features/products/ProductListPage';
import { ProductDetailPage } from './features/products/ProductDetailPage';
import { OrderPage } from './features/orders/OrderPage';
import { ProfilePage } from './features/profile/ProfilePage';
import { AuthCallbackPage } from './features/auth/AuthCallbackPage';
import { AuthLoader } from './features/auth/AuthLoader';
import ProtectedRoute from './routes/ProtectedRoute';

// Component placeholder cho trang Admin
const AdminDashboardPage = () => <div>Trang Quản Trị (Admin Dashboard)</div>;

// Layout chính của ứng dụng
const AppLayout = () => {
  const { pathname } = useLocation();

  // Tự động cuộn lên đầu trang khi chuyển route
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="max-w-screen-2xl mx-auto bg-white shadow-sm">
      <Navbar />
      <main>
        {/* AuthLoader bọc Outlet để kiểm tra auth trước khi render trang */}
        <AuthLoader>
          <Outlet />
        </AuthLoader>
      </main>
      <Footer />
      <Toaster richColors />
    </div>
  );
};

// Cấu hình router cho toàn bộ ứng dụng
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />, // Sử dụng layout chính
    children: [
      {
        index: true, // Route cho trang chủ
        element: <HomePage />,
      },
      {
        path: 'login',
        element: <AuthPage />,
      },
      {
        path: 'products',
        element: <ProductListPage />,
      },
      {
        path: 'products/:category',
        element: <ProductListPage />,
      },
      {
        path: 'product/:id',
        element: <ProductDetailPage />,
      },
      {
        path: 'checkout', // Route này nên được bảo vệ
        element: (
          <ProtectedRoute allowedRoles={['customer']}>
            <OrderPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile', // Route này được bảo vệ
        element: (
          <ProtectedRoute allowedRoles={['customer']}>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/admin', // Route cho admin, không dùng AppLayout
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/auth/callback', // Route xử lý callback từ Google OAuth
    element: <AuthCallbackPage />,
  },
]);

// Component App chính
function App() {
  return <RouterProvider router={router} />;
}

export default App;