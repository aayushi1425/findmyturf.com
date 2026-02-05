import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";
import SlotSelector from "../components/SlotSelector";
import BookingSummary from "../components/BookingSummary";

export default function TurfDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [turf, setTurf] = useState(null);
    const [courts, setCourts] = useState([]);
    const [selectedCourt, setSelectedCourt] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const [slots, setSlots] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [loading, setLoading] = useState(true);
    const [slotLoading, setSlotLoading] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);

    // Local-only rating UI (no backend mutation yet)
    const [rating, setRating] = useState(0);

    useEffect(() => {
        fetchTurf();
    }, []);

    useEffect(() => {
        if (selectedCourt) fetchSlots();
    }, [selectedDate, selectedCourt]);

    useEffect(() => {
        if (turf?.images?.length) {
            setActiveImageIndex(0);
        }
    }, [turf]);

    function getTurfImage(turf) {
        if (!turf?.images || turf.images.length === 0) {
            return "https://via.placeholder.com/400x250";
        }

        const defaultImg = turf.images.find(img => img.is_default);
        return defaultImg?.image_url || turf.images[0].image_url;
    }

    // ✅ OPEN / CLOSE CHECK (safer version)
    function isTurfOpenNow(turf) {
        if (!turf?.is_open && turf?.is_open !== "true") return false;
        if (!turf.opening_time || !turf.closing_time) return false;

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const [openH, openM] = turf.opening_time.split(":").map(Number);
        const [closeH, closeM] = turf.closing_time.split(":").map(Number);

        const openMinutes = openH * 60 + openM;
        const closeMinutes = closeH * 60 + closeM;

        return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
    }

    async function fetchTurf() {
        setLoading(true);
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
                toast.error(err.response?.data?.error || "Booking failed", {
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

    // Only show "not found" once we are sure loading is finished
    if (!loading && !turf) {
        return (
            <div className="flex min-h-screen items-center justify-center text-red-500">
                Turf not found
            </div>
        );
    }

    const openNow = isTurfOpenNow(turf);
    const images = turf?.images?.length
        ? turf.images
        : [{ image_url: getTurfImage(turf), is_default: true }];

    const activeImage = images[activeImageIndex]?.image_url || getTurfImage(turf);

    const handlePrevImage = () => {
        setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleNextImage = () => {
        setActiveImageIndex((prev) => (prev + 1) % images.length);
    };

    return (
            <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
                <div className="mx-auto max-w-6xl grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-5">
                        {loading ? (
                            <>
                                <div className="h-80 w-full overflow-hidden rounded-lg bg-slate-200 animate-pulse" />
                                <div className="space-y-3 rounded-lg bg-white/80 p-5 shadow-sm">
                                    <div className="h-5 w-1/2 rounded bg-slate-200 animate-pulse" />
                                    <div className="h-4 w-1/3 rounded bg-slate-200 animate-pulse" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="relative overflow-hidden rounded-lg bg-black/20">
                                    <img
                                        src={activeImage}
                                        alt={turf.name}
                                        className="h-80 w-full object-cover"
                                    />
                                    {images.length > 1 && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handlePrevImage}
                                                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-lg border border-white/20 shadow-xl hover:bg-white/20"
                                            >
                                                &lt;
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleNextImage}
                                                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-lg border border-white/20 shadow-xl hover:bg-white/20"
                                            >
                                                &gt;
                                            </button>
                                        </>
                                    )}
                                </div>

                                <div className="rounded-lg bg-white/10 p-5 shadow-xl backdrop-blur-lg border border-white/20">
                                    
                                    {/* ✅ Heading + Open Badge */}
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h1 className="text-2xl font-bold text-slate-900">
                                            {turf.name}
                                        </h1>

                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold
                                                ${openNow
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"}
                                            `}
                                        >
                                            {openNow ? "Open Now" : "Closed"}
                                        </span>
                                    </div>

                                    <p className="mt-2 text-slate-700">
                                        {turf.location}, {turf.city}, {turf.state}
                                    </p>

                                    <p className="mt-3 text-sm text-slate-700">
                                        Timings: {turf.opening_time} – {turf.closing_time}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* RIGHT */}
                    <div className="lg:sticky lg:top-8 h-fit">
                        <div className="rounded-lg bg-white/10 p-5 shadow-xl backdrop-blur-lg border border-white/20 space-y-5">
                            <h2 className="text-lg font-semibold text-white">Book a Court</h2>

                            {!openNow && (
                                <p className="text-sm text-red-600">
                                    Turf is currently closed for bookings
                                </p>
                            )}

                            {/* COURTS */}
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-slate-200">
                                    Select Court
                                </p>

                                {loading ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="h-10 rounded-lg bg-slate-200 animate-pulse" />
                                        <div className="h-10 rounded-lg bg-slate-200 animate-pulse" />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        {courts.map((court) => (
                                            <button
                                                key={court.id}
                                                onClick={() => setSelectedCourt(court)}
                                                className={`rounded-lg border px-3 py-2 text-sm font-medium transition duration-300 hover:scale-105
                                                ${selectedCourt?.id === court.id
                                                        ? "border-slate-900 bg-slate-900 text-white"
                                                        : "border-white/30 bg-white/80 text-slate-900 hover:border-slate-900"
                                                    }`}
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
                            {!loading && (
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full rounded-lg border border-white/20 bg-white/80 px-4 py-2 text-sm text-slate-900"
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
                                    <p className="text-sm text-red-200">No slots available</p>
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
                                className={`mt-2 w-full rounded-lg py-3 text-sm font-semibold transition
                                    ${selectedSlots.length > 0
                                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                        : "cursor-not-allowed bg-slate-200 text-slate-500"
                                    }`}
                            >
                                {bookingLoading ? "Booking..." : "Confirm Booking"}
                            </button>

                            {/* Rating UI – frontend only */}
                            <div className="mt-4 border-t border-white/20 pt-4">
                                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-200">
                                    Rate this turf
                                </p>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="text-xl"
                                        >
                                            <span className={star <= rating ? "text-emerald-500" : "text-slate-300"}>
                                                ★
                                            </span>
                                        </button>
                                    ))}
                                    <span className="text-xs text-slate-500">
                                        {rating ? `${rating}/5` : "Tap to rate"}
                                    </span>
                                </div>
                                {/* TODO: Backend support required
                                    Frontend ready to submit rating via API */}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
    );
}
