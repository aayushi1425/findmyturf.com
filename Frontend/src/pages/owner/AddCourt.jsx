import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { listOwnerTurfs } from '../../api/turf.api.js';
import { createCourt } from '../../api/court.api.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';

const AddCourt = () => {
    const [searchParams] = useSearchParams();
    const [turfs, setTurfs] = useState([]);
    const [form, setForm] = useState({
        turf: searchParams.get('tid') || '',
        sports_type: 'FOOTBALL',
        price: '',
        length: '',
        width: '',
        height: '',
        is_open: true,
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadTurfs = async () => {
            const data = await listOwnerTurfs();
            setTurfs(data);
            if (!form.turf && data.length) setForm((prev) => ({ ...prev, turf: data[0].id }));
        };
        loadTurfs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await createCourt(form);
            navigate('/owner/courts');
        } catch {
            setError('Failed to create court');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-xl px-4">
            <h1 className="text-2xl font-semibold text-slate-900 mb-4">Add Court</h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-lg"
            >
                {/* Turf select */}
                <Input
                    label="Turf"
                    as="select"
                    value={form.turf}
                    onChange={(e) => setForm({ ...form, turf: e.target.value })}
                >
                    {turfs.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.name}
                        </option>
                    ))}
                </Input>

                {/* Sports type select */}
                <Input
                    label="Sports type"
                    as="select"
                    value={form.sports_type}
                    onChange={(e) => setForm({ ...form, sports_type: e.target.value })}
                >
                    {['FOOTBALL', 'CRICKET', 'TENNIS', 'BADMINTON', 'VOLLEYBALL', 'PICKLEBALL', 'GOLF'].map(
                        (sport) => (
                            <option key={sport} value={sport}>
                                {sport}
                            </option>
                        )
                    )}
                </Input>

                {/* Price */}
                <Input
                    label="Price"
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                />

                {/* Dimensions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                        label="Length"
                        value={form.length}
                        onChange={(e) => setForm({ ...form, length: e.target.value })}
                    />
                    <Input
                        label="Width"
                        value={form.width}
                        onChange={(e) => setForm({ ...form, width: e.target.value })}
                    />
                    <Input
                        label="Height"
                        value={form.height}
                        onChange={(e) => setForm({ ...form, height: e.target.value })}
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

                {/* Submit button */}
                <Button type="submit" className="w-full flex justify-center items-center gap-2" disabled={loading}>
                    {loading && <Spinner className="w-4 h-4 text-white" />}
                    {loading ? 'Saving...' : 'Create Court'}
                </Button>
            </form>
        </div>
    );
};

export default AddCourt;