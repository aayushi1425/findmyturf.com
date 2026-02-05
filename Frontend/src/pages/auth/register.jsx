import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";
import useAuth from "../../hooks/useAuth";
import { FormShimmer, ImageBlockShimmer } from "../../components/Shimmers";

export default function Register() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [role, setRole] = useState("user");
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // shimmer loading state
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setPageLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (role === "user") {
                await api.post("/auth/register/user/", {
                    name: form.name,
                    phone_no: form.phone,
                    password: form.password,
                });
            } else {
                await api.post("/auth/register/owner/", {
                    name: form.name,
                    phone_no: form.phone,
                    password: form.password,
                    business_name: form.business,
                });
            }

            navigate("/login");
        } catch (err) {
            setError("Registration failed");
        } finally {
            setLoading(false);
        }
    };

    // ✅ shimmer screen
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
                                Create your FindMyTurf account
                            </h1>
                            <p className="mt-3 text-sm text-slate-200">
                                Book as a player or manage multiple turfs as a business – switch
                                roles anytime after signup.
                            </p>
                        </div>

                        <div className="w-full max-w-md rounded-2xl bg-white/95 p-8 shadow lg:w-1/2">
                    <h2 className="text-xl font-bold text-center text-slate-900">
                        Create Account
                    </h2>

                    {/* ROLE SWITCH */}
                    <div className="mt-4 flex overflow-hidden rounded-xl border bg-slate-50">
                        <button
                            type="button"
                            onClick={() => setRole("user")}
                            className={`flex-1 py-2 text-sm font-medium ${
                                role === "user"
                                    ? "bg-emerald-500 text-white"
                                    : "bg-transparent text-slate-700"
                            }`}
                        >
                            User
                        </button>

                        <button
                            type="button"
                            onClick={() => setRole("owner")}
                            className={`flex-1 py-2 text-sm font-medium ${
                                role === "owner"
                                    ? "bg-emerald-500 text-white"
                                    : "bg-transparent text-slate-700"
                            }`}
                        >
                            Business
                        </button>
                    </div>

                    <form onSubmit={handleRegister} className="mt-6 space-y-4">
                        {error && (
                            <div className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <input
                            className="input"
                            placeholder="Full name"
                            onChange={(e) => set("name", e.target.value)}
                            required
                        />

                        <input
                            className="input"
                            placeholder="Phone number"
                            onChange={(e) => set("phone", e.target.value)}
                            required
                        />

                        <input
                            className="input"
                            type="password"
                            placeholder="Password"
                            onChange={(e) => set("password", e.target.value)}
                            required
                        />

                        {role === "owner" && (
                            <input
                                className="input"
                                placeholder="Business name"
                                onChange={(e) =>
                                    set("business", e.target.value)
                                }
                                required
                            />
                        )}

                        <button
                            disabled={loading}
                            className={`w-full rounded-xl py-3 text-sm font-semibold transition ${
                                loading
                                    ? "bg-slate-300 animate-pulse"
                                    : "bg-emerald-500 text-white hover:bg-emerald-600"
                            }`}
                        >
                            {loading ? "Creating..." : "Create Account"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-emerald-600">
                            Login
                        </Link>
                    </p>
                        </div>
                    </div>
                </div>
            </div>
    );
}
