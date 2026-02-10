export default function BookingSummary({ selectedSlots = [], price = 0 }) {
    if (!Array.isArray(selectedSlots) || selectedSlots.length === 0) return null;

    const sortedSlots = [...selectedSlots].sort(
        (a, b) => a.start_time.localeCompare(b.start_time)
    );

    const startTime = sortedSlots[0].start_time;
    const endTime = sortedSlots[sortedSlots.length - 1].end_time;
    const hours = sortedSlots.length;
    const totalAmount = hours * Number(price || 0);

    const formatCurrency = (value) => `₹${value.toLocaleString("en-IN")}`;

    return (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <h3 className="mb-4 text-sm font-semibold tracking-wide text-slate-900">
                Booking Summary
            </h3>

            <div className="space-y-3 text-sm text-slate-700">
                <ReminderRow
                    label="Time Slot"
                    value={`${startTime} – ${endTime}`}
                />

                <ReminderRow
                    label="Duration"
                    value={`${hours} ${hours > 1 ? "hours" : "hour"}`}
                />

                <ReminderRow
                    label="Price / hour"
                    value={formatCurrency(price)}
                />

                <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                    <span className="text-sm font-semibold text-slate-900">
                        Total Payable
                    </span>
                    <span className="text-xl font-bold text-slate-900">
                        {formatCurrency(totalAmount)}
                    </span>
                </div>
            </div>

            <p className="mt-3 text-xs text-slate-500">
                Slots are reserved temporarily. Please complete payment to confirm.
            </p>
        </div>
    );
}

function ReminderRow({ label, value }) {
    return (
        <div className="flex items-center justify-between">
            <span>{label}</span>
            <span className="font-medium text-slate-900">{value}</span>
        </div>
    );
}