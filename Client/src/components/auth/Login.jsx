import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import TopNotification from "../layout/Notification.jsx";

export default function Login() {
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [notification, setNotification] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      setNotification("Logged in successfully")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setNotification("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">

      {notification && <TopNotification message={notification} />}

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-zinc-800">Welcome back</h1>
          <p className="text-sm text-zinc-400 mt-1">Sign in to your account</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                Password
              </label>
              <span className="text-xs text-indigo-500 cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>

            <div className="relative mt-1">
              <input
                type={showPasswords ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-zinc-200 rounded-xl px-3 py-2 pr-10 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />

              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPasswords ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-xl transition-colors mt-2"
          >
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-400 mt-6">
          Don't have an account?{" "}
          <span className="text-indigo-500 cursor-pointer hover:underline">
            Contact your administrator
          </span>
        </p>

        {error && (
          <div className="text-center text-xs text-red-400 mt-4">{error}</div>
        )}
      </div>
    </div>
  );
}