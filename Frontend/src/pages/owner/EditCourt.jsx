import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCourt, updateCourt } from '../../api/court.api.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';

const EditCourt = () => {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await getCourt(id);
                setForm({
                    turf: data.turf,
                    sports_type: data.sports_type,
                    price: data.price,
                    length: data.length,
                    width: data.width,
                    height: data.height,
                    is_open: data.is_open,
                });
            } catch {
                setError('Failed to load court');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await updateCourt(id, form);
            navigate('/owner/courts');
        } catch {
            setError('Failed to update court');
        } finally {
            setLoading(false);
        }
    };

    if (!form) {
        return (
            <div className="mx-auto max-w-xl flex justify-center items-center h-48">
                <Spinner className="w-8 h-8 text-gray-400" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-xl space-y-4">
            <h1 className="text-2xl font-semibold text-slate-900">Edit Court</h1>
            <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all duration-150 hover:shadow-md"
            >
                <Input label="Sports type" value={form.sports_type} disabled className="bg-gray-100" />

                <Input
                    label="Price"
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                />

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

                {error && <p className="text-sm text-rose-600">{error}</p>}

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? 'Saving...' : 'Update Court'}
                </Button>
            </form>
        </div>
    );
};

export default EditCourt;