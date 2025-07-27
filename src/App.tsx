// src/App.tsx
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useLocation,
} from 'react-router-dom';
import * as React from 'react';
import './index.css';
import ProtectedRoute from './routes/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { HomePage } from './features/products/HomePage';
import { Navbar } from './components/shared/Navbar';
import { Footer } from './components/shared/Footer';
import { AuthPage } from './features/auth/AuthPage';
import { ProductListPage } from './features/products/ProductListPage';
import { ProductDetailPage } from './features/products/ProductDetailPage';
import { Toaster } from "@/components/ui/sonner";

const ProfilePage = () => <div>Trang Hồ Sơ Khách Hàng</div>;
const AdminDashboardPage = () => <div>Trang Quản Trị (Admin Dashboard)</div>;

const AppLayout = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="max-w-screen-2xl mx-auto bg-white shadow-sm">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors />
    </div>
  );
};

const AuthRedirect = () => {
  const { user } = useAuthStore();
  if (user) {
    return user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/" />;
  }
  return <Navigate to="/" />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <AuthPage /> },
      { path: 'products', element: <ProductListPage /> },
      { path: 'products/:category', element: <ProductListPage /> },
      { path: 'product/:id', element: <ProductDetailPage /> },
      {
        element: <ProtectedRoute allowedRoles={['customer']} />,
        children: [
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      { path: 'admin', element: <AdminDashboardPage /> },
    ],
  },
  {
    path: '/auth/callback',
    element: <AuthRedirect />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;