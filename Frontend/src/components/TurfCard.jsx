import { useNavigate } from "react-router-dom";

export default function TurfCard({ turf }) {
    const navigate = useNavigate();

    /* ---------------- IMAGE ---------------- */
    function getTurfImage(turf) {
        if (!Array.isArray(turf?.images) || turf.images.length === 0) {
            return "https://via.placeholder.com/400x250?text=Turf";
        }

        const defaultImg = turf.images.find((img) => img.is_default);
        return defaultImg?.image_url || turf.images[0]?.image_url;
    }

    /* ---------------- OPEN / CLOSE (handles overnight) ---------------- */
    function isTurfOpenNow(turf) {
        if (!turf?.is_open || !turf.opening_time || !turf.closing_time) {
            return false;
        }

        const now = new Date();

        const [openH, openM] = turf.opening_time.split(":").map(Number);
        const [closeH, closeM] = turf.closing_time.split(":").map(Number);

        const openTime = new Date(now);
        openTime.setHours(openH, openM, 0, 0);

        const closeTime = new Date(now);
        closeTime.setHours(closeH, closeM, 0, 0);

        // Overnight case (e.g. 18:00 → 02:00)
        if (closeTime <= openTime) {
            return now >= openTime || now <= closeTime;
        }

        return now >= openTime && now <= closeTime;
    }

    const isOpenNow = isTurfOpenNow(turf);

    /* ---------------- PRICE ---------------- */
    const validPrices =
        turf.courts?.map((c) => c.price).filter((p) => typeof p === "number") || [];

    const displayPrice =
        turf.min_price ??
        (validPrices.length ? Math.min(...validPrices) : null);

    /* ---------------- RATINGS (safe fallbacks) ---------------- */
    const rating =
        turf.rating ??
        turf.avg_rating ??
        turf.average_rating ??
        null;

    const ratingText = rating ? Number(rating).toFixed(1) : null;

    /* ---------------- NAVIGATION ---------------- */
    const handleClick = () => {
        navigate(`/turf/${turf.slug || turf.id}`);
    };

    return (
        <div
            onClick={handleClick}
            className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition hover:scale-[1.02] hover:shadow-lg"
        >
            {/* IMAGE */}
            <div className="relative h-40 w-full overflow-hidden">
                <img
                    src={getTurfImage(turf)}
                    alt={turf.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {ratingText && (
                    <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
                        ★ {ratingText}
                    </div>
                )}

                {turf.distance_km !== undefined && (
                    <div className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
                        {Number(turf.distance_km).toFixed(1)} km
                    </div>
                )}
            </div>

            {/* CONTENT */}
            <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                        <h3 className="truncate text-base font-semibold text-slate-900">
                            {turf.name}
                        </h3>

                        <p className="text-xs text-slate-500">
                            {turf.city}, {turf.state}
                        </p>

                        {turf.opening_time && turf.closing_time && (
                            <p className="text-xs text-slate-500">
                                {turf.opening_time.slice(0, 5)} –{" "}
                                {turf.closing_time.slice(0, 5)}
                            </p>
                        )}
                    </div>

                    <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${isOpenNow
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-700 text-white"
                            }`}
                    >
                        {isOpenNow ? "Open" : "Closed"}
                    </span>
                </div>

                {displayPrice !== null && (
                    <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-slate-900">
                            ₹{displayPrice}
                            <span className="text-sm font-normal text-slate-600">
                                {" "} / hour
                            </span>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
