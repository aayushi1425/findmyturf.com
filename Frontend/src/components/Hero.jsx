import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative flex-1 bg-[url('https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-fixed bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center px-6 py-12 lg:flex-row lg:items-center lg:gap-12">

        {/* LEFT COPY */}
        <div className="max-w-xl space-y-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Book. Play. Repeat.
          </p>
          <h2 className="text-4xl font-bold leading-tight sm:text-5xl">
            Choose your turf.
            <br />
            <span className="text-emerald-300">Play your game.</span>
          </h2>

          <p className="text-sm text-slate-100/80 sm:text-base">
            Discover premium football, cricket and multi-sport turfs with
            real-time availability, transparent pricing, and instant booking.
          </p>

          <div className="flex flex-wrap gap-3 text-xs text-slate-200/80">
            <span className="rounded-full bg-white/10 px-3 py-1">
              Live slot availability
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1">
              Owner dashboards
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1">
              Location-aware search
            </span>
          </div>
        </div>

        {/* RIGHT – Search hero card */}
        <div className="mt-10 w-full max-w-md lg:mt-0 lg:w-[420px]">
          <div className="rounded-xl bg-white/10 p-6 shadow-xl backdrop-blur-lg border border-white/20">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-200">
              Find turfs near you
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              Discover the closest turfs with live pricing.
            </h3>
            <p className="mt-2 text-sm text-slate-200/80">
              Jump straight into Explore to filter by sport, budget, and distance.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/turfs")}
                className="w-full rounded-lg bg-emerald-500 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
              >
                Explore turfs
              </button>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full rounded-lg border border-white/30 bg-white/10 py-3 text-sm font-semibold text-white hover:bg-white/20"
              >
                List your turf
              </button>
            </div>

            <p className="mt-4 text-center text-[11px] text-slate-200/70">
              Instant bookings. Transparent pricing. Owner-friendly tools.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}