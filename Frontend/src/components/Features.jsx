export default function Features() {
  const items = [
    {
      title: "Live Slot Availability",
      desc: "See real-time turf slots and avoid double booking.",
    },
    {
      title: "Instant Booking",
      desc: "Book your game slot in seconds with secure checkout.",
    },
    {
      title: "Nearby Turfs",
      desc: "Auto-detect location and show closest turfs first.",
    },
    {
      title: "Price Transparency",
      desc: "Compare prices across turfs easily.",
    },
    {
      title: "Business Dashboard",
      desc: "Turf owners manage slots & bookings easily.",
    },
    {
      title: "Smart Filters",
      desc: "Filter by city, price, and distance.",
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">
          <h3 className="text-3xl font-bold text-slate-900">
            Everything You Need to Book Turfs
          </h3>
          <p className="text-slate-600 mt-3">
            Built for players and turf owners both.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((f, i) => (
            <div
              key={i}
              className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition"
            >
              <h4 className="font-semibold text-lg text-slate-900 mb-2">
                {f.title}
              </h4>
              <p className="text-sm text-slate-600">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
