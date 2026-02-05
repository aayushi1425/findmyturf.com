import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative flex-1">
      {/* Background stadium image */}
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Night stadium"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center px-6 py-16 lg:flex-row lg:items-center lg:gap-14">
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
          <div className="rounded-3xl bg-white/95 p-6 shadow-xl shadow-black/30 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Find turfs near you
            </p>

            <div className="mt-4 space-y-3">
              <div className="space-y-1 text-sm">
                <label className="text-slate-700">City or area</label>
                <input
                  placeholder="Search by city"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1 text-sm">
                  <label className="text-slate-700">Sport</label>
                  <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                    <option>Any sport</option>
                    <option>Football</option>
                    <option>Cricket</option>
                    <option>Badminton</option>
                    <option>Tennis</option>
                  </select>
                </div>

                <div className="space-y-1 text-sm">
                  <label className="text-slate-700">Date</label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <label className="text-slate-700">Budget (₹/hour)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/turfs")}
              className="mt-5 w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
            >
              Search turfs
            </button>

            <p className="mt-3 text-center text-[11px] text-slate-500">
              Looking to list your facility?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-emerald-600 underline underline-offset-2"
              >
                Sign in as owner
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}