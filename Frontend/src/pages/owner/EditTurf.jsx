import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTurf, updateTurf } from '../../api/turf.api.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';

const EditTurf = () => {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadTurf = async () => {
            setLoading(true);
            try {
                const data = await getTurf(id);
                setForm({
                    name: data.name || '',
                    description: data.description || '',
                    location: data.location || '',
                    city: data.city || '',
                    state: data.state || '',
                    latitude: data.latitude || '',
                    longitude: data.longitude || '',
                    opening_time: data.opening_time || '06:00:00',
                    closing_time: data.closing_time || '23:00:00',
                });
            } catch {
                setError('Failed to load turf');
            } finally {
                setLoading(false);
            }
        };
        loadTurf();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await updateTurf(id, form);
            navigate('/owner/turfs');
        } catch {
            setError('Failed to update turf');
        } finally {
            setLoading(false);
        }
    };

    if (!form) {
        return (
            <div className="mx-auto max-w-2xl flex justify-center items-center h-48">
                <Spinner className="w-8 h-8 text-gray-400" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl space-y-4">
            <h1 className="text-2xl font-semibold text-slate-900">Edit Turf</h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all duration-150 hover:shadow-md"
            >
                <Input
                    label="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
                <Input
                    label="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                />
                <Input
                    label="Location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                        label="City"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        required
                    />
                    <Input
                        label="State"
                        value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                        label="Latitude"
                        value={form.latitude}
                        onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                    />
                    <Input
                        label="Longitude"
                        value={form.longitude}
                        onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                        label="Opening time"
                        type="time"
                        value={form.opening_time}
                        onChange={(e) => setForm({ ...form, opening_time: e.target.value })}
                    />
                    <Input
                        label="Closing time"
                        type="time"
                        value={form.closing_time}
                        onChange={(e) => setForm({ ...form, closing_time: e.target.value })}
                    />
                </div>

                {error && <p className="text-sm text-rose-600">{error}</p>}

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Saving...' : 'Update Turf'}
                </Button>
            </form>
        </div>
    );
};

export default EditTurf;