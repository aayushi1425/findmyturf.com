import { useState } from "react";
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

export default function AddCourt() {
  const { turfId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    sports_type: "CRICKET",
    price: "",
    length: "",
    width: "",
    height: "",
    is_open: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/court/create/", {
        turf: turfId,
        sports_type: form.sports_type,
        price: Number(form.price),
        length: Number(form.length),
        width: Number(form.width),
        height: Number(form.height),
        is_open: form.is_open,
      });

      navigate(`/owner/turf/${turfId}/courts`);
    } catch (err) {
      console.error(err);
      setError("Failed to create court");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
    <div className="mx-auto max-w-2xl px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-white p-8 shadow-sm space-y-8"
      >
        {/* HEADER */}
        <header>
          <h1 className="text-2xl font-bold text-slate-900">
            Add Court
          </h1>
          <p className="text-sm text-slate-500">
            Add a playable court under this turf
          </p>
        </header>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* SPORT */}
        <section className="space-y-3">
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
        <section className="space-y-3">
          <label className="text-sm font-medium text-slate-700">
            Price per Hour (₹)
          </label>

          <input
            type="number"
            name="price"
            required
            placeholder="e.g. 1200"
            className="input"
            onChange={handleChange}
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
              placeholder="Length"
              className="input"
              required
              onChange={handleChange}
            />
            <input
              type="number"
              name="width"
              placeholder="Width"
              className="input"
              required
              onChange={handleChange}
            />
            <input
              type="number"
              name="height"
              placeholder="Height"
              className="input"
              required
              onChange={handleChange}
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

        {/* ACTION */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-2xl py-3 text-sm font-semibold transition ${
            loading
              ? "bg-slate-300"
              : "bg-slate-900 text-white hover:bg-slate-800"
          }`}
        >
          {loading ? "Creating Court..." : "Create Court"}
        </button>
      </form>
    </div>
    </PageLayout>
  );
}
