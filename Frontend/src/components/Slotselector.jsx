export default function SlotSelector({slots , selectedSlots, setSelectedSlots}) {

    const toggleSlot = (slot) => {
        if (!slot.available) return;

        const exists = selectedSlots.find(
            (s) => s.start_time === slot.start_time
        );

        if (exists) {
            setSelectedSlots(selectedSlots.filter(
                (s) => s.start_time !== slot.start_time
            ));
        } else {
            setSelectedSlots([...selectedSlots, slot]);
        }
    };

    return (
        <div className="grid grid-cols-3 gap-2">
            {slots.map((slot, index) => {
                const isSelected = selectedSlots.some(
                    (s) => s.start_time === slot.start_time
                );

                const isUnavailable = !slot.available;

                return (
                    <button
                        key={index}
                        onClick={() => toggleSlot(slot)}
                        disabled={isUnavailable}
                        title={isUnavailable ? "Slot not available" : ""}
                        className={`
                            rounded-lg px-3 py-2 text-sm font-medium transition
                            
                            ${isUnavailable && `
                                bg-yellow-100 text-yellow-700
                                cursor-not-allowed opacity-70
                            `}

                            ${!isUnavailable && !isSelected && `
                                bg-white border border-slate-300
                                hover:border-emerald-500 hover:scale-105
                            `}

                            ${isSelected && `
                                bg-emerald-500 text-white
                            `}
                        `}
                    >
                        {slot.start_time} – {slot.end_time}
                    </button>
                );
            })}
        </div>
    );
}