import { useEffect, useState } from "react";
import api from "../api";
import TurfCard from "../components/TurfCard";
import useGeoLocation from "../hooks/useGeoLocation";
import { ListShimmerGrid, TurfCardShimmer } from "../components/Shimmers";
import useFetchWithRetry from "../hooks/useFetchWithRetry";

export default function Turfs() {
  const location = useGeoLocation();

  const [filters, setFilters] = useState({
    city: "",
    min_price: "",
    max_price: "",
    radius: 25,
    sports_type: "",
    search: "",
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  const [page, setPage] = useState(1);
  const [turfs, setTurfs] = useState([]);
  const [count, setCount] = useState(0);

  const pageSize = 6;
  const totalPages = Math.ceil(count / pageSize);


  const { data, loading, error, refetch } = useFetchWithRetry({
    fetchFn: () =>
      api
        .get("/turf/list/", {
          params: {
            page,
            city: appliedFilters.city || undefined,
            min_price: appliedFilters.min_price || undefined,
            max_price: appliedFilters.max_price || undefined,
            sports_type: appliedFilters.sports_type || undefined,
            radius: appliedFilters.radius,
            search: appliedFilters.search || undefined,
            lat: location.lat || undefined,
            lon: location.lon || undefined,
            sort: "distance",
          },
        })
        .then((res) => res.data),
    deps: [page, appliedFilters, location.lat, location.lon],
  });


  useEffect(() => {
    if (!data) return;
    setTurfs(data.results || []);
    setCount(data.count || 0);
  }, [data]);


  const handleSearch = () => {
    setPage(1);
    setAppliedFilters(filters);
  };

  const isDirty =
    JSON.stringify(filters) !== JSON.stringify(appliedFilters);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="relative bg-[url('https://images.pexels.com/photos/2570139/pexels-photo-2570139.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative mx-auto max-w-4xl pt-20 px-4 py-4 text-white">
          <h1 className="text-center text-3xl font-bold sm:text-4xl">
            Best turf booking platform in your area
          </h1>
          <p className="mt-3 text-center text-sm text-slate-200 sm:text-base">
            Football, cricket, badminton, tennis & more
          </p>

          {/* -----------------------
           * RESPONSIVE FILTER BAR
           * ---------------------- */}
          <div className="mt-6 rounded-xl bg-white/10 p-4 backdrop-blur-lg border border-white/20">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-6">
              {/* Sport */}
              <select
                value={filters.sports_type}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, sports_type: e.target.value }))
                }
                className="rounded-lg bg-white px-3 py-2 text-sm text-slate-900"
              >
                <option value="">Any sport</option>
                <option value="FOOTBALL">Football</option>
                <option value="CRICKET">Cricket</option>
                <option value="BADMINTON">Badminton</option>
                <option value="TENNIS">Tennis</option>
                <option value="PICKLEBALL">Pickleball</option>
              </select>

              {/* City */}
              <input
                type="text"
                placeholder="City / location"
                value={filters.city}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, city: e.target.value }))
                }
                className="rounded-lg bg-white px-3 py-2 text-sm text-slate-900"
              />

              {/* Radius */}
              <select
                value={filters.radius}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    radius: Number(e.target.value),
                  }))
                }
                className="rounded-lg bg-white px-3 py-2 text-sm text-slate-900"
              >
                <option value={5}>Within 5 km</option>
                <option value={10}>Within 10 km</option>
                <option value={25}>Within 25 km</option>
                <option value={40}>Within 40 km</option>
              </select>

              {/* Search text */}
              <input
                type="text"
                placeholder="Search turf"
                value={filters.search}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, search: e.target.value }))
                }
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="rounded-lg bg-white px-3 py-2 text-sm text-slate-900 md:col-span-2"
              />

              {/* Search button */}
              <button
                type="button"
                disabled={!isDirty}
                onClick={handleSearch}
                className="rounded-lg bg-emerald-500 max-w-30 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:bg-emerald-600 sm:col-span-2 md:col-span-1"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {loading ? (
          <ListShimmerGrid
            count={6}
            renderItem={(i) => <TurfCardShimmer key={i} />}
          />
        ) : turfs.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            <h3 className="text-lg font-semibold">No turfs found</h3>
            <p className="text-sm">Try adjusting filters</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-xs text-amber-700">
                Showing cached results.{" "}
                <button onClick={refetch} className="font-semibold underline">
                  Retry
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {turfs.map((turf) => (
                <TurfCard key={turf.id} turf={turf} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-4 items-center">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded border px-4 py-2 disabled:opacity-40"
                >
                  ← Prev
                </button>
                <span className="text-sm text-slate-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded border px-4 py-2 disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}