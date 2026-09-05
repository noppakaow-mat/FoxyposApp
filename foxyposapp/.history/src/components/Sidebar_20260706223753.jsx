import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar() {
    const { role } = useContext(AuthContext);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const getLinkClass = (path) => {
        return `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive(path)
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-200"
        }`;
    };

    return (
        <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col shadow-lg">
            {/* Logo */}
            <div className="p-6 border-b border-gray-700">
                <h2 className="text-2xl font-bold">🦊 FOXY</h2>
                <p className="text-xs text-gray-400">POS System</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {role === "cashier" && (
                    <>
                        <Link to="/cashier/tables" className={getLinkClass("/cashier/tables")}>
                            <span className="text-xl">🪑</span>
                            <span>Table Management</span>
                        </Link>

                        <Link to="/cashier/orders" className={getLinkClass("/cashier/orders")}>
                            <span className="text-xl">📋</span>
                            <span>Orders</span>
                        </Link>

                        <Link to="/cashier/checkout" className={getLinkClass("/cashier/checkout")}>
                            <span className="text-xl">💰</span>
                            <span>Checkout</span>
                        </Link>
                    </>
                )}

                {role === "kitchen" && (
                    <>
                        <Link to="/kitchen/orders" className={getLinkClass("/kitchen/orders")}>
                            <span className="text-xl">🍽️</span>
                            <span>Orders</span>
                        </Link>
                    </>
                )}

                {role === "manager" && (
                    <>
                        <Link to="/manager/dashboard" className={getLinkClass("/manager/dashboard")}>
                            <span className="text-xl">📊</span>
                            <span>Dashboard</span>
                        </Link>

                        <Link to="/manager/reports" className={getLinkClass("/manager/reports")}>
                            <span className="text-xl">📈</span>
                            <span>Reports</span>
                        </Link>

                        <Link to="/manager/settings" className={getLinkClass("/manager/settings")}>
                            <span className="text-xl">⚙️</span>
                            <span>Settings</span>
                        </Link>
                    </>
                )}
            </nav>

            {/* Footer Info */}
            <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
                <p>v1.0.0</p>
                <p>© 2026 FOXY POS</p>
            </div>
        </aside>
    );
}
