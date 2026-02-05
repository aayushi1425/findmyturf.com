export default function SlotSelector({
    slots,
    selectedSlots,
    setSelectedSlots,
}) {
    function isAdjacent(prev, next) {
        return prev.end_time === next.start_time;
    }

    function handleSlotClick(slot) {
        // No slot selected → start new selection
        if (selectedSlots.length === 0) {
            setSelectedSlots([slot]);
            return;
        }

        const first = selectedSlots[0];
        const last = selectedSlots[selectedSlots.length - 1];

        // Clicking same slot again → reset
        if (
            selectedSlots.length === 1 &&
            first.start_time === slot.start_time
        ) {
            setSelectedSlots([]);
            return;
        }

        // Extend forward (continuous)
        if (isAdjacent(last, slot)) {
            setSelectedSlots([...selectedSlots, slot]);
            return;
        }

        // Extend backward (optional but feels premium)
        if (isAdjacent(slot, first)) {
            setSelectedSlots([slot, ...selectedSlots]);
            return;
        }

        // Non-continuous → reset selection
        setSelectedSlots([slot]);
    }

    function isSelected(slot) {
        return selectedSlots.some(
            (s) => s.start_time === slot.start_time
        );
    }

    return (
        <div>
            <p className="mb-2 text-xs font-medium text-slate-500">
                Select continuous time slots
            </p>

            <div className="grid grid-cols-2 gap-3">
                {slots.map((slot) => {
                    const selected = isSelected(slot);

                    return (
                        <button
                            key={`${slot.start_time}-${slot.end_time}`}
                            onClick={() => handleSlotClick(slot)}
                            className={`
                relative rounded-lg border px-3 py-2 text-sm font-medium transition duration-300 hover:scale-105
                ${selected
                                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                                    : "border-white/30 bg-white/80 text-slate-700 hover:border-slate-900"
                                }
              `}
                        >
                            {slot.start_time} – {slot.end_time}

                            {/* Selection indicator */}
                            {selected && (
                                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-400" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}