import { use, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function BookingDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchBooking();
    }, []);

    async function fetchBooking() {
        try {
            const res = await api.get(`/booking/${id}/`);
            setBooking(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    function openGoogleMaps() {
        if (!booking) return;

        const query = `${booking.turf_location}, ${booking.turf_city}, ${booking.turf_state}`;
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            query
        )}`;
        window.open(url, "_blank");
    }

    async function cancelBooking() {
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmCancel) return;

        setActionLoading(true);

        try {
            await api.post(`/booking/${booking.id}/cancel/`);
            alert("Booking cancelled successfully");
            fetchBooking();
        } catch (err) {
            // console.error(err.response.data.error);
        } finally {
            setActionLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center text-slate-500">
                Loading booking details...
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="flex min-h-screen items-center justify-center text-red-500">
                Booking not found
            </div>
        );
    }

    const statusColor = {
        PENDING: "bg-yellow-100 text-yellow-700",
        CONFIRMED: "bg-green-100 text-green-700",
        CANCELLED: "bg-red-100 text-red-700",
        REFUNDED: "bg-blue-100 text-blue-700",
    };

    const paymentColor = {
        INITIATED: "bg-yellow-100 text-yellow-700",
        SUCCESS: "bg-green-100 text-green-700",
        FAILED: "bg-red-100 text-red-700",
        REFUNDED: "bg-blue-100 text-blue-700",
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 px-6 py-12">
            <div className="mx-auto max-w-4xl space-y-8">

                {/* HEADER */}
                <div className="rounded-3xl bg-white p-6 shadow-lg">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="text-2xl font-bold text-slate-900">
                            Booking Details
                        </h1>

                        <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-1 text-xs font-medium text-slate-600">
                            #{booking.id.slice(0, 8)}…
                        </span>
                    </div>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-lg">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                {booking.turf_name}
                            </h2>

                            <p className="mt-1 text-sm text-slate-600">
                                {booking.turf_location}, {booking.turf_city}, {booking.turf_state}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Size: {booking.length} × {booking.width} × {booking.height} m
                            </p>
                        </div>

                        <button
                            onClick={openGoogleMaps}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-900 hover:bg-slate-50"
                        >
                            📍 Open Maps
                        </button>
                    </div>
                </div>

                {/* SUMMARY GRID */}
                <div className="grid gap-6 md:grid-cols-2">

                    {/* LEFT */}
                    <div className="rounded-3xl bg-white p-6 shadow-lg space-y-4">
                        <div>
                            <p className="text-xs text-slate-500">Date</p>
                            <p className="font-semibold text-slate-900">
                                {booking.booking_date}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-slate-500">Time Slot</p>
                            <p className="font-semibold text-slate-900">
                                {booking.start_time.slice(0, 5)} –{" "}
                                {booking.end_time.slice(0, 5)}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-slate-500">Created</p>
                            <p className="text-sm text-slate-700">
                                {new Date(booking.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="rounded-3xl bg-white p-6 shadow-lg space-y-4">
                        <div>
                            <p className="text-xs text-slate-500">Total Amount</p>
                            <p className="text-4xl font-bold tracking-tight text-slate-900">
                                ₹{booking.amount}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[booking.status]}`}
                            >
                                {booking.status}
                            </span>

                            {booking.payment_status != "CANCELLED" && (
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${paymentColor[booking.payment_status]}`}
                                >
                                    {booking.payment_status}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                    <div className="rounded-3xl bg-white p-6 shadow-lg space-y-4">
                        {booking.payment_status === "INITIATED" && booking.status != "CANCELLED" && (
                            <button onClick={() => alert("Redirect to payment gateway")} className="w-full rounded-xl bg-linear-to-br from-slate-900 to-slate-800 py-3 text-sm font-semibold text-white hover:opacity-90">
                                Pay Now
                            </button>
                        )}

                        {booking.payment_status != "SUCCESS" && booking.status != "CANCELLED" && (
                            <button
                                onClick={cancelBooking}
                                disabled={actionLoading}
                                className="w-full rounded-xl border border-red-300 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                            >
                                {actionLoading ? "Cancelling…" : "Cancel Booking"}
                            </button>
                        )}

                        {booking.status === "CANCELLED" && (
                            <p className="text-center text-sm font-medium text-red-600">
                                This booking has been cancelled
                            </p>
                        )}

                        {booking.status === "REFUNDED" && (
                            <p className="text-center text-sm font-medium text-blue-600">
                                Amount refunded successfully
                            </p>
                        )}
                    </div>
                
            </div>
        </div>
    );
}