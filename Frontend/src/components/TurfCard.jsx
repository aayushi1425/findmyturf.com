import { useNavigate } from "react-router-dom";

export default function TurfCard({ turf }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/turf/${turf.id}`)}
            className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
            <div className="relative h-48 w-full overflow-hidden">
                <img
                    src={turf.default_image || "https://via.placeholder.com/400x250"}
                    alt={turf.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Distance badge */}
                {turf.distance_km && (
                    <div className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
                        {turf.distance_km} km
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-900">
                    {turf.name}
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                    {turf.city}, {turf.state}
                </p>

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-base font-bold text-slate-900">
                        ₹{turf.price}
                        <span className="text-sm font-normal text-slate-600">
                            {" "}
                            / hour
                        </span>
                    </span>

                    <span className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition group-hover:bg-slate-800">
                        View
                    </span>
                </div>
            </div>
        </div>
    );
}