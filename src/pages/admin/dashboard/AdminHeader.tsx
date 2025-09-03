import { useAuthStore } from "@/store/authStore";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
export const AdminHeader = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      toast.info("You have been logged out.");
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
      toast.error("Logout failed. Please try again.");
    }
  };
  return (
    <header className="fixed top-0 left-64 right-0 z-10 flex h-20 items-center justify-between border-b border-neutral-200/80 bg-white/80 px-8 backdrop-blur-sm">
      <div>
        <span className="ml-2 text-xs font-sans tracking-widest text-neutral-500">
          ADMIN : {user?.name ?? " "}
        </span>
      </div>
      <div className="flex items-center space-x-6">
        <button onClick={handleLogout}>
          <LogOut className="h-6 w-6 text-red-400 hover:text-red-600" />
        </button>
      </div>
    </header>
  );
};
