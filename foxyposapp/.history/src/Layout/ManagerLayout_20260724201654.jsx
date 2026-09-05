import { Outlet } from "react-router-dom";

import Sidebar from "../components/manager/Sidebar";
import Header from "../components/manager/sidebarHeader";


export default function ManagerLayout() {

  return (
    <div className="min-h-screen bg-gray-100 flex">

      <Sidebar />


      <main className="flex-1">

        <Header title="Manager" />


        <div className="p-6">

          <Outlet />

        </div>

      </main>

    </div>
  );
}