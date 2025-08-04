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
import { HomePage } from './pages/customer/products/HomePage';
import { AuthPage } from './pages/auth/AuthPage';
import { ProductListPage } from './pages/customer/products/ProductListPage';
import { ProductDetailPage } from './pages/customer/products/ProductDetailPage';
import { OrderPage } from './pages/customer/orders/OrderPage';
import { ProfilePage } from './pages/customer/profile/ProfilePage';
import { AuthCallbackPage } from './pages/auth/AuthCallbackPage';
import { AuthLoader } from './pages/auth/AuthLoader';
import ProtectedRoute from './routes/ProtectedRoute';
// import { AdminHeader } from './pages/admin/dashboard/AdminHeader';
import { AdminDashboardPage } from './pages/admin/dashboard/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/products/AdminProductsPage';
import NotFoundPage from './components/shared/NotFoundPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminOrdersPage } from './pages/admin/orders/AdminOrdersPage';
import { AdminUsersPage } from './pages/admin/users/AdminUsersPage';
import { AdminPaymentsPage } from './pages/admin/payments/AdminPaymentsPage';
import { AdminChattingPage } from './pages/admin/chatting/AdminChattingPage';
export const AppLayout = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="max-w-screen-2xl mx-auto bg-white shadow-sm">
      <Navbar />
      <main>
        <AuthLoader>
          <Outlet />
        </AuthLoader>
      </main>
      <Footer />
      <Toaster richColors />
    </div>
  );
};


const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />, // Một component gốc chỉ để render các route con
    errorElement: <NotFoundPage />, // Thêm errorElement ở route gốc
    children: [
      {
        path: '/', // Nhóm các route sử dụng AppLayout
        element: <AppLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'login', element: <AuthPage /> },
          { path: 'products', element: <ProductListPage /> },
          { path: 'products/:category', element: <ProductListPage /> },
          { path: 'product/:id', element: <ProductDetailPage /> },
          {
            path: 'checkout',
            element: (
              <ProtectedRoute allowedRoles={['customer']}>
                <OrderPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'profile',
            element: (
              <ProtectedRoute allowedRoles={['customer', 'admin']}>
                <ProfilePage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      // Nhóm các route KHÔNG sử dụng AppLayout
      {
        path: 'admin',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'orders', element: <AdminOrdersPage /> },
          { path: 'products', element: <AdminProductsPage /> },
          { path: 'users', element: <AdminUsersPage /> },
          { path: 'payments', element: <AdminPaymentsPage /> },
          { path: 'chatting', element: <AdminChattingPage /> },
        ],
      },
      {
        path: 'auth/callback',
        element: <AuthCallbackPage />,
      },
      {
        path: 'auth/callback', // Route callback giờ đã nằm trong cây router
        element: <AuthCallbackPage />,
      },
      // Route bắt tất cả các đường dẫn không khớp (404)
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

// Component App chính
function App() {
  return <RouterProvider router={router} />;
}

export default App;