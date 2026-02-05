export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "w-full py-3 rounded-xl font-medium transition active:scale-[0.98]";

  const styles = {
    primary:
      "bg-slate-900 text-white hover:bg-slate-800",
    outline:
      "border border-slate-300 text-slate-900 hover:bg-slate-100",
    ghost:
      "text-slate-700 hover:bg-slate-100",
  };

  return (
    <button
      {...props}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
