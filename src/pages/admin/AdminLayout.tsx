import { Sidebar } from "./dashboard/Sidebar";
import { AdminHeader } from "./dashboard/AdminHeader";
import { Outlet } from "react-router-dom";
import React from "react";

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [showHeader, setShowHeader] = React.useState(true);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setShowHeader(true);
      } else if (window.scrollY > lastScrollY.current) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex h-screen bg-[#F7F2EC] font-sans">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div
        className={`fixed inset-0 z-40 bg-black/40 md:hidden transition-opacity ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      >
        <div
          className={`absolute left-0 top-0 h-full w-64 bg-white shadow-md transform transition-transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <AdminHeader
          show={showHeader}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 overflow-y-auto p-6 pt-24">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
