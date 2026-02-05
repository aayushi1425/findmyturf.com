import api from "../../api";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { FormShimmer, ImageBlockShimmer } from "../../components/Shimmers";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [phone_no, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  // page shimmer load
  useEffect(() => {
    const t = setTimeout(() => setPageLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login/", {
        phone_no,
        password,
      });

      login(res.data.access, res.data.role);

      if (res.data.role === "OWNER") {
        navigate("/owner/turfs");
      } else {
        navigate("/turfs");
      }
    } catch (err) {
      setError("Invalid phone number or password");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-slate-900/90 px-4 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <ImageBlockShimmer />
          </div>
          <div className="w-full lg:w-1/2">
            <FormShimmer />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=1200')] bg-cover bg-center">
      <div className="min-h-screen bg-slate-950/70 px-4 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 lg:flex-row">
          <div className="w-full text-slate-50 lg:w-1/2">
            <h1 className="text-3xl font-bold">
              Welcome back to FindMyTurf
            </h1>
            <p className="mt-3 text-sm text-slate-200">
              Sign in to manage your bookings or turfs with a fast, sports-first
              dashboard.
            </p>
          </div>

          <div className="w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-sm lg:w-1/2">
            <h2 className="mb-4 text-xl font-bold text-center text-slate-900">
              Login
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            <input
              className="input"
              placeholder="Phone number"
              value={phone_no}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <input
              className="input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              disabled={loading}
              className={`w-full rounded-xl py-3 text-sm font-semibold transition ${
                loading
                  ? "bg-slate-300 animate-pulse"
                  : "bg-emerald-500 text-white hover:bg-emerald-600"
              }`}
            >
              {loading ? "Signing in..." : "Login"}
            </button>
            </form>

            <p className="mt-4 text-center text-sm text-slate-500">
              Don’t have an account?{" "}
              <Link to="/register" className="font-medium text-emerald-600">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
