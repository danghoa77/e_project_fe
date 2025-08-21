import { Link, NavLink } from "react-router-dom";
import {
  ShoppingBag,
  Package,
  Users,
  CreditCard,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Chatting", href: "/admin/chatting", icon: MessageSquare },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-neutral-200/80">
      <div className="flex h-full flex-col">
        <div className="flex h-20 items-center justify-center border-b border-neutral-200/80">
          <h1 className="text-xl font-serif tracking-widest text-neutral-800">
            <Link to="/">HERMES</Link>
          </h1>
          <span className="ml-2 text-xs font-sans tracking-widest text-neutral-500"></span>
          <h1 className="text-xl font-serif tracking-widest text-neutral-800"></h1>
          <span className="ml-2 text-xs font-sans tracking-widest text-neutral-500">
            ADMIN
          </span>
        </div>
        <nav className="flex-1 px-4 py-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  end={item.href === "/admin"}
                  className={({ isActive }) =>
                    `flex items-center rounded-md px-4 py-3 text-sm font-medium transition-colors 
                    ${
                      isActive
                        ? "bg-neutral-100 text-neutral-900"
                        : "text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-900"
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};
