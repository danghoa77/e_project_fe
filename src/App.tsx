import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";
import * as React from "react";
import "./index.css";

import { Navbar } from "./components/shared/Navbar";
import { Footer } from "./components/shared/Footer";
import { Toaster } from "@/components/ui/sonner";
import { HomePage } from "./pages/customer/products/HomePage";
import { AuthPage } from "./pages/auth/AuthPage";
import { ProductListPage } from "./pages/customer/products/ProductListPage";
import { ProductDetailPage } from "./pages/customer/products/ProductDetailPage";
import { OrderPage } from "./pages/customer/orders/OrderPage";
import { OrderResultPage } from "./pages/customer/orders/OrderResultPage";
import { ProfilePage } from "./pages/customer/profile/ProfilePage";
import { AuthCallbackPage } from "./pages/auth/AuthCallbackPage";
import { AuthLoader } from "./pages/auth/AuthLoader";
import ProtectedRoute from "./routes/ProtectedRoute";
import HideScrollbarStyle from "@/components/shared/HideScrollbar";
import { AdminDashboardPage } from "./pages/admin/dashboard/AdminDashboardPage";
import { AdminProductsPage } from "./pages/admin/products/AdminProductsPage";
import NotFoundPage from "./components/shared/NotFoundPage";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminOrdersPage } from "./pages/admin/orders/AdminOrdersPage";
import { AdminUsersPage } from "./pages/admin/users/AdminUsersPage";
import { AdminPaymentsPage } from "./pages/admin/payments/AdminPaymentsPage";
import { AdminChattingPage } from "./pages/admin/chatting/AdminChattingPage";
import { AdminDetailPage } from "./pages/admin/products/AdminDetailPage";
import { useAuthStore } from "./store/authStore";
import { customerApi } from "./pages/customer/api";
import { userStore } from "./store/userStore";
import { FloatingChatButton } from "./components/shared/FloatingChatButton";
export const AppLayout = () => {
  const { pathname } = useLocation();
  const { cartItemCount, setCartItemCount } = userStore();
  const { user } = useAuthStore();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  React.useEffect(() => {
    if (!user) {
      setCartItemCount(0);
      return;
    }
    const fetchData = async () => {
      try {
        const res = await customerApi.getCart();
        setCartItemCount(res.length);
      } catch (err) {
        setCartItemCount(0);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto bg-white shadow-sm">
      <HideScrollbarStyle />
      <Navbar cartItemCount={cartItemCount} />
      <main>
        <AuthLoader>
          <Outlet context={{ setCartItemCount }} />
        </AuthLoader>
      </main>
      <Footer />
      <Toaster richColors />
      {user?.role === "customer" && <FloatingChatButton />}
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "login", element: <AuthPage /> },
          { path: "products", element: <ProductListPage /> },
          { path: "products/:category", element: <ProductListPage /> },
          { path: "product/:id", element: <ProductDetailPage /> },
          { path: "order-result", element: <OrderResultPage /> },
          {
            path: "checkout",
            element: (
              <ProtectedRoute allowedRoles={["customer", "admin"]}>
                <OrderPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "profile",
            element: (
              <ProtectedRoute allowedRoles={["customer", "admin"]}>
                <ProfilePage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: "orders", element: <AdminOrdersPage /> },
          { path: "products", element: <AdminProductsPage /> },
          { path: "users", element: <AdminUsersPage /> },
          { path: "payments", element: <AdminPaymentsPage /> },
          { path: "chatting", element: <AdminChattingPage /> },
          { path: "products/:id", element: <AdminDetailPage /> },
        ],
      },
      {
        path: "auth/callback",
        element: <AuthCallbackPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
