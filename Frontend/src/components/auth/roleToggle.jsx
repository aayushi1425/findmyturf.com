export default function RoleToggle({ role, setRole }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={() => setRole("user")}
        className={`rounded-xl py-2 text-sm font-medium transition
          ${
            role === "user"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }
        `}
      >
        User
      </button>

      <button
        onClick={() => setRole("business")}
        className={`rounded-xl py-2 text-sm font-medium transition
          ${
            role === "business"
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }
        `}
      >
        Business
      </button>
    </div>
  );
}
