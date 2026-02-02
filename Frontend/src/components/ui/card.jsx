export default function Card({ children }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border w-full max-w-md">
      {children}
    </div>
  );
}
