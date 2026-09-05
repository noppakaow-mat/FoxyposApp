import { useLocation } from "react-router-dom";
import { UserCircle } from "lucide-react";

export default function Header() {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/manager/dashboard":
        return "Dashboard";

      case "/manager/stock":
        return "Stock Management";

      case "/manager/employees":
        return "Employee Management";

      default:
        return "Manager";
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {getTitle()}
        </h1>

        <p className="text-sm text-gray-500">
          Welcome to FoxyPOS Manager
        </p>
      </div>

      <div className="flex items-center gap-3">
        <UserCircle
          size={40}
          className="text-yellow-500"
        />

        <div className="text-right">
          <p className="font-semibold">
            {user?.username}
          </p>

          <p className="text-sm text-gray-500">
            {user?.role}
          </p>
        </div>
      </div>
    </header>
  );
}