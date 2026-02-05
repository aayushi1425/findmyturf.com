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
import locationIcon from '../../assets/location_icon.png';

const TurfDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [turf, setTurf] = useState(null);
    const [courts, setCourts] = useState([]);
    const [selectedCourt, setSelectedCourt] = useState('');
    const [date, setDate] = useState('');
    const [selectedSlots, setSelectedSlots] = useState([]);
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

    useEffect(() => {
        setSelectedSlots([]);
    }, [date, selectedCourt]);

    const handleBook = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/turfs/${id}` } });
            return;
        }
        if (!selectedCourt || !date || selectedSlots.length === 0) {
            setError('Please select court, date, and slots.');
            return;
        }

        setLoading(true);
        setError(null);
        setInfo(null);
        try {
            const payload = {
                court: selectedCourt,
                booking_date: date,
                start_time: `${selectedSlots[0].start_time}:00`,
                end_time: `${selectedSlots[selectedSlots.length - 1].end_time}:00`,
            };
            const booking = await createBooking(payload);
            setInfo('Booking created! Redirecting...');
            setTimeout(() => navigate(`/user/bookings/${booking.id}`), 1500);
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Unable to create booking');
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
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h1 className="text-xl md:text-2xl font-bold leading-tight truncate">
                        {turf.name}
                    </h1>
                    <span className="text-xs text-slate-500 truncate">
                        {turf.location}
                    </span>
                </div>

                <button
                    onClick={openInMaps}
                    disabled={!turf.latitude || !turf.longitude}
                    className="group shrink-0 inline-flex items-center gap-1.5 rounded-full border border-slate-200
                        px-3 py-1.5 text-xs font-medium
                        text-slate-700 bg-white
                        transition-all
                        hover:border-emerald-400 hover:text-emerald-700 hover:shadow-sm
                        active:scale-95
                        disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Open in Google Maps"
                >
                    <img src={locationIcon} alt="location" className="w-8 h-8" />
                    <span className="hidden sm:inline">See location</span>
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-[2fr_1fr] items-start">
                <div className="space-y-6">
                    <TurfGallery images={turf.images || []} />

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
                        selectedSlots={selectedSlots}
                        setSelectedSlots={setSelectedSlots}
                    />

                    {selectedSlots.length === 0 && date && (
                        <p className="text-sm text-slate-600">
                            Select your slot to Continue Booking.
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
                        disabled={loading || !selectedCourt || selectedSlots.length === 0 || !date}
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