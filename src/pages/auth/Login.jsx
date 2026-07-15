import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ShieldCheck, Mail, Lock } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 ">
      {/* Logo */}
      <div className="flex flex-col items-center mb-6 ">
        <div className="bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
          <ShieldCheck className="text-white" size={24} />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-gray-900">EWA Admin</h1>
        <p className="text-sm text-gray-500 mt-1">Access the management console</p>
      </div>

      {/* Card */}
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-600 tracking-wide uppercase">
              Email Address
            </label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                name="email"
                placeholder="admin@ewa.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-600 tracking-wide uppercase">
                Password
              </label>
              <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                Forgot?
              </a>
            </div>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? "Logging in..." : "Login →"}
          </button>

          <p className="text-center text-sm text-gray-500 pt-2">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-medium hover:text-indigo-700">
              Register
            </Link>
          </p>
        </form>
      </div>

      <p className="text-xs text-gray-400 mt-8">
        © {new Date().getFullYear()} EWA Administrative Systems. All rights reserved.
      </p>
    </div>
  );
};

export default Login;