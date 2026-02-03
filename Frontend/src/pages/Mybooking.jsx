import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";

export default function MyBookings() {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    async function fetchBookings() {
        setLoading(true);
        try {
            const res = await api.get("/booking/my/");
            setBookings(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const statusStyle = {
        PENDING: "bg-yellow-100 text-yellow-700",
        CONFIRMED: "bg-green-100 text-green-700",
        CANCELLED: "bg-red-100 text-red-700",
        REFUNDED: "bg-blue-100 text-blue-700",
    };

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="mx-auto max-w-5xl space-y-6">

                {/* HEADER */}
                <div className="rounded-3xl bg-white p-6 shadow-lg">
                    <h1 className="text-2xl font-bold text-slate-900">
                        My Bookings
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        View and manage your turf bookings
                    </p>
                </div>

                {loading ? (
                    <div className="py-24 text-center text-slate-500">
                        Loading your bookings...
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="py-24 text-center text-slate-500">
                        <p className="text-lg font-semibold">
                            No bookings yet ⚽
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                onClick={() => navigate(`/booking/${booking.id}`)}
                                className="cursor-pointer rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                    {/* LEFT */}
                                    <div>
                                        <h3 className="font-semibold text-slate-900">
                                            Turf Booking
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-600">
                                            {booking.booking_date} ·{" "}
                                            {booking.start_time.slice(0, 5)} –{" "}
                                            {booking.end_time.slice(0, 5)}
                                        </p>
                                    </div>

                                    {/* RIGHT */}
                                    <div className="flex items-center gap-4">
                                        <p className="text-lg font-bold text-slate-900">
                                            ₹{booking.amount}
                                        </p>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[booking.status]}`}
                                        >
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}