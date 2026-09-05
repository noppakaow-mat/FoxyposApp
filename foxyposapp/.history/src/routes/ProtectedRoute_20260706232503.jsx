import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // ถ้า role ไม่ตรง
    if (role === "cashier") return <Navigate to="/cashier" />;
    if (role === "kitchen") return <Navigate to="/kitchen" />;
    if (role === "admin") return <Navigate to="/manager/dashboard" />;
  }

  return <Outlet />;
}