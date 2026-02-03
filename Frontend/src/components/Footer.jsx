export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-slate-600">
        © {new Date().getFullYear()} FindMyTurf — Book. Play. Repeat.
      </div>
    </footer>
  );
}
