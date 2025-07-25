// src/App.tsx
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import { useAuthStore } from './store/authStore';

// --- Các Component Trang Mẫu ---
// Sau này bạn sẽ thay thế các component này bằng các file thật trong thư mục /features
const HomePage = () => <div>Trang Chủ</div>;
const LoginPage = () => <div>Trang Đăng Nhập</div>;
const ProfilePage = () => <div>Trang Hồ Sơ Khách Hàng</div>;
const AdminDashboardPage = () => <div>Trang Quản Trị (Admin Dashboard)</div>;
// ------------------------------


// Component Layout chung (ví dụ: có Navbar và Footer)
const AppLayout = () => (
  <div>
    <header>Đây là Navbar</header>
    <main>
      <Outlet />
    </main>
    <footer>Đây là Footer</footer>
  </div>
);

// Component xử lý chuyển hướng tự động sau khi đăng nhập
const AuthRedirect = () => {
  const { user } = useAuthStore();
  if (user) {
    // Nếu là admin, chuyển hướng đến trang quản trị
    return user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/" />;
  }
  // Nếu không có user, quay về trang chủ
  return <Navigate to="/" />;
};


const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      // --- Public Routes ---
      { index: true, element: <HomePage /> },

      // --- Authentication Routes ---
      { path: 'login', element: <LoginPage /> },
      // Thêm route cho register ở đây

      // --- Protected Customer Routes ---
      {
        element: <ProtectedRoute allowedRoles={['customer']} />,
        children: [
          { path: 'profile', element: <ProfilePage /> },
          // Thêm các route khác của customer ở đây (orders, checkout...)
        ],
      },
    ],
  },
  // --- Protected Admin Routes ---
  {
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      { path: 'admin', element: <AdminDashboardPage /> },
      // Thêm các route quản lý sản phẩm, đơn hàng... ở đây
    ],
  },
  // Route để xử lý chuyển hướng sau khi đăng nhập thành công
  {
    path: '/auth/callback',
    element: <AuthRedirect />,
  },
]);

function App() {
  // AuthLoader đã được chuyển ra file main.tsx
  // App chỉ cần chịu trách nhiệm render RouterProvider
  return <RouterProvider router={router} />;
}

export default App;