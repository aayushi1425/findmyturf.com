export default function Contact() {
  return (
    <div className="min-h-screen bg-[url('https://images.pexels.com/photos/2570139/pexels-photo-2570139.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-fixed bg-cover bg-center bg-no-repeat">
      <div className="min-h-screen bg-slate-950/60 px-4 py-10 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[3fr,2fr]">
          <div className="space-y-5 rounded-xl bg-white/10 p-6 shadow-xl backdrop-blur-lg border border-white/20">
            <h1 className="text-2xl font-bold text-white">Contact us</h1>
            <p className="text-sm text-slate-200">
              Have questions about bookings, turfs or partnerships? Send us a
              message and we&apos;ll get back to you.
            </p>

            <form className="space-y-4">
              <div className="space-y-1 text-sm">
                <label className="font-medium text-slate-200">Name</label>
                <input
                  className="w-full rounded-lg border border-white/20 bg-white/80 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-1 text-sm">
                <label className="font-medium text-slate-200">Email</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-white/20 bg-white/80 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-1 text-sm">
                <label className="font-medium text-slate-200">Message</label>
                <textarea
                  rows={4}
                  className="w-full resize-none rounded-lg border border-white/20 bg-white/80 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Tell us how we can help"
                />
              </div>

              {/* TODO: Backend support required
                  Frontend ready to submit contact form */}
              <button
                type="button"
                className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
              >
                Send message
              </button>
            </form>
          </div>

          <div className="space-y-4 rounded-xl bg-slate-950/70 p-6 text-slate-50 shadow-md">
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
    </div>
  );
}
