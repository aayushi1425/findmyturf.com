import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const createTurf = (data) =>
  api.post("/turf/create/", data);

const uploadTurfImage = (turfId, file) => {
  const formData = new FormData();
  formData.append("image", file); // 👈 backend expects `image`

  return api.post(
    `/turf/${turfId}/image/upload/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data", // 👈 override JSON
      },
    }
  );
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
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    const validImages = files.filter(
      (file) =>
        file.type.startsWith("image/") &&
        file.size <= MAX_SIZE_MB * 1024 * 1024
    );

    if (validImages.length !== files.length) {
      setError("Only images under 5MB are allowed.");
    }

    setImages((prev) =>
      [...prev, ...validImages].slice(0, MAX_IMAGES)
    );

    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

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

      if (images.length) {
        for (const img of images) {
          await uploadTurfImage(turfId, img);
        }
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
    <div className="mx-auto max-w-3xl">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-white p-8 shadow-sm space-y-8"
      >
        <header>
          <h1 className="text-2xl font-bold text-slate-900">
            Add New Turf
          </h1>
          <p className="text-sm text-slate-500">
            Create turf details and upload images. Courts come next.
          </p>
        </header>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* BASIC INFO */}
        <section className="space-y-4">
          <h2 className="font-semibold text-slate-900">
            Turf Information
          </h2>

          <input className="input" name="name" placeholder="Turf Name" required onChange={handleChange} />
          <textarea className="input" name="description" placeholder="Description" required onChange={handleChange} />
          <input className="input" name="location" placeholder="Area / Landmark" required onChange={handleChange} />

          <div className="grid grid-cols-2 gap-4">
            <input className="input" name="city" placeholder="City" required onChange={handleChange} />
            <input className="input" name="state" placeholder="State" required onChange={handleChange} />
          </div>
        </section>

        {/* LOCATION */}
        <section className="space-y-4">
          <h2 className="font-semibold text-slate-900">
            Location Coordinates
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <input className="input" name="latitude" type="number" step="any" placeholder="Latitude" onChange={handleChange} />
            <input className="input" name="longitude" type="number" step="any" placeholder="Longitude" onChange={handleChange} />
          </div>
        </section>

        {/* TIMING */}
        <section className="space-y-4">
          <h2 className="font-semibold text-slate-900">
            Operating Hours
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <input className="input" type="time" name="opening_time" value={form.opening_time} onChange={handleChange} />
            <input className="input" type="time" name="closing_time" value={form.closing_time} onChange={handleChange} />
          </div>
        </section>

        {/* TOGGLE */}
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="is_open" checked={form.is_open} onChange={handleChange} />
          Turf is open for bookings
        </label>

        {/* IMAGES */}
        <section className="space-y-4">
          <h2 className="font-semibold text-slate-900">
            Turf Images
          </h2>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageSelect}
            className="block w-full text-sm file:rounded-lg file:bg-slate-900 file:px-4 file:py-2 file:text-white hover:file:bg-slate-800"
          />

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {images.map((file, index) => (
                <div key={index} className="relative group rounded-xl overflow-hidden border">
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="h-24 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 hidden group-hover:flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-slate-500">
            {images.length}/{MAX_IMAGES} images selected
          </p>
        </section>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-2xl py-3 text-sm font-semibold transition ${loading
              ? "bg-slate-300"
              : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
        >
          {loading ? "Creating Turf..." : "Create Turf"}
        </button>
      </form>
    </div>
  );
}
