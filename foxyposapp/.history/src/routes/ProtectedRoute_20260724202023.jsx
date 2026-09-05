import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ roles, children }) {
  const { token, role: userRole } = useAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(userRole)) {
    // ถ้า role ไม่ตรง
    if (userRole === "cashier") return <Navigate to="/cashier" />;
    if (userRole === "kitchen") return <Navigate to="/kitchen" />;
    if (userRole === "manager") return <Navigate to=/
    return <Navigate to="/" replace />;
  }

  return children;
}
