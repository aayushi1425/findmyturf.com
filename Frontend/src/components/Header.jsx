import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900 cursor-pointer"
            onClick={() => navigate("/")}>
          FindMyTurf
        </h1>

        <div className="flex gap-3">

          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800"
          >
            Login
          </button>
        </div>
      </div>
    </header>
  );
}
