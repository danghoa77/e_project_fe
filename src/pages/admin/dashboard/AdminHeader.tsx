import { useAuthStore } from "@/store/authStore";
import { LogOut, Menu } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/pages/auth/api";

interface AdminHeaderProps {
  show: boolean;
  onToggleSidebar: () => void;
}

export const AdminHeader = ({ show, onToggleSidebar }: AdminHeaderProps) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      await logout();
      toast.info("You have been logged out.");
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-10 flex h-16 items-center justify-between border-b border-neutral-200/80 bg-white/80 px-4 backdrop-blur-sm shadow-sm transition-transform duration-300 md:left-64 md:h-20 md:px-8
      ${show ? "translate-y-0" : "-translate-y-full"}`}
    >
      <button
        className="md:hidden p-2 rounded-md hover:bg-neutral-100"
        onClick={onToggleSidebar}
      >
        <Menu className="h-6 w-6 text-neutral-700" />
      </button>

      <div className="flex-1 flex justify-end md:justify-between items-center">
        <span className="hidden md:block ml-2 text-xs font-sans tracking-widest text-neutral-500">
          ADMIN : {user?.name ?? " "}
        </span>
        <button onClick={handleLogout}>
          <LogOut className="h-6 w-6 text-red-400 hover:text-red-600" />
        </button>
      </div>
    </header>
  );
};
