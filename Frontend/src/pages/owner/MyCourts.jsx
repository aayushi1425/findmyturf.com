import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";

export default function MyCourts() {
  const { turfId } = useParams();
  const navigate = useNavigate();

  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourts();
  }, []);

  async function fetchCourts() {
    try {
      const res = await api.get(`/turf/${turfId}/courts/`);
      setCourts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleCourt(courtId, isOpen) {
    try {
      await api.patch(`/court/${courtId}/update/`, {
        is_open: !isOpen,
      });

      setCourts((prev) =>
        prev.map((c) =>
          c.id === courtId ? { ...c, is_open: !isOpen } : c
        )
      );
    } 
    catch (err) {
      alert("Failed to update court");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading courts...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            My Courts
          </h1>
          <p className="text-sm text-slate-500">
            Manage courts under this turf
          </p>
        </div>

        <button
          onClick={() =>
            navigate(`/owner/turf/${turfId}/courts/add`)
          }
          className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          + Add Court
        </button>
      </div>

      {/* COURT LIST */}
      {courts.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-slate-500">
            No courts added yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courts.map((court) => (
            <div
              key={court.id}
              className="rounded-2xl bg-white p-6 shadow-sm space-y-4"
            >
              {/* SPORT */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  {court.sports_type}
                </h3>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    court.is_open
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {court.is_open ? "Open" : "Closed"}
                </span>
              </div>

              {/* INFO */}
              <div className="text-sm text-slate-600 space-y-1">
                <p>
                  <span className="font-medium">Price:</span>{" "}
                  ₹{court.price}/hour
                </p>
                <p>
                  <span className="font-medium">Size:</span>{" "}
                  {court.length} × {court.width} × {court.height} m
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() =>
                    navigate(
                      `/owner/court/${court.id}/edit`
                    )
                  }
                  className="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-medium hover:border-slate-900"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    toggleCourt(court.id, court.is_open)
                  }
                  className={`flex-1 rounded-xl py-2 text-sm font-medium ${
                    court.is_open
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-green-50 text-green-600 hover:bg-green-100"
                  }`}
                >
                  {court.is_open ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
