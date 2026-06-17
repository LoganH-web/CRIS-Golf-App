// Subphase 1A placeholder — proves Tailwind is wired and the static export pipeline works.
// Subsequent subphases will replace this with the full Home / Entry screen.

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      {/* Brand mark — replaced with real logo in a later subphase */}
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-sky-900 text-white">
        <span className="text-2xl font-bold">CG</span>
      </div>

      {/* App name */}
      <h1 className="text-3xl font-bold tracking-tight text-sky-900 sm:text-4xl">
        CRIS Golf Program
      </h1>

      {/* Tagline */}
      <p className="mt-3 text-base text-slate-600 sm:text-lg">
        Chiang Rai International School &ndash; Golf Program
      </p>

      {/* Build-pipeline confirmation note — remove when real content lands */}
      <p className="mt-10 rounded-lg border border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-800">
        Scaffold placeholder &mdash; full app coming soon.
      </p>
    </main>
  );
}
