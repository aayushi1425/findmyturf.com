export default function RoleToggle({ role, setRole }) {
  return (
    <div className="flex gap-3">
      {["user", "business"].map(r => (
        <button
          key={r}
          onClick={() => setRole(r)}
          className="flex-1 py-2 rounded-xl font-semibold"
          style={{
            background: role === r ? "#FF9B51" : "#BFC9D1"
          }}
        >
          {r === "user" ? "User" : "Business"}
        </button>
      ))}
    </div>
  );
}
