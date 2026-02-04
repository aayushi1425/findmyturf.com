import { useMemo } from "react";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";

const defaultMapContainerStyle = {
    height: "300px",
    width: "100%",
    borderRadius: "0.75rem",
};

export default function TurfMap({
    latitude,
    longitude,
    turfName = "",
    mapContainerStyle = defaultMapContainerStyle,
    containerClassName = "",
    fallbackAddress = "",
}) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const hasCoords =
        latitude != null &&
        longitude != null &&
        !Number.isNaN(Number(latitude)) &&
        !Number.isNaN(Number(longitude));
    const lat = hasCoords ? Number(latitude) : null;
    const lng = hasCoords ? Number(longitude) : null;

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey || "",
    });

    const center = useMemo(
        () => (lat != null && lng != null ? { lat, lng } : { lat: 0, lng: 0 }),
        [lat, lng]
    );

    if (!hasCoords) {
        return (
            <div
                className={`flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 ${containerClassName}`}
                style={mapContainerStyle}
            >
                <div className="text-center">
                    <p className="text-sm">Map unavailable (no location set)</p>
                    {fallbackAddress && (
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                fallbackAddress
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block text-sm font-medium text-slate-900 underline"
                        >
                            Open in Google Maps
                        </a>
                    )}
                </div>
            </div>
        );
    }


    if (!isLoaded) {
        return (
            <div
                className={`flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 ${containerClassName}`}
                style={mapContainerStyle}
            >
                <p className="text-sm">Loading map…</p>
            </div>
        );
    }

    return (
        <div className={`overflow-hidden rounded-xl ${containerClassName}`}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                mapContainerClassName="w-full rounded-xl"
                center={center}
                zoom={14}
                options={{ disableDefaultUI: false, zoomControl: true }}
            >
                <Marker position={center} title={turfName || undefined} />
            </GoogleMap>
        </div>
    );
}
