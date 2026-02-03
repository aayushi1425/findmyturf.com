import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="flex-1">
      <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT */}
        <div>
          <h2 className="text-5xl font-bold text-slate-900 leading-tight">
            Book Sports Turfs
            <br />
            <span className="text-slate-600">Near You — Instantly</span>
          </h2>

          <p className="mt-6 text-lg text-slate-600">
            Discover, compare and book football, cricket and multi-sport turfs
            with real-time availability and secure booking.
          </p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => navigate("/turfs")}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800"
            >
              Explore Turfs
            </button>

            <button
              onClick={() => navigate("/business/login")}
              className="px-6 py-3 border border-slate-300 rounded-xl font-medium hover:bg-slate-100"
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
