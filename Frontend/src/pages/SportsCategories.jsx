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
    name: "Table Tennis",
    description: "Indoor tables with flexible slots",
    key: "TABLE_TENNIS",
    icon: "🏓",
  },
];

export default function SportsCategories() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <img
        src="https://images.pexels.com/photos/2570139/pexels-photo-2570139.jpeg?auto=compress&cs=tinysrgb&w=1600"
        alt="Sports turf"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/70 to-slate-950/80" />

      {/* CONTENT */}
      <div className="relative z-10 flex h-full items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl space-y-8">
          {/* HEADER */}
          <div className="text-center space-y-3">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-semibold text-white">
              Choose your sport
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-slate-300">
              Find the perfect turf for your next game
            </p>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categories.map((cat) => (
              <div
                key={cat.key}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 sm:p-6 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-white/20"
              >
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-emerald-500/15 text-2xl sm:text-3xl">
                  {cat.icon}
                </div>

                <h2 className="text-xs sm:text-sm font-semibold text-white">
                  {cat.name}
                </h2>

                <p className="text-[11px] sm:text-xs text-slate-300 line-clamp-2">
                  {cat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
