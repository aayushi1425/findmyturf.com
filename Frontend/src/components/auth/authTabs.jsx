export default function AuthTabs({ tab, setTab }) {
  return (
    <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
      {["login", "signup"].map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`rounded-lg py-2 text-sm font-medium transition
            ${tab === t
              ? "bg-white shadow text-slate-900"
              : "text-slate-500"}
          `}
        >
          {t === "login" ? "Login" : "Sign up"}
        </button>
      ))}
    </div>
  );
}
