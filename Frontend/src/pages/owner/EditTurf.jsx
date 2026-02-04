import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import PageLayout from "../../components/PageLayout";

export default function EditTurf() {
    const { turfId } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        description: "",
        location: "",
        city: "",
        state: "",
        latitude: "",
        longitude: "",
        opening_time: "",
        closing_time: "",
        is_open: true,
    });

    const [images, setImages] = useState([]);        // existing images
    const [newImages, setNewImages] = useState([]);  // newly selected images

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const MAX_IMAGES = 5;

    useEffect(() => {
        fetchTurf();
    }, []);

    async function fetchTurf() {
        try {
            const res = await api.get(`/turf/${turfId}/`);
            const t = res.data;

            setForm({
                name: t.name || "",
                description: t.description || "",
                location: t.location || "",
                city: t.city || "",
                state: t.state || "",
                latitude: t.latitude || "",
                longitude: t.longitude || "",
                opening_time: t.opening_time?.slice(0, 5),
                closing_time: t.closing_time?.slice(0, 5),
                is_open: t.is_open,
            });

            setImages(t.images || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load turf details");
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

    const handleNewImageSelect = (e) => {
        const files = Array.from(e.target.files);

        setNewImages((prev) =>
            [...prev, ...files].slice(0, MAX_IMAGES - images.length)
        );

        e.target.value = "";
    };

    const removeNewImage = (index) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
    };

    async function uploadImage(file) {
        const formData = new FormData();
        formData.append("image", file);

        await api.post(
            `/turf/${turfId}/image/upload/`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
    }

    /* ---------------- IMAGE ACTIONS ---------------- */

    async function setDefaultImage(imageId) {
        try {
            await api.post(`/turf/image/${imageId}/set-default/`);
            fetchTurf();
        } catch {
            alert("Failed to set default image");
        }
    }

    async function deleteImage(imageId) {
        if (!window.confirm("Delete this image?")) return;

        try {
            await api.delete(`/turf/image/${imageId}/delete/`);
            fetchTurf();
        } catch {
            alert("Failed to delete image");
        }
    }

    /* ---------------- SUBMIT ---------------- */

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            await api.patch(`/turf/${turfId}/update/`, {
                ...form,
                latitude: form.latitude ? parseFloat(form.latitude) : null,
                longitude: form.longitude ? parseFloat(form.longitude) : null,
            });

            // upload new images sequentially
            for (const img of newImages) {
                await uploadImage(img);
            }

            navigate("/owner/turfs");
        } catch (err) {
            console.error(err);
            setError("Failed to update turf");
        } finally {
            setSaving(false);
        }
    }

    return (
        <PageLayout>
        <div className="min-h-screen px-6 py-10">
            <div className="mx-auto max-w-3xl">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-8 rounded-3xl bg-white p-8 shadow-sm"
                >
                    <h1 className="text-2xl font-bold">Edit Turf</h1>

                    {error && (
                        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* BASIC INFO */}
                    <input className="input" name="name" value={form.name} onChange={handleChange} />
                    <textarea className="input" name="description" value={form.description} onChange={handleChange} />
                    <input className="input" name="location" value={form.location} onChange={handleChange} />

                    <div className="grid grid-cols-2 gap-4">
                        <input className="input" name="city" value={form.city} onChange={handleChange} />
                        <input className="input" name="state" value={form.state} onChange={handleChange} />
                    </div>

                    {/* IMAGES */}
                    <section className="space-y-4">
                        <h2 className="font-semibold">Turf Images</h2>

                        <div className="grid grid-cols-3 gap-4">
                            {images.map((img) => (
                                <div key={img.id} className="relative border rounded-xl overflow-hidden">
                                    <img src={img.image_url} className="h-28 w-full object-cover" />

                                    {img.is_default && (
                                        <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                            Default
                                        </span>
                                    )}

                                    <div className="absolute bottom-2 left-2 right-2 flex gap-1">
                                        {!img.is_default && (
                                            <button
                                                type="button"
                                                onClick={() => setDefaultImage(img.id)}
                                                className="flex-1 bg-black/70 text-white text-xs py-1 rounded"
                                            >
                                                Make Default
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => deleteImage(img.id)}
                                            className="bg-red-600 text-white text-xs px-2 rounded"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {images.length < MAX_IMAGES && (
                            <>
                                <label className="block">
                                    <span className="mb-2 block text-sm font-medium text-slate-700">
                                        Upload Images
                                    </span>

                                    <div className="relative flex cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 transition hover:border-slate-900 hover:bg-slate-100">
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-slate-700">
                                                Click to upload or drag & drop
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                PNG, JPG up to 5MB (max 5 images)
                                            </p>
                                        </div>

                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleNewImageSelect}
                                            className="absolute inset-0 cursor-pointer opacity-0"
                                        />
                                    </div>
                                </label>


                                <div className="grid grid-cols-3 gap-4">
                                    {newImages.map((file, i) => (
                                        <div key={i} className="relative border rounded-xl overflow-hidden">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                className="h-28 w-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(i)}
                                                className="absolute top-2 right-2 bg-black/70 text-white text-xs rounded-full h-6 w-6"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </section>

                    {/* ACTIONS */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 rounded-2xl bg-slate-900 py-3 text-white"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="rounded-2xl border px-5 py-3"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </PageLayout>
    );
}