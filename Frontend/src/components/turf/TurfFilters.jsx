import React, { useEffect, useState } from 'react';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import Spinner from '../ui/Spinner.jsx';
import useGeoLocation from '../../hooks/useGeoLocation.js';

const TurfFilters = ({ onChange, initialFilters = {} }) => {
    const [filters, setFilters] = useState({
        city: initialFilters.city || '',
        min_price: initialFilters.min_price || '',
        max_price: initialFilters.max_price || '',
        radius: initialFilters.radius || 10,
        useLocation: Boolean(initialFilters.lat && initialFilters.lon),
    });

    const { position, loading: geoLoading } = useGeoLocation();

    useEffect(() => {
        if (filters.useLocation && position) {
            onChange({ ...filters, lat: position.lat, lon: position.lon });
        } else {
            onChange(filters);
        }
    }, [filters, position, onChange]);

    const handleInput = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="flex flex-wrap items-end gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <Input
                label="City"
                placeholder="Search by city"
                value={filters.city}
                onChange={(e) => handleInput('city', e.target.value)}
            />
            <Input
                label="Min price"
                type="number"
                value={filters.min_price}
                onChange={(e) => handleInput('min_price', e.target.value)}
            />
            <Input
                label="Max price"
                type="number"
                value={filters.max_price}
                onChange={(e) => handleInput('max_price', e.target.value)}
            />
            <Input
                label="Radius (km)"
                type="number"
                value={filters.radius}
                onChange={(e) => handleInput('radius', e.target.value)}
            />

            {/* Location toggle */}
            <div className="flex flex-col gap-2 text-sm text-slate-700">
                <span className="font-medium">Use my location</span>
                <Button
                    variant={filters.useLocation ? 'primary' : 'secondary'}
                    size="sm"
                    disabled={geoLoading}
                    onClick={() => handleInput('useLocation', !filters.useLocation)}
                    className="flex items-center gap-2"
                >
                    {geoLoading && <Spinner className="w-4 h-4 text-white" />}
                    {filters.useLocation ? 'Using location' : 'Enable location'}
                </Button>
            </div>

            {/* Apply button */}
            <div className="self-end">
                <Button size="sm" onClick={() => onChange(filters)}>
                    Apply
                </Button>
            </div>
        </div>
    );
};

export default TurfFilters;