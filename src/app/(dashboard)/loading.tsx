// Mirrors the dashboard layout: heading, four stat cards, one table panel. Kept in
// step with the real page so the transition does not visibly reflow.
export default function Loading() {
  return (
    <main aria-busy="true" aria-live="polite" className="mx-auto w-full max-w-7xl p-5 sm:p-7">
      <span className="sr-only">Loading</span>
      <div className="animate-pulse">
        <div className="h-4 w-28 rounded bg-muted" />
        <div className="mt-3 h-8 w-72 rounded bg-muted" />
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-32 rounded-2xl bg-muted" />)}
        </div>
        <div className="mt-7 h-80 rounded-2xl bg-muted" />
      </div>
    </main>
  );
}
