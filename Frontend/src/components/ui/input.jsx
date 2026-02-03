export default function Input({ label, className = "", ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`
          w-full
          rounded-xl
          border border-slate-300
          px-4 py-3
          text-sm
          bg-white
          placeholder-slate-400
          focus:outline-none
          focus:ring-2
          focus:ring-slate-900
          focus:border-slate-900
          ${className}
        `}
      />
    </div>
  );
}
