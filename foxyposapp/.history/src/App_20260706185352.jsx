import { Routes, Route } from "react-router-dom";

import LoginScreen from "./screens/login/LoginScreen";
import ProtectedRoute from "./routes/ProtectedRoute";

import Cashier from "./screens/cashier/Cashier";
import Kitchen from "./screens/kitchen/Kitchen";
import Dashboard from "./screens/manager/Dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />

      <Route element={<ProtectedRoute allowedRoles={["cashier"]} />}>
        <Route path="/cashier" element={<Cashier />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["kitchen"]} />}>
        <Route path="/kitchen" element={<Kitchen />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/manager/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}