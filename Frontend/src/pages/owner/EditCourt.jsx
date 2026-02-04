import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import PageLayout from "../../components/PageLayout";

const SPORTS = [
  "CRICKET",
  "FOOTBALL",
  "BADMINTON",
  "TENNIS",
  "VOLLEYBALL",
  "PICKLEBALL",
  "GOLF",
];

export default function EditCourt() {
  const { courtId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    sports_type: "",
    price: "",
    length: "",
    width: "",
    height: "",
    is_open: true,
  });

  useEffect(() => {
    fetchCourt();
  }, []);

  async function fetchCourt() {
    try {
      const res = await api.get(`/court/${courtId}/`);
      setForm({
        sports_type: res.data.sports_type,
        price: res.data.price,
        length: res.data.length,
        width: res.data.width,
        height: res.data.height,
        is_open: res.data.is_open,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load court details");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.patch(`/court/${courtId}/update/`, {
        sports_type: form.sports_type,
        price: Number(form.price),
        length: Number(form.length),
        width: Number(form.width),
        height: Number(form.height),
        is_open: form.is_open,
      });

      navigate(-1);
    } catch (err) {
      console.error(err);
      setError("Failed to update court");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageLayout>
    <div className="mx-auto max-w-2xl px-6 py-10">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-white p-8 shadow-sm space-y-8"
      >
        {/* HEADER */}
        <header>
          <h1 className="text-2xl font-bold text-slate-900">
            Edit Court
          </h1>
          <p className="text-sm text-slate-500">
            Update court details and availability
          </p>
        </header>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* SPORT */}
        <section className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Sport Type
          </label>

          <select
            name="sports_type"
            value={form.sports_type}
            onChange={handleChange}
            className="input"
          >
            {SPORTS.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>
        </section>

        {/* PRICE */}
        <section className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Price per Hour (₹)
          </label>

          <input
            type="number"
            name="price"
            required
            className="input"
            onChange={handleChange}
            value={form.price}
          />
        </section>

        {/* DIMENSIONS */}
        <section className="space-y-3">
          <h2 className="font-semibold text-slate-900">
            Court Dimensions (meters)
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              name="length"
              className="input"
              onChange={handleChange}
              value={form.length}
            />
            <input
              type="number"
              name="width"
              className="input"
              onChange={handleChange}
              value={form.width}
            />
            <input
              type="number"
              name="height"
              className="input"
              onChange={handleChange}
              value={form.height}
            />
          </div>
        </section>

        {/* STATUS */}
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="is_open"
            checked={form.is_open}
            onChange={handleChange}
          />
          Court is available for booking
        </label>

        {/* ACTIONS */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium hover:border-slate-900"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className={`flex-1 rounded-xl py-3 text-sm font-semibold transition ${
              saving
                ? "bg-slate-300"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
    </PageLayout>
  );
}
