// src/App.tsx
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from 'react-router-dom';
import './index.css';
import ProtectedRoute from './routes/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { HomePage } from './features/products/HomePage';
import { Navbar } from './components/shared/Navbar';
import { Footer } from './components/shared/Footer';

const LoginPage = () => <div>Trang Đăng Nhập</div>;
const ProfilePage = () => <div>Trang Hồ Sơ Khách Hàng</div>;
const AdminDashboardPage = () => <div>Trang Quản Trị (Admin Dashboard)</div>;

const AppLayout = () => (
  <div className="max-w-screen-2xl mx-auto bg-white shadow-sm">
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

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
      { path: 'login', element: <LoginPage /> },
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
