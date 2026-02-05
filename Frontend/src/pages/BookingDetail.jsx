import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { CourtCardShimmer } from "../components/Shimmers";

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
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
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
        } finally {
            setActionLoading(false);
        }
    }

    /* ✅ SHIMMER LOADING STATE */
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
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* TOP CARD WITH GRADIENT HEADER */}
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            {/* Gradient header like reference */}
            <div className="bg-linear-to-r from-slate-900 via-slate-900 to-slate-800 px-6 py-6 text-white sm:px-8 sm:py-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                    Booking detail
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
                    {booking.turf_name}
                  </h1>
                  <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                    {booking.turf_location}, {booking.turf_city}, {booking.turf_state}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-3 sm:items-end">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[booking.status]}`}
                    >
                      {booking.status}
                    </span>
                    <span
                      className={`rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-50`}
                    >
                      {booking.payment_status}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={openGoogleMaps}
                    className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-1.5 text-xs font-semibold text-slate-900 shadow-sm hover:bg-amber-300"
                  >
                    <span>📍</span>
                    <span>Open location</span>
                  </button>
                </div>
              </div>
            </div>

            {/* BODY GRID */}
            <div className="space-y-6 bg-slate-50 px-4 py-6 sm:px-6 sm:py-7">
              {/* First row: booking time + date */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-white px-4 py-4 text-sm text-slate-700 shadow-sm">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Booking time
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {booking.start_time.slice(0, 5)} – {booking.end_time.slice(0, 5)}
                  </p>
                </div>

                <div className="rounded-2xl bg-white px-4 py-4 text-sm text-slate-700 shadow-sm">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Date
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {booking.booking_date}
                  </p>
                </div>

                <div className="rounded-2xl bg-white px-4 py-4 text-sm text-slate-700 shadow-sm">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Court ID
                  </p>
                  <p className="mt-2 truncate text-xs font-mono text-slate-900">
                    {booking.court}
                  </p>
                </div>
              </div>

              {/* Second row: sport + size + payment */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-white px-4 py-4 text-sm text-slate-700 shadow-sm">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Sport
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {booking.sports_type || booking.sport || "CRICKET"}
                  </p>
                </div>

                <div className="rounded-2xl bg-white px-4 py-4 text-sm text-slate-700 shadow-sm">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Size
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {booking.length} × {booking.width} × {booking.height}
                  </p>
                </div>

                <div className="rounded-2xl bg-white px-4 py-4 text-sm text-slate-700 shadow-sm">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Payment
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {booking.payment_status}
                  </p>
                </div>
              </div>

              {/* Total amount */}
              <div className="rounded-2xl bg-white px-4 py-4 text-sm text-slate-700 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Total amount
                  </p>
                  <p className="text-2xl font-bold text-slate-900">₹{booking.amount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS BELOW CARD */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            {booking.payment_status !== "SUCCESS" && booking.status !== "CANCELLED" && (
              <button
                onClick={cancelBooking}
                disabled={actionLoading}
                className="w-full rounded-xl border border-red-300 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60 sm:w-auto sm:px-6"
              >
                {actionLoading ? "Cancelling…" : "Cancel booking"}
              </button>
            )}

            {booking.payment_status === "INITIATED" && booking.status !== "CANCELLED" && (
              <button
                onClick={() => alert("Redirect to payment gateway")}
                className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white hover:bg-emerald-600 sm:w-auto sm:px-8"
              >
                Pay now
              </button>
            )}
          </div>
        </div>
      </div>
    );
}
