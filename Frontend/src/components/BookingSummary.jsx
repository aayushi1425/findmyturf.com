export default function BookingSummary({ selectedSlots, price }) {
    if (selectedSlots.length === 0) return null;

    const start = selectedSlots[0].start_time;
    const end = selectedSlots[selectedSlots.length - 1].end_time;
    const hours = selectedSlots.length;
    const total = hours * price;

    return (
        <div className="mt-4 rounded-xl bg-slate-100 p-4 text-sm">
            <p>
                <span className="font-semibold">Time:</span>{" "}
                {start} – {end}
            </p>
            <p>
                <span className="font-semibold">Duration:</span>{" "}
                {hours} hour(s)
            </p>
            <p className="mt-1 font-semibold">
                Total: ₹{total}
            </p>
        </div>
    );
}