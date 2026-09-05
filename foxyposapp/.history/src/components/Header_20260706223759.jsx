import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
    const { role, logout } = useContext(AuthContext);

    return (
        <header className="bg-white shadow-md border-b border-gray-200 px-8 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">FOXY POS</h1>
                    <p className="text-sm text-gray-600">Restaurant Buffet Management System</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-700">
                            {role === "cashier" ? "💳 Cashier" : role === "kitchen" ? "👨‍🍳 Kitchen" : "📊 Manager"}
                        </p>
                        <p className="text-xs text-gray-500">{new Date().toLocaleString("th-TH")}</p>
                    </div>

                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}
