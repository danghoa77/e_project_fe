import { Sidebar } from "./dashboard/Sidebar";
import { AdminHeader } from "./dashboard/AdminHeader";
import { Outlet } from "react-router-dom";
export const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-[#F7F2EC] font-sans">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-8 pt-24">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
