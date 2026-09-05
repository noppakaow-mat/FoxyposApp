import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const menus = [
    {
      name: "Dashboard",
      path: "/manager/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Stock",
      path: "/manager/stock",
      icon: <Package size={20} />,
    },
    {
      name: "Employees",
      path: "/manager/employees",
      icon: <Users size={20} />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-yellow-400">
          FoxyPOS
        </h1>
        <p className="text-sm text-gray-400">
          Manager Panel
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-4">
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-4 transition-all
              ${
                isActive
                  ? "bg-yellow-500 text-black font-semibold"
                  : "hover:bg-gray-800"
              }`
            }
          >
            {menu.icon}
            <span>{menu.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-700 p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-500 py-3 hover:bg-red-600 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}