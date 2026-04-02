import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "../api";
import { toast } from "sonner";

export const AuthSuccessHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (location.pathname === "/auth-success" && token) {
      const handleLogin = async () => {
        try {
          useAuthStore.setState({ token });

          const { data: user } = await authApi.getUserProfile();
          setUser(user, token);

          toast.success("Login Google Successfully!");
          navigate("/", { replace: true });
        } catch (err) {
          console.error("Lỗi auth popup:", err);
          toast.error("Không thể xác thực thông tin người dùng.");
          navigate("/login", { replace: true });
        }
      };

      handleLogin();
    }
  }, [location, navigate, setUser]);

  return null;
};
