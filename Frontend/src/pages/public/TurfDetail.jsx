import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTurf } from '../../api/turf.api.js';
import { createBooking } from '../../api/booking.api.js';
import { listCourtsByTurf } from '../../api/court.api.js';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import TurfGallery from '../../components/turf/TurfGallery.jsx';
import SlotSelector from '../../components/booking/SlotSelector.jsx';
import useAuth from '../../hooks/useAuth.js';

const TurfDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [turf, setTurf] = useState(null);
    const [courts, setCourts] = useState([]);
    const [selectedCourt, setSelectedCourt] = useState('');
    const [date, setDate] = useState('');
    const [slot, setSlot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const [turfData, courtData] = await Promise.all([
                    getTurf(id),
                    listCourtsByTurf(id),
                ]);
                setTurf(turfData);
                setCourts(courtData);
                if (courtData.length) setSelectedCourt(courtData[0].id);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load turf details');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleBook = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/turfs/${id}` } });
            return;
        }
        if (!selectedCourt || !date || !slot) {
            setError('Please select court, date, and slot.');
            return;
        }

        setLoading(true);
        setError(null);
        setInfo(null);
        try {
            const payload = {
                court: selectedCourt,
                booking_date: date,
                start_time: `${slot.start_time}:00`,
                end_time: `${slot.end_time}:00`,
            };
            const booking = await createBooking(payload);
            setInfo('Booking created! Redirecting...');
            setTimeout(() => navigate(`/user/bookings/${booking.id}`), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to create booking');
        } finally {
            setLoading(false);
        }
    };

    const openInMaps = () => {
        if (!turf.latitude || !turf.longitude) return;

        window.open(
            `https://www.google.com/maps/search/?api=1&query=${turf.latitude},${turf.longitude}`,
            '_blank'
        );
    };

    const today = new Date().toISOString().split('T')[0];

    if (loading && !turf) return <p>Loading...</p>;
    if (error && !turf) return <p className="text-rose-600">{error}</p>;
    if (!turf) return null;


    return (
        <div className="space-y-6">
            {/* Turf Info */}
            <div className="flex items-start justify-between gap-3">
                {/* Left: Name + location */}
                <div className="min-w-0">
                    <h1 className="text-xl md:text-2xl font-bold leading-tight truncate">
                        {turf.name}
                    </h1>
                    <span className="text-xs text-slate-500 truncate">
                        {turf.location}
                    </span>
                </div>

                {/* Right: Map button */}
                <button
                    onClick={openInMaps}
                    disabled={!turf.latitude || !turf.longitude}
                    className="group shrink-0 inline-flex items-center gap-1.5 rounded-full border border-slate-200
                        px-3 py-1.5 text-xs font-medium
                        text-slate-700 bg-white
                        transition-all
                        hover:border-emerald-400 hover:text-emerald-700 hover:shadow-sm
                        active:scale-95
                        disabled:opacity-40 disabled:cursor-not-allowed
                    "
                    title="Open in Google Maps"
                >
                    <span className="text-sm">📍</span>
                    <span className="hidden sm:inline">See location</span>
                </button>
            </div>



            {/* MAIN LAYOUT */}
            <div className="grid gap-6 md:grid-cols-[2fr_1fr] items-start">

                {/* LEFT COLUMN */}
                <div className="space-y-6">
                    {/* Gallery */}
                    <TurfGallery images={turf.images || []} />

                    {/* Courts */}
                    <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Courts
                        </h2>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {courts.map((court) => (
                                <button
                                    key={court.id}
                                    type="button"
                                    aria-pressed={selectedCourt === court.id}
                                    onClick={() => setSelectedCourt(court.id)}
                                    className={`rounded-md border p-3 text-left text-sm transition hover:shadow-md ${selectedCourt === court.id
                                        ? 'border-emerald-500 bg-emerald-50'
                                        : 'border-slate-200 bg-white'
                                        }`}
                                >
                                    <div className="font-semibold">
                                        {court.sports_type}
                                    </div>
                                    <div className="text-slate-600">
                                        ₹{court.price}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {court.length} x {court.width} x {court.height}
                                    </div>
                                </button>
                            ))}

                            {!courts.length && (
                                <p className="text-sm text-slate-600">
                                    No courts found.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN – BOOKING */}
                <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:sticky md:top-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Book a slot
                    </h2>

                    <Input
                        type="date"
                        label="Choose date"
                        value={date}
                        min={today}
                        onChange={(e) => setDate(e.target.value)}
                    />

                    <SlotSelector
                        courtId={selectedCourt}
                        date={date}
                        onSelect={setSlot}
                    />

                    {!slot && date && (
                        <p className="text-sm text-slate-600">
                            No slots available for this date.
                        </p>
                    )}

                    {error && (
                        <p className="text-sm text-rose-600">{error}</p>
                    )}
                    {info && (
                        <p className="text-sm text-emerald-700">{info}</p>
                    )}

                    <Button
                        onClick={handleBook}
                        disabled={loading || !selectedCourt || !slot || !date}
                        className="w-full"
                    >
                        {loading ? 'Processing...' : 'Book now'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TurfDetail;
