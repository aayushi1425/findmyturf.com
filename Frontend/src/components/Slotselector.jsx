export default function SlotSelector({
    slots,
    selectedSlots,
    setSelectedSlots,
}) {
    function isAdjacent(prev, next) {
        return prev.end_time === next.start_time;
    }

    function handleSlotClick(slot) {
        // First selection
        if (selectedSlots.length === 0) {
            setSelectedSlots([slot]);
            return;
        }

        const lastSlot = selectedSlots[selectedSlots.length - 1];

        // Extend selection if continuous
        if (isAdjacent(lastSlot, slot)) {
            setSelectedSlots([...selectedSlots, slot]);
        } else {
            // Reset selection if not continuous
            setSelectedSlots([slot]);
        }
    }

    return (
        <div className="grid grid-cols-2 gap-3">
            {slots.map((slot) => {
                const isSelected = selectedSlots.some(
                    (s) => s.start_time === slot.start_time
                );

                return (
                    <button
                        key={`${slot.start_time}-${slot.end_time}`}
                        onClick={() => handleSlotClick(slot)}
                        className={`rounded-xl border px-3 py-2 text-sm transition
              ${isSelected
                                ? "border-slate-900 bg-slate-900 text-white"
                                : "border-slate-200 hover:border-slate-900"
                            }
            `}
                    >
                        {slot.start_time} – {slot.end_time}
                    </button>
                );
            })}
        </div>
    );
}
