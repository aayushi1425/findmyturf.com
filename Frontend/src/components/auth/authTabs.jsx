export default function AuthTabs({ tab, setTab }) {
  return (
    <div className="flex gap-3">
      {["login", "signup"].map(t => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className="flex-1 py-2 rounded-xl font-bold"
          style={{
            background: tab === t ? "#FF9B51" : "#BFC9D1"
          }}
        >
          {t.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
