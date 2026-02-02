import { useEffect, useState } from "react";
import axios from "axios";

export default function useGeoLocation() {
    const [location, setLocation] = useState({
        lat: null,
        lon: null,
        city: null,
        loading: true,
    });

    useEffect(() => {
        async function fetchLocation() {
            try {
                const res = await axios.get("https://ipapi.co/json/");

                setLocation({
                    lat: res.data.latitude,
                    lon: res.data.longitude,
                    city: res.data.city,
                    loading: false,
                });
            } catch (err) {
                console.error("Geo error:", err);

                setLocation({
                    lat: null,
                    lon: null,
                    city: null,
                    loading: false,
                });
            }
        }

        fetchLocation();
    }, []);

    return location;
}