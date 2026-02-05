export default function BookingSummary({ selectedSlots, price }) {
    if (!selectedSlots || selectedSlots.length === 0) return null;

    const startTime = selectedSlots[0].start_time;
    const endTime = selectedSlots[selectedSlots.length - 1].end_time;
    const hours = selectedSlots.length;
    const totalAmount = hours * price;

    return (
        <div className="mt-6 rounded-lg border border-slate-200 bg-white/80 p-5 shadow-sm transition duration-300 hover:scale-105">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
                Booking Summary
            </h3>

            <div className="space-y-2 text-sm text-slate-700">
                <div className="flex justify-between">
                    <span>Time Slot</span>
                    <span className="font-medium">
                        {startTime} – {endTime}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-medium">
                        {hours} {hours > 1 ? "hours" : "hour"}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span>Price / hour</span>
                    <span className="font-medium">₹{price}</span>
                </div>

                <div className="border-t pt-3 flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-900">
                        Total Payable
                    </span>
                    <span className="text-xl font-bold text-slate-900">
                        ₹{totalAmount}
                    </span>
                </div>
            </div>
        </div>
    );
}