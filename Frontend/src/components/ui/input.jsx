export default function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">{label}</label>
      <input
        {...props}
        className="input border-[#BFC9D1] focus:ring-[#FF9B51]"
      />
    </div>
  );
}
