import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";
import { CourtCardShimmer } from "../components/Shimmers";
import Button from "../components/ui/button.jsx";
import useRazorpayPayment from "../hooks/useRazorpayPayment.jsx";
import { cancelBooking as cancelBookingApi } from "../booking.api.js";

/* ---------------- STAR RATING ---------------- */
function StarRating({ value, onChange, disabled = false }) {
    return (
        <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && onChange(star)}
                    className={`text-3xl transition
                        ${star <= value
                            ? "text-amber-400"
                            : "text-slate-300"
                        }
                        ${disabled
                            ? "cursor-default"
                            : "hover:scale-125"
                        }
                    `}
                >
                    ★
                </button>
            ))}
        </div>
    );
}

/* ---------------- MAIN ---------------- */
export default function BookingDetail() {
    const { id } = useParams();
    const { payNow } = useRazorpayPayment();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [timeLeftMs, setTimeLeftMs] = useState(null);
    const [isExpired, setIsExpired] = useState(false);

    /* FEEDBACK */
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [feedbackLoading, setFeedbackLoading] = useState(false);

    /* ---------------- FETCH BOOKING ---------------- */
    useEffect(() => {
        fetchBooking();
    }, []);

    async function fetchBooking() {
        try {
            setLoading(true);
            const res = await api.get(`/booking/${id}/`);
            setBooking(res.data);
        } catch {
            toast.error("Unable to load booking");
        } finally {
            setLoading(false);
        }
    }

    /* ---------------- SYNC FEEDBACK FROM BACKEND ---------------- */
    useEffect(() => {
        if (booking?.feedback) {
            setRating(booking.feedback.rating);
            setComment(booking.feedback.comment || "");
        }
    }, [booking]);

    /* ---------------- EXPIRY TIMER ---------------- */
    useEffect(() => {
        if (!booking || booking.status !== "PENDING" || !booking.expiry) {
            setTimeLeftMs(null);
            setIsExpired(false);
            return;
        }

        const expiry = new Date(booking.expiry);

        const tick = () => {
            const diff = expiry - Date.now();
            if (diff <= 0) {
                setIsExpired(true);
                setTimeLeftMs(0);
            } else {
                setTimeLeftMs(diff);
            }
        };

        tick();
        const i = setInterval(tick, 1000);
        return () => clearInterval(i);
    }, [booking]);

    const formatTimeLeft = (ms) => {
        const s = Math.ceil(ms / 1000);
        return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(
            s % 60
        ).padStart(2, "0")}`;
    };

    /* ---------------- ACTIONS ---------------- */
    const handleCancel = async () => {
        if (!window.confirm("Cancel this booking?")) return;
        setActionLoading(true);
        try {
            await cancelBookingApi(id);
            toast.success("Booking cancelled");
            fetchBooking();
        } catch {
            toast.error("Unable to cancel booking");
        } finally {
            setActionLoading(false);
        }
    };

    const handlePayment = async () => {
        if (isExpired) {
            toast.error("Payment window expired");
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
                onError: () => toast.error("Payment failed"),
            });
        } finally {
            setActionLoading(false);
        }
    };

    /* ---------------- FEEDBACK ---------------- */
    const submitFeedback = async () => {
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        setFeedbackLoading(true);
        try {
            await api.post("/feedback/create/", {
                booking: booking.id,
                rating,
                comment,
            });

            toast.success("Thanks for your feedback ❤️");
            await fetchBooking();
        } catch {
            toast.error("Unable to submit feedback");
        } finally {
            setFeedbackLoading(false);
        }
    };

    /* ---------------- LOADING ---------------- */
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-12">
                <div className="mx-auto max-w-4xl space-y-6">
                    <CourtCardShimmer />
                    <CourtCardShimmer />
                </div>
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
        CONFIRMED: "bg-emerald-100 text-emerald-700",
        CANCELLED: "bg-rose-100 text-rose-700",
        REFUNDED: "bg-blue-100 text-blue-700",
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10">
            <div className="mx-auto max-w-4xl space-y-8">

                {/* HEADER */}
                <div className="rounded-3xl bg-white shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-6 text-white">
                        <h1 className="text-2xl font-semibold">
                            {booking.turf_name}
                        </h1>
                        <p className="text-sm text-slate-300">
                            {booking.turf_location}, {booking.turf_city}
                        </p>
                    </div>

                    <div className="p-6 space-y-4 bg-slate-50">
                        <div className="flex justify-between rounded-xl bg-white p-4 shadow-sm">
                            <span className="text-slate-500">Time</span>
                            <span className="font-semibold">
                                {booking.start_time.slice(0, 5)} –{" "}
                                {booking.end_time.slice(0, 5)}
                            </span>
                        </div>

                        <div className="flex justify-between rounded-xl bg-white p-4 shadow-sm">
                            <span className="text-slate-500">Date</span>
                            <span className="font-semibold">
                                {booking.booking_date}
                            </span>
                        </div>

                        <div className="flex justify-between rounded-xl bg-white p-4 shadow-sm">
                            <span className="text-slate-500">Amount</span>
                            <span className="text-xl font-bold">
                                ₹{booking.amount}
                            </span>
                        </div>

                        <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusColor[booking.status]}`}
                        >
                            {booking.status}
                        </span>
                    </div>
                </div>

                {/* ACTIONS */}
                {booking.status === "PENDING" && (
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="secondary"
                            onClick={handleCancel}
                            disabled={actionLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePayment}
                            disabled={isExpired || actionLoading}
                        >
                            Pay now
                        </Button>
                    </div>
                )}

                {!isExpired && timeLeftMs && booking.status === "PENDING" && (
                    <p className="text-sm text-slate-600">
                        Complete payment within{" "}
                        <span className="font-semibold">
                            {formatTimeLeft(timeLeftMs)}
                        </span>
                    </p>
                )}

                {/* ⭐ FEEDBACK */}
                {booking.status === "CONFIRMED" && (
                    <div className="rounded-3xl bg-white p-6 shadow-md space-y-5">
                        <h2 className="text-lg font-semibold">
                            {booking.feedback
                                ? "Your feedback"
                                : "How was your experience?"}
                        </h2>

                        <StarRating
                            value={rating}
                            onChange={setRating}
                            disabled={!!booking.feedback}
                        />

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                            disabled={!!booking.feedback}
                            placeholder="Tell us what went well (optional)"
                            className={`w-full rounded-xl border px-4 py-2 text-sm focus:outline-none
                                ${booking.feedback
                                    ? "bg-slate-100 border-slate-200 cursor-not-allowed"
                                    : "border-slate-200 focus:border-slate-900"
                                }
                            `}
                        />

                        {!booking.feedback ? (
                            <Button
                                onClick={submitFeedback}
                                disabled={feedbackLoading}
                            >
                                {feedbackLoading
                                    ? "Submitting…"
                                    : "Submit feedback"}
                            </Button>
                        ) : (
                            <div className="rounded-xl bg-emerald-50 p-4 text-emerald-700 text-sm">
                                ✅ Feedback already submitted. Thanks for sharing!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}