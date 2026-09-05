import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (user, pass) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user,
          password: pass,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      login(data.token, data.role);

      // redirect ตาม role
      routeByRole(data.role);
    } catch (err) {
      alert(err.message);
    }
  };

  const routeByRole = (role) => {
    if (role === "cashier") navigate("/cashier");
    else if (role === "kitchen") navigate("/kitchen");
    else if (role === "admin") navigate("/manager/dashboard");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin(username, password);
  };

  // 🔥 Quick login สำหรับ test
  const quickLogin = (type) => {
    if (type === "cashier") handleLogin("cashier", "1234");
    if (type === "kitchen") handleLogin("kitchen", "1234");
    if (type === "admin") handleLogin("admin", "1234");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg">
        
        <h1 className="text-2xl font-bold text-center mb-6">
          FoxyPOS Login
        </h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            className="w-full p-3 rounded bg-gray-700 outline-none"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 rounded bg-gray-700 outline-none"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded font-semibold"
            type="submit"
          >
            Login
          </button>
        </form>

        {/* Quick Login */}
        <div className="mt-6 space-y-2">
          <p className="text-sm text-gray-400 text-center">
            Quick Login (Test)
          </p>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => quickLogin("cashier")}
              className="bg-green-600 py-2 rounded text-sm"
            >
              Cashier
            </button>

            <button
              onClick={() => quickLogin("kitchen")}
              className="bg-yellow-600 py-2 rounded text-sm"
            >
              Kitchen
            </button>

            <button
              onClick={() => quickLogin("admin")}
              className="bg-red-600 py-2 rounded text-sm"
            >
              Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}   