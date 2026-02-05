import React, { useEffect, useState } from 'react';
import { listOwnerTurfs, listOwnerTurfBookings } from '../../api/turf.api.js';
import Button from '../../components/ui/Button.jsx';
import { Link } from 'react-router-dom';
import Spinner from '../../components/ui/Spinner.jsx';

const Dashboard = () => {
    const [turfs, setTurfs] = useState([]);
    const [bookingsCount, setBookingsCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const ownerTurfs = await listOwnerTurfs();
                setTurfs(ownerTurfs);

                // Fetch bookings for all turfs
                const allBookings = await Promise.all(
                    ownerTurfs.map((turf) => listOwnerTurfBookings(turf.id))
                );
                const totalBookings = allBookings.reduce((acc, b) => acc + b.length, 0);
                setBookingsCount(totalBookings);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="space-y-6 px-4">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">Owner Dashboard</h1>
                <p className="text-sm text-slate-600">Manage turfs, courts, and bookings.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[{
                    label: 'Turfs',
                    value: turfs.length,
                }, {
                    label: 'Total Bookings',
                    value: bookingsCount,
                }].map((card) => (
                    <div
                        key={card.label}
                        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-150"
                    >
                        <div className="text-sm text-slate-500">{card.label}</div>
                        <div className="text-3xl font-bold text-slate-900">
                            {loading ? <Spinner className="w-6 h-6 text-slate-400" /> : card.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
                <Button as={Link} to="/owner/turfs/add">
                    Add Turf
                </Button>
                <Button variant="secondary" as={Link} to="/owner/turfs">
                    Manage Turfs
                </Button>
            </div>

            {/* Loading Indicator */}
            {loading && (
                <p className="mt-2 text-sm text-slate-600 flex items-center gap-2">
                    <Spinner className="w-4 h-4 text-slate-400" />
                    Loading summary…
                </p>
            )}
        </div>
    );
};

export default Dashboard;