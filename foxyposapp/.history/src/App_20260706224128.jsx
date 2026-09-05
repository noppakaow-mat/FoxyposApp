import { Routes, Route } from "react-router-dom";

import LoginScreen from "./screens/login/LoginScreen";
import ProtectedRoute from "./routes/ProtectedRoute";

import Cashier from "./screens/cashier/Cashier";
import TableManagementScreen from "./screens/cashier/TableManagementScreen";
import Kitchen from "./screens/kitchen/Kitchen";
import Dashboard from "./screens/manager/Dashboard";

export default function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<LoginScreen />} />

      {/* Cashier */}
      <Route element={<ProtectedRoute allowedRoles={["cashier"]} />}>
        <Route path="/cashier" element={<Cashier />}>
          {/* Default page */}
          <Route index element={<TableManagementScreen />} />
          
          {/* Table management */}
          <Route path="tables" element={<TableManagementScreen />} />
        </Route>
      </Route>

      {/* Kitchen */}
      <Route element={<ProtectedRoute allowedRoles={["kitchen"]} />}>
        <Route path="/kitchen" element={<Kitchen />} />
      </Route>

      {/* Manager */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/manager/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}