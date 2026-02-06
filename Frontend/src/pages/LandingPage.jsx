import { useState, useEffect } from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import PageLayout from "../components/PageLayout";
import { ListShimmerGrid, TurfCardShimmer } from "../components/Shimmers";
import api from "../api";
import { toast } from "react-toastify";

export default function LandingPage() {
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [turfId, setTurfId] = useState("");
  const [sending, setSending] = useState(false);
  const [turfs, setTurfs] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadTurfs = async () => {
      try {
        const { data } = await api.get("/turf/list/");
        setTurfs(data.results || data);
      } catch (e) {
        console.error(e);
      }
    };
    loadTurfs();
  }, []);

  const submitFeedback = async (e) => {
    e.preventDefault();

    if (!turfId || !rating || !message) {
      toast.error("Please complete all fields");
      return;
    }

    try {
      setSending(true);

      await api.post("/feedback/create/", {
        turf: turfId,
        rating,
        message,
      });

      toast.success("Feedback submitted successfully");
      setOpen(false);
      setRating(0);
      setMessage("");
      setTurfId("");
    } catch {
      toast.error("Failed to submit feedback");
    } finally {
      setSending(false);
    }
  };

  return (
    <PageLayout>
      <Hero />
      <Features />

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:bg-emerald-700"
      >
        💬
      </button>

      {/* Feedback Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">

            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4">Share your feedback</h2>

            <form className="space-y-4" onSubmit={submitFeedback}>
              <select
                value={turfId}
                onChange={(e) => setTurfId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Turf</option>
                {turfs.map((turf) => (
                  <option key={turf.id} value={turf.id}>
                    {turf.name}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRating(r)}
                    className={`text-2xl ${
                      r <= rating ? "text-amber-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Write your experience..."
              />

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                {sending ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* <section className="mt-24 rounded-3xl border border-slate-200 bg-slate-50/50 px-6 py-14 sm:px-10">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
                <p className="mt-2 text-slate-600">Three steps to your next game.</p>
            </div>
            <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-3">
                {[
                    { step: '1', icon: HiLocationMarker, label: 'Choose your city', text: 'Browse turfs near you or filter by sport and price.' },
                    { step: '2', icon: HiCalendar, label: 'Pick a slot', text: 'View live availability and select date and time.' },
                    { step: '3', icon: HiCheckCircle, label: 'Pay & play', text: 'Confirm with secure payment and get instant booking details.' },
                ].map((item) => (
                    <div key={item.step} className="relative flex flex-col items-center text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-200 text-emerald-600 shadow-sm">
                            <item.icon className="w-7 h-7" />
                        </div>
                        <div className="mt-4 text-sm font-semibold text-emerald-600">Step {item.step}</div>
                        <h3 className="mt-1 text-lg font-semibold text-slate-900">{item.label}</h3>
                        <p className="mt-2 text-sm text-slate-600">{item.text}</p>
                        {item.step !== '3' && (
                            <div className="absolute left-[calc(50%+2rem)] top-7 hidden w-full sm:block">
                                <div className="h-0.5 w-full bg-slate-200" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section> */}

      <Footer />
    </PageLayout>
  );
}
