export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="w-full py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
      style={{ background: "#FF9B51", color: "#25343F" }}
    >
      {children}
    </button>
  );
}
