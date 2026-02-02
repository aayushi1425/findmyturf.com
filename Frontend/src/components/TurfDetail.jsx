import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../config/api";
import SlotSelector from "../components/SlotSelector";
import BookingSummary from "../components/BookingSummary";

export default function TurfDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [turf, setTurf] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [loading, setLoading] = useState(true);
    const [slotLoading, setSlotLoading] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        fetchTurf();
    }, []);

    useEffect(() => {
        if (turf) fetchSlots();
    }, [selectedDate, turf]);

    async function fetchTurf() {
        try {
            const res = await api.get(`/turf/${id}/`);
            setTurf(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function fetchSlots() {
        setSlotLoading(true);
        setSelectedSlots([]);

        try {
            const res = await api.get(
                `/turf/${id}/available-slots/`,
                { params: { date: selectedDate } }
            );

            setSlots(res.data.available_slots || []);
        } catch (err) {
            console.error("Slot fetch error:", err);
        } finally {
            setSlotLoading(false);
        }
    }

    async function handleBooking() {
        if (selectedSlots.length === 0) return;

        setBookingLoading(true);

        try {
            const res = await api.post("/booking/create/", {
                turf: turf.id,
                booking_date: selectedDate,
                start_time: selectedSlots[0].start_time,
                end_time: selectedSlots[selectedSlots.length - 1].end_time,
            });

            // ✅ success → go to booking detail
            navigate(`/booking/${res.data.id}`);
        } catch (err) {
            if (err.response?.status === 401) {
                navigate("/login");
            } else {
                alert("Slot already booked or unavailable");
            }
        } finally {
            setBookingLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center text-slate-500">
                Loading turf details...
            </div>
        );
    }

    if (!turf) {
        return (
            <div className="flex min-h-screen items-center justify-center text-red-500">
                Turf not found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="mx-auto max-w-6xl grid grid-cols-1 gap-8 lg:grid-cols-3">

                {/* LEFT */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                        <img
                            src={turf.default_image || "https://via.placeholder.com/800x400"}
                            alt={turf.name}
                            className="h-80 w-full object-cover"
                        />
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h1 className="text-2xl font-bold text-slate-900">
                            {turf.name}
                        </h1>

                        <p className="mt-1 text-slate-600">
                            {turf.location}, {turf.city}, {turf.state}
                        </p>

                        <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-700">
                            <div>
                                <span className="font-semibold">Price</span>
                                <p>₹{turf.price}/hour</p>
                            </div>
                            <div>
                                <span className="font-semibold">Timings</span>
                                <p>
                                    {turf.opening_time} – {turf.closing_time}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT – BOOKING */}
                <div className="lg:sticky lg:top-8 h-fit">
                    <div className="rounded-2xl bg-white p-6 shadow-md">

                        <div className="mb-6">
                            <p className="text-sm text-slate-500">Price per hour</p>
                            <p className="text-3xl font-bold text-slate-900">
                                ₹{turf.price}
                            </p>
                        </div>

                        <h2 className="mb-4 text-lg font-semibold">
                            Book a Slot
                        </h2>

                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                        />

                        {slotLoading ? (
                            <p className="text-sm text-slate-500">
                                Loading slots...
                            </p>
                        ) : slots.length === 0 ? (
                            <p className="text-sm text-red-500">
                                No slots available
                            </p>
                        ) : (
                            <>
                                <SlotSelector
                                    slots={slots}
                                    selectedSlots={selectedSlots}
                                    setSelectedSlots={setSelectedSlots}
                                />

                                <BookingSummary
                                    selectedSlots={selectedSlots}
                                    price={turf.price}
                                />
                            </>
                        )}

                        <button
                            disabled={selectedSlots.length === 0 || bookingLoading}
                            onClick={handleBooking}
                            className={`mt-6 w-full rounded-xl py-3 text-sm font-semibold transition
                ${selectedSlots.length > 0
                                    ? "bg-slate-900 text-white hover:bg-slate-800"
                                    : "cursor-not-allowed bg-slate-200 text-slate-500"
                                }
              `}
                        >
                            {bookingLoading ? "Booking..." : "Book Slot"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}