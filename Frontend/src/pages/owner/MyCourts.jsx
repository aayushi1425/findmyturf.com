import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { listOwnerTurfs } from '../../api/turf.api.js';
import { deleteCourt, listCourtsByTurf } from '../../api/court.api.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Spinner from '../../components/ui/Spinner.jsx';

const MyCourts = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [turfs, setTurfs] = useState([]);
    const [selected, setSelected] = useState(searchParams.get('tid') || '');
    const [courts, setCourts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null); // track loading for delete
    const [error, setError] = useState(null);

    // Load owner turfs
    useEffect(() => {
        const loadTurfs = async () => {
            try {
                const data = await listOwnerTurfs();
                setTurfs(data);
                if (!selected && data.length) setSelected(data[0].id);
            } catch {
                setError('Failed to load turfs');
            }
        };
        loadTurfs();
    }, []);

    // Load courts when turf changes
    useEffect(() => {
        const loadCourts = async () => {
            if (!selected) return;
            setSearchParams({ tid: selected });
            setLoading(true);
            setError(null);
            try {
                const data = await listCourtsByTurf(selected);
                setCourts(data);
            } catch {
                setError('Failed to load courts');
            } finally {
                setLoading(false);
            }
        };
        loadCourts();
    }, [selected, setSearchParams]);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this court?')) return;

        setActionLoading(id);
        try {
            await deleteCourt(id);
            setCourts((prev) => prev.filter((c) => c.id !== id));
        } catch {
            alert('Failed to delete court');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-slate-900">My Courts</h1>
                <Button as={Link} to={`/owner/courts/add?tid=${selected || ''}`}>
                    Add Court
                </Button>
            </div>

            {turfs.length > 0 ? (
                <Input
                    label="Select turf"
                    as="select"
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                >
                    {turfs.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.name}
                        </option>
                    ))}
                </Input>
            ) : (
                <p className="text-sm text-slate-600">No turfs available. Add a turf first.</p>
            )}

            {loading && (
                <div className="flex justify-center py-6">
                    <Spinner className="w-6 h-6 text-gray-400" />
                </div>
            )}

            {error && <p className="text-sm text-rose-600">{error}</p>}

            <div className="space-y-3">
                {courts.map((court) => (
                    <div
                        key={court.id}
                        className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">
                            <div className="font-semibold">{court.sports_type}</div>
                            <div className="text-sm text-slate-600">₹{court.price}</div>
                        </div>
                        <div className="text-xs text-slate-500">
                            {court.length} x {court.width} x {court.height}
                        </div>
                        <div className="mt-3 flex gap-2">
                            <Button
                                as={Link}
                                variant="secondary"
                                size="sm"
                                to={`/owner/courts/${court.id}/edit`}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleDelete(court.id)}
                                disabled={actionLoading === court.id}
                            >
                                {actionLoading === court.id ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && !error && !courts.length && turfs.length > 0 && (
                <p className="text-sm text-slate-600">No courts yet for this turf.</p>
            )}
        </div>
    );
};

export default MyCourts;