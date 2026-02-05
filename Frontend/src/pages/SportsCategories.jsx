const categories = [
  {
    name: "Football",
    description: "5v5, 7v7 and 11-a-side turfs",
    key: "FOOTBALL",
    icon: "⚽",
  },
  {
    name: "Cricket",
    description: "Box cricket, nets and full grounds",
    key: "CRICKET",
    icon: "🏏",
  },
  {
    name: "Badminton",
    description: "Indoor synthetic and wooden courts",
    key: "BADMINTON",
    icon: "🏸",
  },
  {
    name: "Tennis",
    description: "Clay, hard and synthetic courts",
    key: "TENNIS",
    icon: "🎾",
  },
  {
    name: "Pickleball",
    description: "Fast-paced paddle sport for all ages",
    key: "PICKLEBALL",
    icon: "🏓",
  },
  {
    name: "Basketball",
    description: "Full-court and half-court arenas",
    key: "BASKETBALL",
    icon: "🏀",
  },
  {
    name: "Volleyball",
    description: "Indoor and beach-style courts",
    key: "VOLLEYBALL",
    icon: "🏐",
  },
  {
    name: "Hockey",
    description: "Synthetic turf and practice zones",
    key: "HOCKEY",
    icon: "🏑",
  },
  {
    name: "Table Tennis",
    description: "Indoor tables with flexible slots",
    key: "TABLE_TENNIS",
    icon: "🏓",
  },
];

export default function SportsCategories() {
  return (
    <div className="min-h-screen bg-[url('https://images.pexels.com/photos/2570139/pexels-photo-2570139.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-fixed bg-cover bg-center bg-no-repeat">
      <div className="min-h-screen bg-slate-950/60 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-2 text-center text-white">
            <h1 className="text-3xl font-bold">Sports categories</h1>
            <p className="text-sm text-slate-200">
              Browse turfs by the sport you love. Filters on Explore page are
              already wired to these categories.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <div
                key={cat.key}
                className="flex flex-col justify-between rounded-lg bg-white/80 p-6 shadow-sm transition duration-300 hover:scale-105"
              >
                <div className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-xl text-emerald-700">
                    {cat.icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {cat.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {cat.description}
                    </p>
                  </div>
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
    </div>
  );
}

