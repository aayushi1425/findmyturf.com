import { useEffect, useState } from "react";
import axios from "axios";

export default function useGeoLocation() {
    const [location, setLocation] = useState({
        lat: null,
        lon: null,
        city: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocation(prev => ({
                ...prev,
                loading: false,
                error: "Geolocation not supported",
            }));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                try {
                    const res = await axios.get(
                        "https://maps.googleapis.com/maps/api/geocode/json",
                        {
                            params: {
                                latlng: `${lat},${lon}`,
                                key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
                            },
                        }
                    );

                    const cityComponent = res.data.results[0]?.address_components.find(
                        c => c.types.includes("locality")
                    );

                    setLocation({
                        lat,
                        lon,
                        city: cityComponent?.long_name || null,
                        loading: false,
                        error: null,
                    });
                } catch (err) {
                    console.error("Google Geocode error:", err);
                    setLocation({
                        lat,
                        lon,
                        city: null,
                        loading: false,
                        error: "Failed to fetch city",
                    });
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                setLocation({
                    lat: null,
                    lon: null,
                    city: null,
                    loading: false,
                    error: error.message,
                });
            }
        );
    }, []);

    return location;
}
