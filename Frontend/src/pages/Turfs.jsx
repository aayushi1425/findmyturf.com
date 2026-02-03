import { useEffect, useState } from "react";
import api from "../config/api";
import TurfCard from "../components/TurfCard";
import TurfFilters from "../components/TurfFilters";
import useGeoLocation from "../hooks/useGeoLocation";

export default function Turfs() {
    const location = useGeoLocation();

    const [turfs, setTurfs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        city: "",
        min_price: "",
        max_price: "",
        radius: 10,
    });

    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const pageSize = 6;

    useEffect(() => {
        setPage(1);
    }, [filters, location.lat]);

    useEffect(() => {
        fetchTurfs();
    }, [page, filters]);

    async function fetchTurfs() {
        setLoading(true);
        try {
            const res = await api.get("/turf/list/", {
                params: {
                    page,
                    city: filters.city || undefined,
                    min_price: filters.min_price || undefined,
                    max_price: filters.max_price || undefined,
                    radius: filters.radius,
                    lat: location.lat || undefined,
                    lon: location.lon || undefined,
                    sort: "distance",
                },
            });

            setTurfs(res.data.results || []);
            setCount(res.data.count || 0);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="mx-auto mb-8 max-w-6xl">
                <h1 className="text-3xl font-bold text-slate-900">
                    Find Turfs Near You ⚽
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Book football turfs, sports arenas, and play your game.
                </p>
            </div>

            <div className="mx-auto mb-8 max-w-6xl rounded-2xl bg-white p-5 shadow-sm">
                <TurfFilters filters={filters} setFilters={setFilters} />
            </div>

            <div className="mx-auto max-w-6xl">
                {loading ? (
                    <div className="flex items-center justify-center py-24 text-slate-500">
                        Loading turfs near you...
                    </div>
                ) : turfs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-500">
                        <h3 className="mb-2 text-lg font-semibold">
                            No turfs found 😕
                        </h3>
                        <p className="text-sm">
                            Try changing filters or location.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                            {turfs.map((turf) => (
                                <TurfCard key={turf.id} turf={turf} />
                            ))}
                        </div>

                        {count > pageSize && (
                            <div className="mt-10 flex items-center justify-center gap-3">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage((p) => p - 1)}
                                    className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
                                >
                                    ← Prev
                                </button>

                                <span className="text-sm text-slate-600">
                                    Page {page} of {Math.ceil(count / pageSize)}
                                </span>

                                <button
                                    disabled={page >= Math.ceil(count / pageSize)}
                                    onClick={() => setPage((p) => p + 1)}
                                    className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
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