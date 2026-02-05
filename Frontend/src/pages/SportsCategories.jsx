const categories = [
  { name: "Football", description: "5v5, 7v7 and 11-a-side turfs", key: "FOOTBALL" },
  { name: "Cricket", description: "Box cricket, nets and full grounds", key: "CRICKET" },
  { name: "Tennis", description: "Clay, hard and synthetic courts", key: "TENNIS" },
  { name: "Badminton", description: "Indoor synthetic and wooden courts", key: "BADMINTON" },
  { name: "Pickleball", description: "Emerging fast-paced paddle sport", key: "PICKLEBALL" },
];

export default function SportsCategories() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">
            Sports categories
          </h1>
          <p className="text-sm text-slate-600">
            Browse turfs by the sport you love. Filters on Explore page are
            already wired to these categories.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.key}
              className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-slate-900">
                  {cat.name}
                </h2>
                <p className="text-sm text-slate-600">{cat.description}</p>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>Filter: {cat.key}</span>
                {/* TODO: Backend support required for category-specific landing pages
                    Frontend ready – use existing /turf/list/ filters. */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

