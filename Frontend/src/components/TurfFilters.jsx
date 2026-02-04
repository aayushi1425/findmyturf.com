export default function TurfFilters({ filters, setFilters }) {
    return (
        <div className="flex flex-wrap gap-4">
            <input
                type="text"
                placeholder="City/Area"
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
            {/* to add filter for category by sports serach */}
            <select
                value={filters.sports_type || ""}
                onChange={(e) =>
                    setFilters({ ...filters, sports_type: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 sm:w-48"
            >
                <option value="">All Sports</option>
                <option value="FOOTBALL">Football</option>
                <option value="CRICKET">Cricket</option>
                <option value="TENNIS">Tennis</option>
                <option value="BADMINTON">Badminton</option>
                {/* <option value="Basketball">Basketball</option> */}
                {/* <option value="Golf">Golf</option> */}
                {/* <option value="Table Tennis">Table Tennis</option> */}
                {/* <option value="Volleyball">Volleyball</option> */}
                {/* <option value="Athletics">Athletics</option> */}
                {/* <option value="Swimming">Swimming</option> */}
                {/* <option value="Hockey">Hockey</option> */}
                <option value="PICKLEBALL">Pickleball</option>
                {/* <option value="Handball">Handball</option> */}
            </select>
        </div>
    );
}