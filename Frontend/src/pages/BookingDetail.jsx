import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";
import { CourtCardShimmer } from "../components/Shimmers";
import Button from "../components/ui/Button.jsx";
import useRazorpayPayment from "../hooks/useRazorpayPayment.jsx";
import { cancelBooking as cancelBookingApi } from "../booking.api.js";

export default function BookingDetail() {
    const { id } = useParams();
    const { payNow } = useRazorpayPayment();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [timeLeftMs, setTimeLeftMs] = useState(null);
    const [isExpired, setIsExpired] = useState(false);

    /* ---------------- FETCH BOOKING ---------------- */
    useEffect(() => {
        fetchBooking();
    }, []);

    async function fetchBooking() {
        try {
            setLoading(true);
            const res = await api.get(`/booking/${id}/`);
            setBooking(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Unable to load booking");
        } finally {
            setLoading(false);
        }
    }

    /* ---------------- EXPIRY TIMER ---------------- */
    useEffect(() => {
        if (
            !booking ||
            booking.status === "CANCELLED" ||
            booking.status === "CONFIRMED" ||
            !booking.expiry
        ) {
            setIsExpired(false);
            setTimeLeftMs(null);
            return;
        }

        const expiry = new Date(booking.expiry);
        if (Number.isNaN(expiry.getTime())) return;

        const update = () => {
            const diff = expiry.getTime() - Date.now();
            if (diff <= 0) {
                setIsExpired(true);
                setTimeLeftMs(0);
            } else {
                setIsExpired(false);
                setTimeLeftMs(diff);
            }
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [booking]);

    const formatTimeLeft = (ms) => {
        if (ms == null) return "";
        const totalSeconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    };

    /* ---------------- ACTIONS ---------------- */
    const handleCancel = async () => {
        const ok = window.confirm("Are you sure you want to cancel this booking?");
        if (!ok) return;

        setActionLoading(true);

        try {
            await cancelBookingApi(id);
            toast.success("Booking cancelled successfully");
            fetchBooking();
        } catch {
            toast.error("Unable to cancel booking");
        } finally {
            setActionLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!booking || isExpired) {
            toast.error("Payment window has expired");
            return;
        }

        setActionLoading(true);

        try {
            await payNow({
                booking,
                onSuccess: () => {
                    toast.success("Payment successful 🎉");
                    fetchBooking();
                },
                onError: () => {
                    toast.error("Payment failed. Please try again.");
                },
            });
        } catch {
            toast.error("Payment initialization failed");
        } finally {
            setActionLoading(false);
        }
    };

    const openGoogleMaps = () => {
        if (!booking) return;
        const query = `${booking.turf_location}, ${booking.turf_city}, ${booking.turf_state}`;
        window.open(
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                query
            )}`,
            "_blank"
        );
    };

    /* ---------------- LOADING ---------------- */
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-12">
                <div className="mx-auto max-w-4xl space-y-6">
                    <CourtCardShimmer />
                    <CourtCardShimmer />
                    <CourtCardShimmer />
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 text-red-500">
                Booking not found
            </div>
        );
    }

    /* ---------------- UI ---------------- */
    const statusColor = {
        PENDING: "bg-yellow-100 text-yellow-700",
        CONFIRMED: "bg-green-100 text-green-700",
        CANCELLED: "bg-red-100 text-red-700",
        REFUNDED: "bg-blue-100 text-blue-700",
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10">
            <div className="mx-auto max-w-5xl space-y-8">
                {/* HEADER CARD */}
                <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-6 text-white">
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-widest text-slate-300">
                                    Booking detail
                                </p>
                                <h1 className="mt-1 text-2xl font-semibold">
                                    {booking.turf_name}
                                </h1>
                                <p className="mt-1 text-sm text-slate-300">
                                    {booking.turf_location}, {booking.turf_city},{" "}
                                    {booking.turf_state}
                                </p>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[booking.status]}`}
                                >
                                    {booking.status}
                                </span>

                                <button
                                    onClick={openGoogleMaps}
                                    className="rounded-full bg-amber-400 px-4 py-1.5 text-xs font-semibold text-slate-900 hover:bg-amber-300"
                                >
                                    📍 Open location
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* BODY */}
                    <div className="space-y-4 bg-slate-50 p-6">
                        <div className="flex justify-between rounded-2xl bg-white p-4 shadow-sm">
                            <span className="text-sm text-slate-500">Time</span>
                            <span className="font-semibold">
                                {booking.start_time.slice(0, 5)} –{" "}
                                {booking.end_time.slice(0, 5)}
                            </span>
                        </div>

                        <div className="flex justify-between rounded-2xl bg-white p-4 shadow-sm">
                            <span className="text-sm text-slate-500">Date</span>
                            <span className="font-semibold">{booking.booking_date}</span>
                        </div>

                        <div className="flex justify-between rounded-2xl bg-white p-4 shadow-sm">
                            <span className="text-sm text-slate-500">Total amount</span>
                            <span className="text-xl font-bold">₹{booking.amount}</span>
                        </div>
                    </div>
                </div>

                {/* ACTIONS */}
                {booking.status !== "CANCELLED" &&
                    booking.status !== "CONFIRMED" && (
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <Button
                                variant="secondary"
                                onClick={handleCancel}
                                disabled={actionLoading}
                            >
                                Cancel booking
                            </Button>

                            {booking.payment_status === "INITIATED" && (
                                <Button
                                    onClick={handlePayment}
                                    disabled={actionLoading || isExpired}
                                >
                                    {actionLoading ? "Processing…" : "Pay now"}
                                </Button>
                            )}
                        </div>
                    )}

                {/* TIMER */}
                {!isExpired &&
                    timeLeftMs !== null &&
                    booking.payment_status === "INITIATED" && (
                        <p
                            className={`text-sm ${timeLeftMs < 60000 ? "text-rose-600" : "text-slate-600"
                                }`}
                        >
                            Complete payment within{" "}
                            <span className="font-semibold">
                                {formatTimeLeft(timeLeftMs)}
                            </span>
                        </p>
                    )}

                {isExpired && (
                    <p className="text-sm text-rose-600">
                        Payment window has expired. Please create a new booking.
                    </p>
                )}
            </div>
        </div>
    );
}
