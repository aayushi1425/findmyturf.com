import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cancelBooking, getBooking } from '../../api/booking.api.js';
import BookingSummary from '../../components/booking/BookingSummary.jsx';
import Button from '../../components/ui/Button.jsx';
import useRazorpayPayment from "../../hooks/useRazorpayPayment.jsx";

const BookingDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { payNow } = useRazorpayPayment();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);

    const loadBooking = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getBooking(id);
            setBooking(data);
        } catch {
            setError('Failed to load booking');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBooking();
    }, [id]);

    const handleCancel = async () => {
        setLoading(true);
        setError(null);
        try {
            await cancelBooking(id);
            setInfo('Booking cancelled');
            loadBooking();
        } catch {
            setError('Unable to cancel booking');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!booking) return;

        setLoading(true);
        setError(null);

        try {
            await payNow({
                booking,
                onSuccess: () => {
                    setInfo("Payment successful!");
                    // Optionally, refresh booking data
                    loadBooking();
                },
                onError: () => {
                    setError("Payment failed. Please try again.");
                },
            });
        } catch (err) {
            setError("Payment initialization failed");
        } finally {
            setLoading(false);
        }
    };



    if (loading && !booking) return <p>Loading...</p>;
    if (error && !booking) return <p className="text-rose-600">{error}</p>;
    if (!booking) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-slate-900">Booking detail</h1>
                <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
                    Back
                </Button>
            </div>
            <BookingSummary booking={booking} />
            {(booking.status != 'CANCELLED' && booking.status != 'CONFIRMED') && (
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={handleCancel} disabled={loading}>
                        Cancel booking
                    </Button>
                    <Button onClick={handlePayment} disabled={loading}>
                        {loading ? "Processing…" : "Pay now"}
                    </Button>
                </div>
            )}
            {error && <p className="text-sm text-rose-600">{error}</p>}
            {info && <p className="text-sm text-emerald-700">{info}</p>}
        </div>
    );
};

export default BookingDetail;