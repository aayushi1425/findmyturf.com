import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import PageLayout from "../../components/PageLayout";

export default function OwnerTurfBookings() {
    const { turfId } = useParams();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    async function fetchBookings() {
        setLoading(true);
        try {
            const res = await api.get(`/owner/turf/${turfId}/bookings/`);
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

    const paymentStyle = {
        INITIATED: "bg-yellow-100 text-yellow-700",
        SUCCESS: "bg-green-100 text-green-700",
        FAILED: "bg-red-100 text-red-700",
        REFUNDED: "bg-blue-100 text-blue-700",
    };

    return (
        <PageLayout>
        <div className="min-h-screen px-6 py-10">
            <div className="mx-auto max-w-6xl space-y-6">

                {/* HEADER */}
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Turf Bookings
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        All bookings for this turf
                    </p>
                </div>

                {/* CONTENT */}
                {loading ? (
                    <div className="py-24 text-center text-slate-500">
                        Loading bookings...
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="rounded-3xl bg-white p-10 text-center shadow">
                        <p className="text-lg font-semibold text-slate-900">
                            No bookings yet 📭
                        </p>
                        <p className="mt-2 text-sm text-slate-600">
                            Bookings will appear here once users start booking.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
                        <table className="w-full border-collapse text-sm">
                            <thead className="bg-slate-100 text-slate-700">
                                <tr>
                                    <th className="px-4 py-3 text-left">Customer</th>
                                    <th className="px-4 py-3 text-left">Date</th>
                                    <th className="px-4 py-3 text-left">Time</th>
                                    <th className="px-4 py-3 text-left">Amount</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Payment</th>
                                </tr>
                            </thead>

                            <tbody>
                                {bookings.map((b) => (
                                    <tr
                                        key={b.id}
                                        className="border-t hover:bg-slate-50"
                                    >
                                        {/* CUSTOMER */}
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-slate-900">
                                                {b.customer_name || "—"}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {b.customer_phone || ""}
                                            </p>
                                        </td>

                                        {/* DATE */}
                                        <td className="px-4 py-3 text-slate-700">
                                            {b.booking_date}
                                        </td>

                                        {/* TIME */}
                                        <td className="px-4 py-3 text-slate-700">
                                            {b.start_time.slice(0, 5)} –{" "}
                                            {b.end_time.slice(0, 5)}
                                        </td>

                                        {/* AMOUNT */}
                                        <td className="px-4 py-3 font-semibold text-slate-900">
                                            ₹{b.amount}
                                        </td>

                                        {/* STATUS */}
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[b.status]}`}
                                            >
                                                {b.status}
                                            </span>
                                        </td>

                                        {/* PAYMENT */}
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${paymentStyle[b.payment_status]}`}
                                            >
                                                {b.payment_status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
        </PageLayout>
    );
}