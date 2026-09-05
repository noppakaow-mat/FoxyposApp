import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

export default function ManagerLayout() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className={`bg-black text-white p-4 transition-all ${open ? "w-64" : "w-20"}`}>

        <button
          className="mb-6 text-sm hover:text-gray-300"
          onClick={() => setOpen(!open)}
          title="Toggle sidebar"
        >
          ☰
        </button>

        <nav className="space-y-4">

          <Link 
            to="/manager" 
            className="block hover:text-gray-300 transition-colors"
          >
            📊 {open && "Dashboard"}
          </Link>

          <Link 
            to="/manager/employees" 
            className="block hover:text-gray-300 transition-colors"
          >
            👤 {open && "Employees"}
          </Link>

          <Link 
            to="/manager/stock" 
            className="block hover:text-gray-300 transition-colors"
          >
            📦 {open && "Stock"}
          </Link>

        </nav>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>

    </div>
  );
}
