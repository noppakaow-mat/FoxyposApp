import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const routeByRole = (role) => {
    switch (role) {
      case "cashier":
        navigate("/cashier");
        break;
      case "kitchen":
        navigate("/kitchen");
        break;
      case "admin":
        navigate("/manager/dashboard");
        break;
      default:
        navigate("/");
    }
  };

  const handleLogin = async (user, pass) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user,
          password: pass,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login Failed");
      }

      login(data.token, data.role);

      routeByRole(data.role);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const submit = (e) => {
    e.preventDefault();
    handleLogin(username, password);
  };

  const quickLogin = (role) => {
    if (role === "cashier") {
      handleLogin("cashier", "1234");
    }

    if (role === "kitchen") {
      handleLogin("kitchen", "1234");
    }

    if (role === "admin") {
      handleLogin("admin", "1234");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-zinc-800 rounded-3xl shadow-2xl border border-zinc-700 p-8">

        {/* Logo */}

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-yellow-400">
            FoxyPOS
          </h1>

          <p className="text-zinc-400 mt-2">
            Restaurant Point of Sale
          </p>

        </div>

        {/* Error */}

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 rounded-xl p-3 mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">

          {/* Username */}

          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Username
            </label>

            <input
              type="text"
              placeholder="Enter username"
              className="w-full rounded-xl bg-zinc-700 border border-zinc-600 px-4 py-3 text-white outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

          </div>

          {/* Password */}

          <div>

            <label className="text-sm text-zinc-300 mb-2 block">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="w-full rounded-xl bg-zinc-700 border border-zinc-600 px-4 py-3 text-white outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-zinc-400 hover:text-yellow-400"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>

            </div>

          </div>

          {/* Remember */}

          <div className="flex items-center justify-between">

            <label className="flex items-center gap-2 text-zinc-400 text-sm">

              <input type="checkbox" />

              Remember me

            </label>

            <button
              type="button"
              className="text-yellow-400 text-sm hover:underline"
            >
              Forgot Password?
            </button>

          </div>

          {/* Login */}

          <button
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl transition duration-300 shadow-lg hover:shadow-yellow-400/30 disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Login"}
          </button>

        </form>

        {/* Divider */}

        <div className="flex items-center my-8">

          <div className="flex-1 h-px bg-zinc-700"></div>

          <span className="px-4 text-zinc-500 text-sm">
            Quick Login
          </span>

          <div className="flex-1 h-px bg-zinc-700"></div>

        </div>

        {/* Quick Login */}

        <div className="grid grid-cols-3 gap-3">

          <button
            onClick={() => quickLogin("cashier")}
            className="bg-zinc-700 hover:bg-yellow-400 hover:text-black rounded-xl py-3 text-white transition"
          >
            
            <br />
            Cashier
          </button>

          <button
            onClick={() => quickLogin("kitchen")}
            className="bg-zinc-700 hover:bg-yellow-400 hover:text-black rounded-xl py-3 text-white transition"
          >
            
            <br />
            Kitchen
          </button>

          <button
            onClick={() => quickLogin("admin")}
            className="bg-zinc-700 hover:bg-yellow-400 hover:text-black rounded-xl py-3 text-white transition"
          >
            
            <br />
            Manager
          </button>

        </div>

        <div className="mt-8 text-center text-zinc-500 text-xs">
          © 2026 FoxyPOS Restaurant System
        </div>

      </div>

    </div>
  );
}