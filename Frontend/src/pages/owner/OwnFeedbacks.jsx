import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api";

// Custom hook to parse query parameters
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function OwnerFeedbacks() {
    const query = useQuery();
    const tid = query.get("tid"); // Get tid from URL query params

    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Turf ID:", tid);
        if (!tid) return; // don't fetch if no tid

        const load = async () => {
            try {
                const { data } = await api.get(`feedback/turf/?tid=${tid}`);
                setFeedbacks(data);
            } catch (error) {
                console.error("Failed to load feedback:", error);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [tid]);

    if (loading) {
        return (
            <div className="p-6 text-center text-gray-500">
                Loading feedback...
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold text-slate-900">
                Customer Feedback
            </h1>

            {/* Empty state */}
            {!feedbacks.length && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
                    <div className="text-4xl mb-3">💬</div>
                    <p className="text-lg font-medium text-slate-700">
                        No feedback yet
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                        Customer reviews will appear here once users start rating your turfs.
                    </p>
                </div>
            )}

            {/* Feedback cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {feedbacks.map((fb) => (
                    <div
                        key={fb.id}
                        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-slate-900">{fb.turf_name}</h2>
                            <span className="text-amber-400 text-lg">
                                {"★".repeat(fb.rating)}
                                {"☆".repeat(5 - fb.rating)}
                            </span>
                        </div>

                        <p className="text-slate-600 mt-3 text-sm leading-relaxed">
                            {fb.comment}
                        </p>

                        <div className="text-xs text-slate-400 mt-4">
                            {new Date(fb.created_at).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}