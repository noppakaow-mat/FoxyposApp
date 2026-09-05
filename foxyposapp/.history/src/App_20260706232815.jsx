import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginScreen from "./screens/login/LoginScreen";
import ProtectedRoute from "./routes/ProtectedRoute";

import Cashier from "./screens/cashier/Cashier";
import TableManagementScreen from "./screens/cashier/TableManagementScreen";

import Kitchen from "./screens/kitchen/Kitchen";

import ManagerLayout from "./screens/manager/ManagerLayout";
import Dashboard from "./screens/manager/Dashboard";
import EmployeeManagementScreen from "./screens/manager/EmployeeManagementScreen";
import StockManagementScreen from "./screens/manager/StockManagementScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<LoginScreen />} />

        {/* Cashier Routes */}
        <Route
          path="/cashier"
          element={
            <ProtectedRoute role="cashier">
              <Cashier />
            </ProtectedRoute>
          }
        >
          <Route index element={<TableManagementScreen />} />
          <Route path="tables" element={<TableManagementScreen />} />
        </Route>

        {/* Kitchen Routes */}
        <Route
          path="/kitchen"
          element={
            <ProtectedRoute role="kitchen">
              <Kitchen />
            </ProtectedRoute>
          }
        />

        {/* Manager Routes */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute role="admin">
              <ManagerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<EmployeeManagementScreen />} />
          <Route path="stock" element={<StockManagementScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}