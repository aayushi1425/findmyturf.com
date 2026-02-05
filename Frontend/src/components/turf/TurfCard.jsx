import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge.jsx';

const TurfCard = ({ turf }) => (
    <Link to={`/turfs/${turf.id}`} className="flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
        {/* Image */}
        <div className="relative h-40 w-full overflow-hidden rounded-t-lg bg-slate-100 group">
            {turf.default_image ? (
                <img
                    src={turf.default_image}
                    alt={turf.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
            ) : (
                <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                    No image
                </div>
            )}
        </div>

        {/* Card Content */}

        <div className="flex flex-1 flex-col gap-2 p-4">
            <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-slate-900 truncate">
                    {turf.name}
                </h3>

                <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${turf.is_open
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                >
                    {turf.is_open ? "Open" : "Closed"}
                </span>
            </div>

            <p className="text-sm text-slate-600 line-clamp-2">{turf.description}

            </p>

            <div className="flex flex-wrap justify-between items-center text-xs text-slate-500">
                <span>
                    {turf.location} · {turf.city}, {turf.state}
                </span>
                {turf.distance_km && (
                    <span className="text-emerald-700 font-medium">{turf.distance_km.toFixed(1)} km away</span>
                )}


            </div>

            <div className="mt-auto text-sm font-semibold text-slate-900">
                {turf.courts?.length ? `From ₹${turf.courts[0].price}` : 'Pricing on detail'}
            </div>

        </div>
    </Link>
);

export default TurfCard;