import { useNavigate } from "react-router-dom";

export default function TurfCard({ turf }) {
    const navigate = useNavigate();

    function getTurfImage(turf) {
        if (!turf?.images || turf.images.length === 0) {
            return "https://via.placeholder.com/400x250";
        }
        const defaultImg = turf.images.find(img => img.is_default);
        return defaultImg?.image_url || turf.images[0].image_url;
    }

    // TIME BASED OPEN / CLOSE
    function isTurfOpenNow(turf) {
        if (!turf.is_open) return false;
        if (!turf.opening_time || !turf.closing_time) return false;

        const now = new Date();
        const [openH, openM] = turf.opening_time.split(":").map(Number);
        const [closeH, closeM] = turf.closing_time.split(":").map(Number);

        const openTime = new Date();
        openTime.setHours(openH, openM, 0, 0);

        const closeTime = new Date();
        closeTime.setHours(closeH, closeM, 0, 0);

        return now >= openTime && now <= closeTime;
    }

    const isOpenNow = isTurfOpenNow(turf);

    const displayPrice =
        turf.min_price ??
        (turf.courts?.length
            ? Math.min(...turf.courts.map(c => c.price))
            : null);

    // ⭐ Ratings – UI only, backend-safe
    const rating =
        turf.rating ??
        turf.avg_rating ??
        turf.average_rating ??
        4.5; // fallback mock for now
    const ratingText = rating ? Number(rating).toFixed(1) : null;

    return (
        <div
            onClick={() => navigate(`/turf/${turf.id}`)}
            className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
            {/* IMAGE */}
            <div className="relative h-48 w-full overflow-hidden">
                <img
                    src={getTurfImage(turf)}
                    alt={turf.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {turf.distance_km && (
                    <div className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
                        {turf.distance_km} km
                    </div>
                )}
            </div>

            {/* CONTENT */}
            <div className="space-y-2 p-4">
                {/* NAME + STATUS */}
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                        <h3 className="truncate text-lg font-semibold text-slate-900">
                            {turf.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                            {turf.city}, {turf.state}
                        </p>
                        <p className="text-xs text-slate-500">
                            {turf.opening_time?.slice(0, 5)} – {turf.closing_time?.slice(0, 5)}
                        </p>

                        {/* Rating badge */}
                        {ratingText && (
                            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                                <span>★</span>
                                <span>{ratingText}</span>
                                <span className="text-slate-400">
                                    {/* TODO: Backend support required
                                        Frontend ready to show rating count once available */}
                                </span>
                            </div>
                        )}
                    </div>

                    <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                            isOpenNow
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-800 text-white"
                        }`}
                    >
                        {isOpenNow ? "Open" : "Closed"}
                    </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                    {displayPrice !== null && (
                        <span className="text-base font-bold text-slate-900">
                            ₹{displayPrice}
                            <span className="text-sm font-normal text-slate-600">
                                {" "} / hour
                            </span>
                        </span>
                    )}
                    <span className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-medium text-white shadow-sm group-hover:bg-emerald-600">
                        View Courts
                    </span>
                </div>
            </div>
        </div>
    );
}
