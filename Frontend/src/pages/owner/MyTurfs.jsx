import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listOwnerTurfs } from '../../api/turf.api.js';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Spinner from '../../components/ui/Spinner.jsx';

const MyTurfs = () => {
    const [turfs, setTurfs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await listOwnerTurfs();
                setTurfs(data);
            } catch {
                setError('Failed to load turfs');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-slate-900">My Turfs</h1>
                <Button as={Link} to="/owner/turfs/add">
                    Add Turf
                </Button>
            </div>

            {loading && (
                <div className="flex justify-center py-6">
                    <Spinner className="w-6 h-6 text-gray-400" />
                </div>
            )}
            {error && <p className="text-rose-600">{error}</p>}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {turfs.map((turf) => (
                    <div
                        key={turf.id}
                        className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-lg font-semibold text-slate-900">{turf.name}</div>
                            <Badge color={turf.is_open ? 'green' : 'red'}>
                                {turf.is_open ? 'Open' : 'Closed'}
                            </Badge>
                        </div>
                        <div className="text-sm text-slate-600 mt-1">
                            {turf.city}, {turf.state}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <Button as={Link} variant="secondary" size="sm" to={`/owner/turfs/${turf.id}/edit`}>
                                Edit
                            </Button>
                            <Button as={Link} variant="secondary" size="sm" to={`/owner/bookings?tid=${turf.id}`}>
                                Bookings
                            </Button>
                            <Button as={Link} variant="secondary" size="sm" to={`/owner/courts?tid=${turf.id}`}>
                                Courts
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && !error && !turfs.length && (
                <p className="text-sm text-slate-600">No turfs yet. Add your first turf.</p>
            )}
        </div>
    );
};

export default MyTurfs;