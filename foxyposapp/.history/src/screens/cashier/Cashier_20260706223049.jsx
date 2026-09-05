import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function CashierScreen() {
    return (
        <div className="flex h-screen">

            <Sidebar />

            <div className="flex-1 flex flex-col">

                <Header />

                <main className="flex-1 p-6 bg-gray-100 overflow-auto">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}