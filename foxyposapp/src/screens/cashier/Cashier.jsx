import { Outlet } from "react-router-dom";
import Header from "../../components/Header";

export default function CashierScreen() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1 overflow-auto bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}