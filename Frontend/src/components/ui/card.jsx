export default function Card({ children, className = "" }) {
  return (
    <div className={`
      bg-white
      rounded-2xl
      border border-slate-200
      shadow-sm
      p-8
      w-full
      max-w-md
      ${className}
    `}>
      {children}
    </div>
  );
}
