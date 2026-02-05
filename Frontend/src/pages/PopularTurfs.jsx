import TurfCard from "../components/TurfCard";
import { TurfCardShimmer, ListShimmerGrid } from "../components/Shimmers";

// UI-only page that can later be wired to a "popular turfs" API.
// For now it simply reuses the main listing grid styles.
export default function PopularTurfs() {
  const isLoading = false; // TODO: Backend support required. Frontend ready.

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Popular turfs
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Most visited and highly rated venues across the platform.
            </p>
          </div>
        </div>

        {isLoading ? (
          <ListShimmerGrid
            count={6}
            gapClassName="gap-7"
            renderItem={(index) => <TurfCardShimmer key={index} />}
          />
        ) : (
          <div className="rounded-lg bg-white/80 p-10 text-center text-sm text-slate-500 shadow-sm transition duration-300 hover:scale-105">
            {/* Placeholder until a dedicated backend endpoint is available */}
            <p>
              Popular turfs will appear here once analytics and ranking APIs are
              enabled.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

