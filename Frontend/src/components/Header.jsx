import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { token, role, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const isOwner = token && role === "OWNER";
  const isUser = token && role === "USER";

  const primaryNav = [
    { label: "Home", to: "/" },
    { label: "Explore", to: "/turfs" },
    { label: "Popular", to: "/popular-turfs" },
    { label: "Sports", to: "/sports" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* LOGO */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-sm font-black text-white shadow-sm">
            FM
          </span>
          <span className="flex flex-col items-start">
            <span className="text-sm font-semibold tracking-tight text-slate-900 sm:text-base">
              FindMyTurf
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wide text-emerald-600">
              Book • Play • Repeat
            </span>
          </span>
        </button>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-2 py-1 transition hover:text-slate-900 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="hidden items-center gap-3 md:flex">
          {!token && (
            <>
              <button
                onClick={() => navigate("/turfs")}
                className="text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Book Turf
              </button>

              <button
                onClick={() => navigate("/login")}
                className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
              >
                Login
              </button>
            </>
          )}

          {isUser && (
            <>
              <button
                onClick={() => navigate("/my-bookings")}
                className="text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                My Bookings
              </button>
              <button
                onClick={logout}
                className="rounded-full border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          )}

          {isOwner && (
            <>
              <button
                onClick={() => navigate("/owner/turfs")}
                className="text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Owner Dashboard
              </button>
              <button
                onClick={logout}
                className="rounded-full border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          <span className="h-4 w-4">
            {open ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </span>
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 text-sm font-medium text-slate-700">
            {primaryNav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-lg px-2 py-2 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {!token && (
              <>
                <button
                  onClick={() => {
                    navigate("/turfs");
                    setOpen(false);
                  }}
                  className="mt-2 text-left text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  Book Turf
                </button>
                <button
                  onClick={() => {
                    navigate("/login");
                    setOpen(false);
                  }}
                  className="mt-1 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                >
                  Login
                </button>
              </>
            )}

            {isUser && (
              <>
                <button
                  onClick={() => {
                    navigate("/my-bookings");
                    setOpen(false);
                  }}
                  className="mt-2 text-left text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  My Bookings
                </button>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="mt-1 rounded-full border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Logout
                </button>
              </>
            )}

            {isOwner && (
              <>
                <button
                  onClick={() => {
                    navigate("/owner/turfs");
                    setOpen(false);
                  }}
                  className="mt-2 text-left text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  Owner Dashboard
                </button>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="mt-1 rounded-full border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}