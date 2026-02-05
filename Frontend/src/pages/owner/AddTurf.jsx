import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const createTurf = (data) => api.post("/turf/create/", data);

const uploadTurfImage = (turfId, file) => {
  const formData = new FormData();
  formData.append("image", file);

  return api.post(`/turf/${turfId}/image/upload/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export default function AddTurf() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
    opening_time: "06:00",
    closing_time: "23:00",
    is_open: true,
  });

  const MAX_IMAGES = 5;
  const MAX_SIZE_MB = 5;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    const valid = files.filter(
      (f) => f.type.startsWith("image/") && f.size <= MAX_SIZE_MB * 1024 * 1024
    );

    if (valid.length !== files.length) {
      setError("Only images under 5MB are allowed.");
    }

    setImages((p) => [...p, ...valid].slice(0, MAX_IMAGES));
    e.target.value = "";
  };

  const removeImage = (i) => setImages((p) => p.filter((_, x) => x !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...form,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
      };

      const res = await createTurf(payload);
      const turfId = res.data.id;

      for (const img of images) {
        await uploadTurfImage(turfId, img);
      }

      navigate(`/owner/turf/${turfId}/courts/add`);
    } catch (err) {
      console.error(err);
      setError("Failed to create turf");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HERO BACKGROUND */}
      <div
        className="h-48 w-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521417531039-3a4c42a98c88?q=80&w=1600')",
        }}
      />

      <div className="-mt-20 px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-lg">

          <header className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              Add New Turf
            </h1>
            <p className="text-sm text-slate-500">
              Create turf details and upload images. Courts come next.
            </p>
          </header>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* BASIC */}
            <section className="space-y-4">
              <h2 className="font-semibold">Turf Information</h2>

              <input className="border p-3 rounded-xl w-full" name="name" placeholder="Turf Name" required onChange={handleChange} />
              <textarea className="border p-3 rounded-xl w-full" name="description" placeholder="Description" required onChange={handleChange} />
              <input className="border p-3 rounded-xl w-full" name="location" placeholder="Area / Landmark" required onChange={handleChange} />

              <div className="grid grid-cols-2 gap-4">
                <input className="border p-3 rounded-xl" name="city" placeholder="City" required onChange={handleChange} />
                <input className="border p-3 rounded-xl" name="state" placeholder="State" required onChange={handleChange} />
              </div>
            </section>

            {/* COORDS */}
            <section className="grid grid-cols-2 gap-4">
              <input className="border p-3 rounded-xl" name="latitude" type="number" step="any" placeholder="Latitude" onChange={handleChange} />
              <input className="border p-3 rounded-xl" name="longitude" type="number" step="any" placeholder="Longitude" onChange={handleChange} />
            </section>

            {/* TIME */}
            <section className="grid grid-cols-2 gap-4">
              <input className="border p-3 rounded-xl" type="time" name="opening_time" value={form.opening_time} onChange={handleChange} />
              <input className="border p-3 rounded-xl" type="time" name="closing_time" value={form.closing_time} onChange={handleChange} />
            </section>

            {/* OPEN */}
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" name="is_open" checked={form.is_open} onChange={handleChange} />
              Turf is open for bookings
            </label>

            {/* IMAGES */}
            <section className="space-y-3">
              <input type="file" multiple accept="image/*" onChange={handleImageSelect} />

              <div className="grid grid-cols-3 gap-4">
                {images.map((file, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden border">
                    <img src={URL.createObjectURL(file)} className="h-24 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 bg-black/70 text-white text-xs rounded-full h-6 w-6"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-500">
                {images.length}/{MAX_IMAGES} images selected
              </p>
            </section>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-900 py-3 text-white hover:bg-slate-800 disabled:bg-slate-300"
            >
              {loading ? "Creating Turf…" : "Create Turf"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
