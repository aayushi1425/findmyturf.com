import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import PageLayout from "../../components/PageLayout";
import { ListShimmerGrid, TurfCardShimmer } from "../../components/Shimmers";

export default function MyTurfs() {
  const navigate = useNavigate();
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTurfs();
  }, []);

  async function fetchTurfs() {
    setLoading(true);
    try {
      const res = await api.get("/owner/turfs/");
      setTurfs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout>
      <div className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-6xl space-y-8">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              My Turfs
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage your turfs, courts and bookings
            </p>
          </div>

          <button
            onClick={() => navigate("/owner/add-turf")}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            + Add Turf
          </button>
        </div>

        {/* CONTENT */}
        {loading ? (
          <ListShimmerGrid
            count={6}
            gapClassName="gap-6"
            renderItem={(index) => <TurfCardShimmer key={index} />}
          />
        ) : turfs.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow">
            <h3 className="text-lg font-semibold text-slate-900">
              No turfs yet ⚽
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Create your first turf to start accepting bookings.
            </p>

            <button
              onClick={() => navigate("/owner/add-turf")}
              className="mt-6 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
            >
              Add Turf
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {turfs.map((turf) => (
              <TurfCard
                key={turf.id}
                turf={turf}
                navigate={navigate}
              />
            ))}
          </div>
        )}
        </div>
      </div>
    </PageLayout>
  );
}

/* -------------------- CARD -------------------- */

function TurfCard({ turf, navigate }) {
  const defaultImage =
    turf.images?.find((img) => img.is_default)?.image_url ||
    "https://via.placeholder.com/400x250";

  return (
    <div className="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {/* IMAGE */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={defaultImage}
          alt={turf.name}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />

        {!turf.is_open && (
          <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
            Closed
          </span>
        )}
      </div>

      {/* BODY */}
      <div className="p-5 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {turf.name}
          </h3>
          <p className="text-sm text-slate-600">
            {turf.location}, {turf.city}
          </p>
        </div>

        {/* META */}
        <div className="flex flex-wrap gap-3 text-xs text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1">
            {turf.opening_time.slice(0, 5)} – {turf.closing_time.slice(0, 5)}
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1">
            Courts: {turf.courts?.length || 0}
          </span>
        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() =>
              navigate(`/owner/turf/${turf.id}/courts`)
            }
            className="rounded-xl border px-3 py-2 text-xs font-semibold hover:bg-slate-50"
          >
            Manage Courts
          </button>

          <button
            onClick={() =>
              navigate(`/owner/turf/${turf.id}/bookings`)
            }
            className="rounded-xl border px-3 py-2 text-xs font-semibold hover:bg-slate-50"
          >
            View Bookings
          </button>

          <button
            onClick={() =>
              navigate(`/owner/turf/${turf.id}/edit`)
            }
            className="col-span-2 rounded-xl bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Edit Turf
          </button>
        </div>
      </div>
    </div>
  );
}