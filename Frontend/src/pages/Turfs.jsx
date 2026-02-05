import { useEffect, useState } from "react";
import api from "../api";
import TurfCard from "../components/TurfCard";
import TurfFilters from "../components/TurfFilters";
import useGeoLocation from "../hooks/useGeoLocation";
import { ListShimmerGrid, TurfCardShimmer } from "../components/Shimmers";
import useFetchWithRetry from "../hooks/useFetchWithRetry";
import useDebouncedValue from "../hooks/useDebouncedValue";

export default function Turfs() {
  const location = useGeoLocation();

  const [turfs, setTurfs] = useState([]);
  const [filters, setFilters] = useState({
    city: "",
    min_price: "",
    max_price: "",
    radius: 25,
    sports_type: "",
    search: "",
  });

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const pageSize = 6;
  const totalPages = Math.ceil(count / pageSize);

  // Debounced values to avoid duplicate / rapid fetches
  const debouncedCity = useDebouncedValue(filters.city);
  const debouncedMinPrice = useDebouncedValue(filters.min_price);
  const debouncedMaxPrice = useDebouncedValue(filters.max_price);
  const debouncedRadius = useDebouncedValue(filters.radius);
  const debouncedSports = useDebouncedValue(filters.sports_type);
  const debouncedSearch = useDebouncedValue(filters.search);

  // 🔁 Reset page when filters or location change
  useEffect(() => {
    setPage(1);
  }, [debouncedCity, debouncedMinPrice, debouncedMaxPrice, debouncedRadius, debouncedSports, debouncedSearch, location.lat]);

  // Centralised fetch with retry + timeout
  const {
    data,
    loading,
    error,
    refetch,
  } = useFetchWithRetry({
    // We only use existing backend API & params here
    fetchFn: () =>
      api
        .get("/turf/list/", {
          params: {
            page,
            city: debouncedCity || undefined,
            min_price: debouncedMinPrice || undefined,
            max_price: debouncedMaxPrice || undefined,
            sports_type: debouncedSports || undefined,
            radius: debouncedRadius,
            lat: location.lat || undefined,
            lon: location.lon || undefined,
            sort: "distance",
            // TODO: Backend support required for full‑text turf name search / Elasticsearch
            // Frontend ready – using `search` param if backend supports it.
            search: debouncedSearch || undefined,
          },
        })
        .then((res) => res.data),
    deps: [
      page,
      debouncedCity,
      debouncedMinPrice,
      debouncedMaxPrice,
      debouncedRadius,
      debouncedSports,
      debouncedSearch,
      location.lat,
      location.lon,
    ],
  });

  // Sync local list & count once data is available
  useEffect(() => {
    if (!data) return;
    setTurfs(data.results || []);
    setCount(data.count || 0);
  }, [data]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO with grass background & filter bar like reference */}
      <section className="relative bg-[url('https://images.pexels.com/photos/2570139/pexels-photo-2570139.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-fixed bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-10 text-center text-white sm:px-6 lg:py-14">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Best turf booking platform in your area
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-100/85 sm:text-base">
            Choose from football, cricket, badminton, tennis and more – book your preferred
            time slot in a few clicks.
          </p>

          {/* Filter/search bar floating over hero */}
          <div className="mt-6 w-full max-w-4xl rounded-xl bg-white/10 p-3 shadow-2xl shadow-black/40 backdrop-blur-lg border border-white/20">
            <div className="grid gap-3 md:grid-cols-6">
              {/* Sport type (frontend-safe) */}
              <div className="md:col-span-1">
                <select
                  value={filters.sports_type}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, sports_type: e.target.value }))
                  }
                  className="w-full rounded-lg border border-white/20 bg-white/90 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
                >
                  <option value="">Any sport</option>
                  <option value="FOOTBALL">Football</option>
                  <option value="CRICKET">Cricket</option>
                  <option value="BADMINTON">Badminton</option>
                  <option value="TENNIS">Tennis</option>
                  <option value="PICKLEBALL">Pickleball</option>
                  {/* DB-safe: values already supported in filters */}
                </select>
              </div>

              {/* City / Location */}
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Location / city"
                  value={filters.city}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, city: e.target.value }))
                  }
                  className="w-full rounded-lg border border-white/20 bg-white/90 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
                />
              </div>

              {/* Nearby distance */}
              <div>
                <select
                  value={filters.radius}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      radius: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-white/20 bg-white/90 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
                >
                  <option value={5}>Within 5 km</option>
                  <option value={10}>Within 10 km</option>
                  <option value={25}>Within 25 km</option>
                  <option value={40}>Within 40 km</option>
                </select>
              </div>

              {/* Search + button */}
              <div className="flex items-stretch gap-2 md:col-span-2">
                <input
                  type="text"
                  placeholder="Search turf"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="flex-1 rounded-lg border border-white/20 bg-white/90 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIST + sections on light background */}
      <div className="px-4 pb-12 pt-6 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        {loading ? (
          <ListShimmerGrid
            count={6}
            gapClassName="gap-7"
            renderItem={(index) => <TurfCardShimmer key={index} />}
          />
        ) : turfs.length === 0 && error ? (
          // Full error fallback only when there is NO data yet
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white/80 py-14 text-center shadow-sm">
            <p className="text-sm font-medium text-red-600">
              We couldn&apos;t load turfs right now.
            </p>
            <p className="text-xs text-slate-500">
              Please check your connection and try again.
            </p>
            <button
              type="button"
              onClick={refetch}
              className="mt-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600"
            >
              Retry loading turfs
            </button>
          </div>
        ) : turfs.length === 0 ? (
          // Confirmed empty state: only after successful fetch with no results
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <h3 className="mb-2 text-lg font-semibold">No turfs found</h3>
            <p className="text-sm">Try changing filters or location.</p>
          </div>
        ) : (
          <>
            {/* If we have some data but latest fetch failed, show a soft banner instead of hiding results */}
            {error && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                Some turfs may be out of date due to a network issue. Showing
                the last loaded list.{" "}
                <button
                  type="button"
                  onClick={refetch}
                  className="font-semibold underline underline-offset-2"
                >
                  Retry
                </button>
              </div>
            )}

            {/* GRID */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {turfs.map((turf) => (
                <TurfCard key={turf.id} turf={turf} />
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:opacity-40"
                >
                  ← Prev
                </button>

                <span className="text-sm text-slate-600">
                  Page <b>{page}</b> of <b>{totalPages}</b>
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        {/* Popular & most visited sections – UI only for now */}
        <section className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Popular turfs
            </h2>
            <span className="text-xs text-slate-500">
              Based on ratings and activity
            </span>
          </div>
          {/* TODO: Backend support required for popular turfs ranking
              Frontend ready – wire to analytics / popularity API and reuse TurfCard */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="h-32 rounded-lg bg-linear-to-tr from-emerald-500/10 to-emerald-500/5 border border-emerald-100 flex items-center justify-center text-xs text-emerald-700 transition duration-300 hover:scale-105">
              Popular turfs will appear here.
            </div>
            <div className="h-32 rounded-lg bg-white/80 shadow-sm border border-slate-100 flex items-center justify-center text-xs text-slate-500 transition duration-300 hover:scale-105">
              Hooked to same list API – filter by rating once backend is ready.
            </div>
            <div className="h-32 rounded-lg bg-white/80 shadow-sm border border-slate-100 flex items-center justify-center text-xs text-slate-500 transition duration-300 hover:scale-105">
              Design only, safe for DB.
            </div>
          </div>
        </section>

        <section className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Most visited this week
            </h2>
            <span className="text-xs text-slate-500">
              UI-ready for future visit analytics
            </span>
          </div>
          {/* TODO: Backend support required for visit / booking stats
              Frontend ready – attach to stats endpoint in future. */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="h-24 rounded-lg bg-white/80 shadow-sm border border-slate-100 flex items-center justify-center text-xs text-slate-500 transition duration-300 hover:scale-105">
              Turf visit stats placeholder
            </div>
            <div className="h-24 rounded-lg bg-white/80 shadow-sm border border-slate-100 flex items-center justify-center text-xs text-slate-500 transition duration-300 hover:scale-105">
              Will show bookings count
            </div>
            <div className="h-24 rounded-lg bg-white/80 shadow-sm border border-slate-100 flex items-center justify-center text-xs text-slate-500 transition duration-300 hover:scale-105">
              Safe UI-only section
            </div>
            <div className="h-24 rounded-lg bg-white/80 shadow-sm border border-slate-100 flex items-center justify-center text-xs text-slate-500 transition duration-300 hover:scale-105">
              No schema or API changes
            </div>
          </div>
        </section>
      </div>
      </div>
    </div>
  );
}
