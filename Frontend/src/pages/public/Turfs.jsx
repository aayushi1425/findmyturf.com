import React, { useEffect, useState } from 'react';
import TurfCard from '../../components/turf/TurfCard.jsx';
import TurfFilters from '../../components/turf/TurfFilters.jsx';
import { listTurfs } from '../../api/turf.api.js';

const Turfs = () => {
    const [filters, setFilters] = useState({});
    const [turfs, setTurfs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await listTurfs(filters);
                const results = (data.results || []).map((turf) => {
                    const defaultImageObj = turf.images?.find((img) => img.is_default);
                    return {
                        ...turf,
                        default_image: defaultImageObj ? defaultImageObj.image_url : null,
                    };
                });

                setTurfs(results);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load turfs');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [filters]);

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">Explore turfs</h1>
                <p className="text-sm text-slate-600">Filter by city, price, and distance.</p>
            </div>

            <TurfFilters onChange={setFilters} />

            {loading && <p className="text-sm text-slate-600">Loading...</p>}
            {error && <p className="text-sm text-rose-600">{error}</p>}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {turfs.map((turf) => (
                    <TurfCard key={turf.id} turf={turf} />
                ))}
            </div>

            {!loading && !error && !turfs.length && (
                <p className="text-sm text-slate-600">No turfs match your filters.</p>
            )}
        </div>
    );
};

export default Turfs;