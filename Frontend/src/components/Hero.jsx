import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="flex-1">
      <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT */}
        <div>
          <h2 className="text-5xl font-bold text-white leading-tight">
            Book Sports Turfs
            <br />
            <span className="text-slate-100">Near You — Instantly</span>
          </h2>

          <p className="mt-6 text-lg text-slate-100/80">
            Discover, compare and book football, cricket and multi-sport turfs
            with real-time availability and secure booking.
          </p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => navigate("/turfs")}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 shadow-lg shadow-black/30"
            >
              Explore Turfs
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 rounded-xl font-medium border border-white/60 text-white bg-white/5 hover:bg-white/15"
            >
              List Your Turf
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <img
            src="https://images.unsplash.com/photo-1521412644187-c49fa049e84d"
            className="rounded-xl object-cover h-72 w-full"
          />
        </div>

      </div>
    </section>
  );
}