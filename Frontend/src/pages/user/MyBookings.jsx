import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listMyBookings } from '../../api/booking.api.js';
import Badge from '../../components/ui/Badge.jsx';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await listMyBookings();
        setBookings(data);
      } catch {
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">My bookings</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-rose-600">{error}</p>}
      <div className="space-y-3">
        {bookings.map((b) => (
          <Link
            key={b.id}
            to={`/user/bookings/${b.id}`}
            className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-500"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">{b.turf_name || 'Turf booking'}</div>
              <Badge color="blue">{b.status}</Badge>
            </div>
            <div className="text-sm text-slate-700">
              {b.booking_date} · {b.start_time} - {b.end_time}
            </div>
            <div className="text-xs text-slate-500">₹{b.amount}</div>
          </Link>
        ))}
      </div>
      {!loading && !error && !bookings.length && (
        <p className="text-sm text-slate-600">No bookings yet. Find a turf to get started.</p>
      )}
    </div>
  );
};

export default MyBookings;
