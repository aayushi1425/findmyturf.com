import { useEffect, useState } from "react";
import api from "../api";
import TurfCard from "../components/TurfCard";
import { TurfCardShimmer, ListShimmerGrid } from "../components/Shimmers";

export default function PopularTurfs() {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await api.get("/turf/most-booked/");
        setTurfs(res.data || []);
      } catch (err) {
        console.error("Failed to load popular turfs");
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Popular turfs
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Most booked venues across the platform.
          </p>
        </div>

        {loading ? (
          <ListShimmerGrid
            count={6}
            gapClassName="gap-7"
            renderItem={(i) => <TurfCardShimmer key={i} />}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {turfs.map((item) => (
              <TurfCard key={item.turf.id} turf={item.turf} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
