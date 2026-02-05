import Button from '../ui/Button.jsx';
import Spinner from '../ui/Spinner.jsx';
import React, { useEffect, useState } from 'react';
import { getAvailableSlots } from '../../api/court.api.js';

const SlotSelector = ({ courtId, date, selectedSlots, setSelectedSlots }) => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            if (!courtId || !date) return;
            setLoading(true);
            setError(null);
            try {
                const data = await getAvailableSlots(courtId, date);
                setSlots(data.available_slots || []);
            }
            catch (err) {
                setError('Unable to load slots. Please try again.');
            }
            finally {
                setLoading(false);
            }
        };
        load();
    }, [courtId, date]);

    function isAdjacent(prev, next) {
        return prev.end_time === next.start_time;
    }

    function handleSlotClick(slot) {
        if (selectedSlots.length === 0) {
            setSelectedSlots([slot]);
            return;
        }

        const first = selectedSlots[0];
        const last = selectedSlots[selectedSlots.length - 1];

        if (
            selectedSlots.length === 1 &&
            first.start_time === slot.start_time
        ) {
            setSelectedSlots([]);
            return;
        }

        if (isAdjacent(last, slot)) {
            setSelectedSlots([...selectedSlots, slot]);
            return;
        }

        if (isAdjacent(slot, first)) {
            setSelectedSlots([slot, ...selectedSlots]);
            return;
        }

        setSelectedSlots([slot]);
    }

    function isSelected(slot) {
        return selectedSlots?.some(
            (s) => s.start_time === slot.start_time
        );
    }

    if (!courtId || !date) return null;

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">Available Slots</h3>
                {loading && <Spinner className="w-4 h-4 text-gray-400" />}
            </div>

            {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

            <div className="flex flex-wrap gap-2">
                {slots.length > 0 ? (
                    slots.map((slot) => {
                        const label = `${slot.start_time} - ${slot.end_time}`;
                        const selected = isSelected(slot);

                        return (
                            <Button
                                key={`${slot.start_time}-${slot.end_time}`}
                                variant={selected ? 'primary' : 'secondary'}
                                size="sm"
                                onClick={() => handleSlotClick(slot)}
                                className={`transition-colors duration-150 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                    selected ? 'ring-2 ring-indigo-500' : ''
                                }`}
                            >
                                {label}
                            </Button>
                        );
                    })
                ) : !loading ? (
                    <p className="text-xs text-gray-500">No slots available for this date.</p>
                ) : null}
            </div>
        </div>
    );
};

export default SlotSelector;
