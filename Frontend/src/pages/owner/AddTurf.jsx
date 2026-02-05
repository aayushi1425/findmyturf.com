import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTurf } from '../../api/turf.api.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';

const AddTurf = () => {
    const [form, setForm] = useState({
        name: '',
        description: '',
        location: '',
        city: '',
        state: '',
        latitude: '',
        longitude: '',
        is_open: true,
        opening_time: '06:00:00',
        closing_time: '23:00:00',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await createTurf(form);
            navigate('/owner/turfs');
        } catch {
            setError('Failed to create turf');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center px-4">
            <div className="w-full max-w-2xl space-y-4">
                <h1 className="text-2xl font-semibold text-slate-900">Add Turf</h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-lg"
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
                            label="Opening Time"
                            type="time"
                            value={form.opening_time}
                            onChange={(e) => setForm({ ...form, opening_time: e.target.value })}
                        />
                        <Input
                            label="Closing Time"
                            type="time"
                            value={form.closing_time}
                            onChange={(e) => setForm({ ...form, closing_time: e.target.value })}
                        />
                    </div>

                    {/* Is open toggle */}
                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-sm text-slate-700">
                            <input
                                type="checkbox"
                                checked={form.is_open}
                                onChange={(e) => setForm({ ...form, is_open: e.target.checked })}
                                className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                            />
                            Open for booking
                        </label>
                    </div>

                    {error && <p className="text-sm text-rose-600">{error}</p>}

                    <Button
                        type="submit"
                        className="w-full flex justify-center items-center gap-2"
                        disabled={loading}
                    >
                        {loading && <Spinner className="w-4 h-4 text-white" />}
                        {loading ? 'Saving...' : 'Create Turf'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AddTurf;