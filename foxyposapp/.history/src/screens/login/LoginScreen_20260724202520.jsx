import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { login as loginService } from "../../services/authService";

import eyeOn from "../../assets/icons/eyesOn.svg";
import eyeOff from "../../assets/icons/eyesOff.svg";

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
      case "manager":
      navigate("/manager");
      break;
      
      case "cashier":
        navigate("/cashier");
        break;
      case "kitchen":
        navigate("/kitchen");
        break;
      default:
        navigate("/");
    }
  };

  const handleLogin = async (user, pass) => {
    setLoading(true);
    setError("");

    try {
      const data = await loginService({
        username: user,
        password: pass,
      });

      login(data);

      routeByRole(data.user.role);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };
  const submit = (e) => {
    e.preventDefault();
    handleLogin(username, password);
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
            <label className="text-sm text-zinc-300 mb-2 block text-left">
              Username
            </label>

            <input
              type="text"
              placeholder="Enter username"
              className="w-full rounded-xl bg-zinc-700 border border-zinc-600 px-4 py-3 text-white outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-zinc-300 mb-2 block text-left">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="w-full rounded-xl bg-zinc-700 border border-zinc-600 px-4 py-3 text-white outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center justify-center w-12"
              >
                <img
                  src={showPassword ? eyeOn : eyeOff}
                  alt="Toggle password"
                  className="w-5 h-5 object-contain invert"
                />
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
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-black font-bold py-3 rounded-xl transition duration-300"
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>

        <div className="mt-8 text-center text-zinc-500 text-xs">
          © 2026 FoxyPOS Restaurant System
        </div>
      </div>
    </div>
  );
}
