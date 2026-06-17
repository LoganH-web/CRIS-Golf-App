/**
 * Home / Entry screen — route: /
 *
 * The branded landing screen opened when a visitor scans the QR code.
 * In subphase 1B this is a styled stub. Real brand assets and copy land in 1D.
 * The language-picker UI lands in 1C.
 */

export default function HomePage(): React.ReactElement {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      {/* Brand mark — replaced with real logo in subphase 1D */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sky-900 text-white">
        <span className="text-2xl font-bold" aria-hidden="true">
          CG
        </span>
      </div>

      {/* App name */}
      <h1 className="text-3xl font-bold tracking-tight text-sky-900 sm:text-4xl">
        CRIS Golf Program
      </h1>

      {/* Tagline */}
      <p className="mt-2 text-sm text-slate-500 sm:text-base">
        Chiang Rai International School &ndash; Golf Program
      </p>

      {/*
       * Language-picker placeholder — functional language switcher lands in 1C.
       * The real picker will offer EN / KO / ZH-Hans / TH.
       */}
      <p className="mt-8 text-xs text-slate-400">
        Language selection coming in subphase 1C.
      </p>

      {/* 1B scaffold notice — remove when real content lands in 1D */}
      <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-5 py-3 text-xs text-amber-700">
        App shell and routing — full content arrives in subphase 1D.
      </p>
    </main>
  );
}
