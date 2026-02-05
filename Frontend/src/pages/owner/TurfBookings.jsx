import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listOwnerTurfs, listOwnerTurfBookings } from '../../api/turf.api.js';
import Input from '../../components/ui/Input.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Spinner from '../../components/ui/Spinner.jsx';

const TurfBookings = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialTurf = searchParams.get('tid') || '';
    const [turfs, setTurfs] = useState([]);
    const [selected, setSelected] = useState(initialTurf);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadTurfs = async () => {
            const data = await listOwnerTurfs();
            setTurfs(data);
            if (!selected && data.length) setSelected(data[0].id);
        };
        loadTurfs();
    }, []);

    useEffect(() => {
        const loadBookings = async () => {
            if (!selected) return;
            setSearchParams({ tid: selected });
            setLoading(true);
            try {
                const data = await listOwnerTurfBookings(selected);
                setBookings(data);
            } finally {
                setLoading(false);
            }
        };
        loadBookings();
    }, [selected, setSearchParams]);

    const getBadgeColor = (status) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'green';
            case 'pending':
                return 'yellow';
            case 'cancelled':
                return 'red';
            default:
                return 'blue';
        }
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-slate-900">Turf Bookings</h1>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                <Input
                    label="Select Turf"
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
            </div>

            {loading && (
                <div className="flex justify-center py-6">
                    <Spinner className="w-6 h-6 text-gray-400" />
                </div>
            )}

            <div className="space-y-3">
                {bookings.map((b) => (
                    <div
                        key={b.id}
                        className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">
                            <div className="font-semibold">{b.customer_name}</div>
                            <Badge color={getBadgeColor(b.status)}>{b.status}</Badge>
                        </div>
                        <div className="text-sm text-slate-700 mt-1">
                            {b.booking_date} · {b.start_time} - {b.end_time}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                            {b.court_sport} · ₹{b.amount} · {b.customer_phone}
                        </div>
                    </div>
                ))}
            </div>

            {!loading && !bookings.length && (
                <p className="text-sm text-slate-600">No bookings yet for this turf.</p>
            )}
        </div>
    );
};

export default TurfBookings;