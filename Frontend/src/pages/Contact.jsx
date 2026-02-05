export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[3fr,2fr]">
        <div className="space-y-6 rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Contact us</h1>
          <p className="text-sm text-slate-600">
            Have questions about bookings, turfs or partnerships? Send us a
            message and we&apos;ll get back to you.
          </p>

          <form className="space-y-4">
            <div className="space-y-1 text-sm">
              <label className="font-medium text-slate-800">Name</label>
              <input
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-1 text-sm">
              <label className="font-medium text-slate-800">Email</label>
              <input
                type="email"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1 text-sm">
              <label className="font-medium text-slate-800">Message</label>
              <textarea
                rows={4}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Tell us how we can help"
              />
            </div>

            {/* TODO: Backend support required
                Frontend ready to submit contact form */}
            <button
              type="button"
              className="w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
            >
              Send message
            </button>
          </form>
        </div>

        <div className="space-y-4 rounded-3xl bg-slate-900 p-6 text-slate-50 shadow-md">
          <h2 className="text-lg font-semibold">Support &amp; partnerships</h2>
          <p className="text-sm text-slate-300">
            For urgent booking issues, reach out via WhatsApp or call. For
            business and turf onboarding, email our partnerships team.
          </p>

          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Email:</span>{" "}
              support@findmyturf.com
            </p>
            <p>
              <span className="font-medium">Phone:</span> +91-90000-00000
            </p>
            <p>
              <span className="font-medium">Hours:</span> 9:00 AM – 10:00 PM IST
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

