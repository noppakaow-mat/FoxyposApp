import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ role, children }) {
  const { token, role: userRole } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role && userRole !== role) {
    // ถ้า role ไม่ตรง
    if (userRole === "cashier") return <Navigate to="/cashier" />;
    if (userRole === "kitchen") return <Navigate to="/kitchen" />;
    if (userRole === "admin") return <Navigate to="/manager" />;
  }

  return children;
}