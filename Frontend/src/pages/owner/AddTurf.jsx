import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const createTurf = (data) => api.post('/turf/create/', data);

const uploadTurfImage = (turfId, file) => {
    const formData = new FormData();
    formData.append('image', file);

    return api.post(`/turf/${turfId}/image/upload/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export default function AddTurf() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [images, setImages] = useState([]);

    const [form, setForm] = useState({
        name: '',
        description: '',
        location: '',
        city: '',
        state: '',
        latitude: '',
        longitude: '',
        opening_time: '06:00',
        closing_time: '23:00',
        amenities: [],
        is_open: true,
    });

    const MAX_IMAGES = 5;
    const MAX_SIZE_MB = 5;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((p) => ({
            ...p,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);

        const valid = files.filter(
            (f) =>
                f.type.startsWith('image/') &&
                f.size <= MAX_SIZE_MB * 1024 * 1024
        );

        if (valid.length !== files.length) {
            setError('Only images under 5MB are allowed.');
        }

        setImages((p) => [...p, ...valid].slice(0, MAX_IMAGES));
        e.target.value = '';
    };

    const removeImage = (i) => setImages((p) => p.filter((_, x) => x !== i));

    const [amenityInput, setAmenityInput] = useState('');

    const addAmenity = () => {
        if (!amenityInput.trim()) return;

        setForm((p) => ({
            ...p,
            amenities: [...p.amenities, amenityInput.trim()],
        }));

        setAmenityInput('');
    };

    const removeAmenity = (i) => {
        setForm((p) => ({
            ...p,
            amenities: p.amenities.filter((_, x) => x !== i),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
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
        } catch {
            setError('Failed to create turf');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
            <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-lg">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Add New Turf
                    </h1>
                    <p className="text-sm text-slate-500">
                        Enter turf details and upload images. Courts will be
                        added next.
                    </p>
                </header>

                {error && (
                    <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                            Turf Information
                        </h2>

                        <input
                            className="input"
                            name="name"
                            placeholder="Turf Name"
                            required
                            onChange={handleChange}
                        />
                        <textarea
                            className="input"
                            name="description"
                            placeholder="Description"
                            required
                            onChange={handleChange}
                        />
                        <input
                            className="input"
                            name="location"
                            placeholder="Area / Landmark"
                            required
                            onChange={handleChange}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <input
                                className="input"
                                name="city"
                                placeholder="City"
                                required
                                onChange={handleChange}
                            />
                            <input
                                className="input"
                                name="state"
                                placeholder="State"
                                required
                                onChange={handleChange}
                            />
                        </div>
                    </section>

                    <section className="grid grid-cols-2 gap-4">
                        <input
                            className="input"
                            name="latitude"
                            type="number"
                            step="any"
                            placeholder="Latitude"
                            onChange={handleChange}
                        />
                        <input
                            className="input"
                            name="longitude"
                            type="number"
                            step="any"
                            placeholder="Longitude"
                            onChange={handleChange}
                        />
                    </section>

                    <section className="grid grid-cols-2 gap-4">
                        <input
                            className="input"
                            type="time"
                            name="opening_time"
                            value={form.opening_time}
                            onChange={handleChange}
                        />
                        <input
                            className="input"
                            type="time"
                            name="closing_time"
                            value={form.closing_time}
                            onChange={handleChange}
                        />
                    </section>

                    <label className="flex items-center gap-3 text-sm">
                        <input
                            type="checkbox"
                            name="is_open"
                            checked={form.is_open}
                            onChange={handleChange}
                        />
                        Turf is open for bookings
                    </label>

                    <section className="space-y-3">
                        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                            Amenities
                        </h2>

                        <div className="flex gap-2">
                            <input
                                className="input flex-1"
                                placeholder="Add amenity (e.g. Parking)"
                                value={amenityInput}
                                onChange={(e) =>
                                    setAmenityInput(e.target.value)
                                }
                            />

                            <button
                                type="button"
                                onClick={addAmenity}
                                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm"
                            >
                                Add
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {form.amenities.map((a, i) => (
                                <span
                                    key={i}
                                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs"
                                >
                                    {a}
                                    <button
                                        type="button"
                                        onClick={() => removeAmenity(i)}
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-3"> 
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageSelect}
                        />

                        <div className="grid grid-cols-3 gap-4">
                            {images.map((file, i) => (
                                <div
                                    key={i}
                                    className="relative overflow-hidden rounded-xl border"
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        className="h-24 w-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="absolute top-2 right-2 rounded-full bg-black/70 text-white text-xs h-6 w-6"
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-emerald-500 py-3 font-semibold text-white hover:bg-emerald-600 disabled:bg-slate-300"
                    >
                        {loading ? 'Creating Turf…' : 'Create Turf'}
                    </button>
                </form>
            </div>
        </div>
    );
}
