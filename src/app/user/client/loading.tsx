export default function Loading() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <div className="h-7 w-64 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded-xl bg-slate-200" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton list is static.
            key={i}
            className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white"
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        <div className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white" />
      </div>
    </section>
  );
}
