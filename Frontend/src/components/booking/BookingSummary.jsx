import React from 'react';
import locationIcon from "../../assets/location_icon.png";

const statusStyles = {
    PENDING: 'bg-amber-100 text-amber-700',
    CONFIRMED: 'bg-emerald-100 text-emerald-700',
    CANCELLED: 'bg-rose-100 text-rose-700',
};

const paymentStyles = {
    INITIATED: 'bg-slate-100 text-slate-700',
    PAID: 'bg-emerald-100 text-emerald-700',
    FAILED: 'bg-rose-100 text-rose-700',
};

const BookingSummary = ({ booking }) => {
    if (!booking) return null;

    const openInMaps = () => {
        if (!booking.turf_latitude || !booking.turf_longitude) return;

        window.open(
            `https://www.google.com/maps/search/?api=1&query=${booking.turf_latitude},${booking.turf_longitude}`,
            '_blank'
        );
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">

            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-700 p-5 text-white">
                <div className="flex items-start justify-between">
                    {/* Left */}
                    <div>
                        <h3 className="text-lg font-semibold">{booking.turf_name}</h3>
                        <p className="mt-1 text-sm text-slate-300">
                            {booking.turf_location}, {booking.turf_city}, {booking.turf_state}
                        </p>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col items-end gap-3">
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[booking.status]}`}
                        >
                            {booking.status}
                        </span>

                        <button
                            onClick={openInMaps}
                            disabled={!booking.turf_latitude || !booking.turf_longitude}
                            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <img src={locationIcon} alt="location" className="w-8 h-8 object-contain" />
                            Open Location
                        </button>

                    </div>
                </div>
            </div>


            {/* Body */}
            <div className="space-y-6 p-5">

                {/* Time */}
                <div className="rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                                Booking Time
                            </p>
                            <p className="mt-1 text-base font-semibold text-slate-900">
                                {booking.start_time} – {booking.end_time}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs uppercase tracking-wide text-slate-500">
                                Date
                            </p>
                            <p className="mt-1 text-base font-semibold text-slate-900">
                                {booking.booking_date}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <Info label="Sport" value={booking.court_sport} />
                    <Info label="Court ID" value={booking.court} />
                    <Info
                        label="Size"
                        value={`${booking.length} × ${booking.width} × ${booking.height}`}
                    />
                    <Info
                        label="Payment"
                        value={booking.payment_status}
                        pill={paymentStyles[booking.payment_status]}
                    />
                </div>

                {/* Amount */}
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-medium text-slate-600">Total Amount</p>
                    <p className="text-xl font-semibold text-slate-900">
                        ₹{booking.amount}
                    </p>
                </div>

            </div>
        </div>
    );
};

const Info = ({ label, value, pill }) => (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
        <p className="text-xs uppercase tracking-wide text-slate-500">
            {label}
        </p>
        {pill ? (
            <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${pill}`}>
                {value}
            </span>
        ) : (
            <p className="mt-1 text-sm font-medium text-slate-900 truncate">
                {value}
            </p>
        )}
    </div>
);

export default BookingSummary;