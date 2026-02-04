import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { token, role, logout } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <h1
          className="text-xl font-bold text-slate-900 cursor-pointer"
          onClick={() => navigate("/")}
        >
          FindMyTurf
        </h1>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">

          {/* NOT LOGGED IN */}
          {!token && (
            <>
              <button
                onClick={() => navigate("/turfs")}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Book Turf
              </button>

              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              >
                Login
              </button>
            </>
          )}

          {/* USER */}
          {token && role === "USER" && (
            <>
              <button
                onClick={() => navigate("/turfs")}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Book Turf
              </button>

              <button
                onClick={() => navigate("/my-bookings")}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                My Bookings
              </button>

              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          )}

          {/* OWNER */}
          {token && role === "OWNER" && (
            <>
              <button
                onClick={() => navigate("/owner/turfs")}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Your Turfs
              </button>

              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
