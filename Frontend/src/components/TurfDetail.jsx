import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";
import SlotSelector from "../components/SlotSelector";
import BookingSummary from "../components/BookingSummary";
import PageLayout from "./PageLayout";

export default function TurfDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [turf, setTurf] = useState(null);
    const [courts, setCourts] = useState([]);
    const [selectedCourt, setSelectedCourt] = useState(null);

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
        if (selectedCourt) fetchSlots();
    }, [selectedDate, selectedCourt]);

    function getTurfImage(turf) {
        if (!turf?.images || turf.images.length === 0) {
            return "https://via.placeholder.com/400x250";
        }

        const defaultImg = turf.images.find(img => img.is_default);
        return defaultImg?.image_url || turf.images[0].image_url;
    }


    async function fetchTurf() {
        try {
            const turfRes = await api.get(`/turf/${id}/`);
            setTurf(turfRes.data);

            const courtsRes = await api.get(`/turf/${id}/courts/`);
            setCourts(courtsRes.data);
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
                `/court/${selectedCourt.id}/available-slots/`,
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
        if (!selectedCourt || selectedSlots.length === 0) return;

        setBookingLoading(true);

        try {
            const res = await api.post("/booking/create/", {
                court: selectedCourt.id,
                booking_date: selectedDate,
                start_time: selectedSlots[0].start_time,
                end_time: selectedSlots[selectedSlots.length - 1].end_time,
            });

            navigate(`/booking/${res.data.id}`);
        }
        catch (err) {
            if (err.response?.status === 401) {
                navigate("/login");
            }
            else {
                toast.error(err.response.data.error, {
                    style: {
                        width: "auto",
                        whiteSpace: "pre-wrap",
                    },
                });
            }
        }
        finally {
            setBookingLoading(false);
        }
    }

    if (!turf) {
        return (
            <div className="flex min-h-screen items-center justify-center text-red-500">
                Turf not found
            </div>
        );
    }

    return (
        <PageLayout>
        <div className="min-h-screen px-6 py-10">
            <div className="mx-auto max-w-6xl grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* LEFT */}
                <div className="lg:col-span-2 space-y-6">
                    {loading ? (
                        <>
                            <div className="h-80 w-full overflow-hidden rounded-2xl bg-slate-200 animate-pulse" />
                            <div className="space-y-3 rounded-2xl bg-white p-6 shadow-sm">
                                <div className="h-5 w-1/2 rounded bg-slate-200 animate-pulse" />
                                <div className="h-4 w-1/3 rounded bg-slate-200 animate-pulse" />
                                <div className="mt-2 h-3 w-1/4 rounded bg-slate-200 animate-pulse" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                                <img
                                    src={getTurfImage(turf)}
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

                                <p className="mt-4 text-sm text-slate-700">
                                    Timings: {turf.opening_time} – {turf.closing_time}
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* RIGHT */}
                <div className="lg:sticky lg:top-8 h-fit">
                    <div className="rounded-2xl bg-white p-6 shadow-md space-y-5">
                        <h2 className="text-lg font-semibold">Book a Court</h2>

                        {/* COURT SELECT */}
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-slate-700">
                                Select Court
                            </p>

                            {loading ? (
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="h-10 rounded-xl bg-slate-200 animate-pulse" />
                                    <div className="h-10 rounded-xl bg-slate-200 animate-pulse" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    {courts.map((court) => (
                                        <button
                                            key={court.id}
                                            onClick={() => setSelectedCourt(court)}
                                            className={`rounded-xl border px-3 py-2 text-sm font-medium transition
                      ${selectedCourt?.id === court.id
                                                ? "border-slate-900 bg-slate-900 text-white"
                                                : "border-slate-200 hover:border-slate-900"
                                            }
                    `}
                                        >
                                            {court.sports_type}
                                            <div className="text-xs opacity-80">
                                                ₹{court.price}/hr
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* DATE */}
                        {loading ? (
                            <div className="h-10 w-full rounded-xl bg-slate-200 animate-pulse" />
                        ) : (
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
                            />
                        )}

                        {/* SLOTS */}
                        {!loading && selectedCourt && (
                            slotLoading ? (
                                <div className="space-y-2">
                                    <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
                                    <div className="h-10 rounded-xl bg-slate-200 animate-pulse" />
                                </div>
                            ) : slots.length === 0 ? (
                                <p className="text-sm text-red-500">No slots available</p>
                            ) : (
                                <>
                                    <SlotSelector
                                        slots={slots}
                                        selectedSlots={selectedSlots}
                                        setSelectedSlots={setSelectedSlots}
                                    />

                                    <BookingSummary
                                        selectedSlots={selectedSlots}
                                        price={selectedCourt.price}
                                    />
                                </>
                            )
                        )}

                        <button
                            disabled={
                                loading ||
                                !selectedCourt ||
                                selectedSlots.length === 0 ||
                                bookingLoading
                            }
                            onClick={handleBooking}
                            className={`mt-2 w-full rounded-xl py-3 text-sm font-semibold transition
                ${selectedSlots.length > 0
                                    ? "bg-slate-900 text-white hover:bg-slate-800"
                                    : "cursor-not-allowed bg-slate-200 text-slate-500"
                                }
              `}
                        >
                            {bookingLoading ? "Booking..." : "Confirm Booking"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </PageLayout>
    );
}