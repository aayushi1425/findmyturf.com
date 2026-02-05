export function TurfCardShimmer() {
  return (
    <div className="overflow-hidden rounded-lg bg-white/80 shadow-sm">
      <div className="relative h-48 w-full bg-slate-200 animate-pulse" />

      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded bg-slate-200 animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-slate-200 animate-pulse" />

        <div className="mt-3 flex items-center justify-between">
          <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
          <div className="h-8 w-24 rounded-lg bg-slate-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function CourtCardShimmer() {
  return (
    <div className="space-y-4 rounded-lg bg-white/80 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
        <div className="h-6 w-16 rounded-full bg-slate-200 animate-pulse" />
      </div>

      <div className="space-y-2 text-sm">
        <div className="h-3 w-32 rounded bg-slate-200 animate-pulse" />
        <div className="h-3 w-40 rounded bg-slate-200 animate-pulse" />
      </div>

      <div className="flex gap-3 pt-2">
        <div className="h-9 flex-1 rounded-lg bg-slate-200 animate-pulse" />
        <div className="h-9 flex-1 rounded-lg bg-slate-200 animate-pulse" />
      </div>
    </div>
  );
}

export function StatCardShimmer() {
  return (
    <div className="space-y-3 rounded-lg bg-white/80 p-4 shadow-sm">
      <div className="h-3 w-1/3 rounded bg-slate-200 animate-pulse" />
      <div className="h-6 w-1/2 rounded bg-slate-200 animate-pulse" />
      <div className="h-3 w-1/4 rounded bg-slate-200 animate-pulse" />
    </div>
  );
}

export function FormShimmer() {
  return (
    <div className="space-y-4 rounded-lg bg-white/80 p-6 shadow-sm">
      <div className="h-5 w-1/2 rounded bg-slate-200 animate-pulse" />
      <div className="space-y-2">
        <div className="h-9 rounded-lg bg-slate-200 animate-pulse" />
        <div className="h-9 rounded-lg bg-slate-200 animate-pulse" />
        <div className="h-9 rounded-lg bg-slate-200 animate-pulse" />
      </div>
      <div className="h-9 w-24 rounded-lg bg-slate-200 animate-pulse" />
    </div>
  );
}

export function ImageBlockShimmer() {
  return (
    <div className="h-64 w-full rounded-lg bg-slate-200 animate-pulse" />
  );
}

export function ListShimmerGrid({ count = 6, gapClassName = "gap-7", renderItem }) {
  const items = Array.from({ length: count });

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${gapClassName}`}>
      {items.map((_, index) => (
        <div key={index}>
          {renderItem ? renderItem(index) : null}
        </div>
      ))}
    </div>
  );
}

