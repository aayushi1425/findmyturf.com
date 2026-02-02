export default function TurfFilters({ filters, setFilters }) {
    return (
        <div className="flex flex-wrap gap-4">
            <input
                type="text"
                placeholder="City"
                value={filters.city}
                onChange={(e) =>
                    setFilters({ ...filters, city: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 sm:w-48"
            />

            <input
                type="number"
                placeholder="Min Price"
                value={filters.min_price}
                onChange={(e) =>
                    setFilters({ ...filters, min_price: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 sm:w-36"
            />

            <input
                type="number"
                placeholder="Max Price"
                value={filters.max_price}
                onChange={(e) =>
                    setFilters({ ...filters, max_price: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 sm:w-36"
            />

            <input
                type="number"
                placeholder="Radius (km)"
                value={filters.radius}
                onChange={(e) =>
                    setFilters({ ...filters, radius: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 sm:w-40"
            />
        </div>
    );
}
