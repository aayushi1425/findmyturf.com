export default function RoleToggle({ role, setRole, disabled = false }) {
    const baseBtn = "relative flex items-center justify-center rounded-xl py-3 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2";
    const active = "bg-slate-900 text-white shadow-sm scale-[1.02]";
    const inactive = "bg-slate-100 text-slate-600 hover:bg-slate-200";

    return (
        <div role="tablist" aria-label="Select account type" className="grid grid-cols-2 gap-2">
            <button
                type="button"
                role="tab"
                aria-selected={role === "USER"}
                aria-pressed={role === "USER"}
                disabled={disabled}
                onClick={() => setRole("USER")}
                className={`${baseBtn} ${role === "USER" ? active : inactive} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                👤 User
            </button>

            <button
                type="button"
                role="tab"
                aria-selected={role === "OWNER"}
                aria-pressed={role === "OWNER"}
                disabled={disabled}
                onClick={() => setRole("OWNER")}
                className={`${baseBtn} ${role === "OWNER" ? active : inactive
                    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                🏢 Business
            </button>
        </div>
    );
}