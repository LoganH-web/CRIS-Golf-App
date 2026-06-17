/**
 * ScreenStub — temporary placeholder used by every stub screen in 1B.
 * Subphase 1D replaces each stub with real content.
 */

interface ScreenStubProps {
  /** The screen heading shown to the user. */
  heading: string;
  /** One-line description of what this screen will contain. */
  description: string;
}

export function ScreenStub({ heading, description }: ScreenStubProps): React.ReactElement {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <h1 className="text-2xl font-bold tracking-tight text-sky-900 sm:text-3xl">
        {heading}
      </h1>
      <p className="mt-3 max-w-sm text-sm text-slate-500">{description}</p>
      <p className="mt-8 rounded-lg border border-amber-200 bg-amber-50 px-5 py-3 text-xs text-amber-700">
        Placeholder — real content arrives in subphase 1D.
      </p>
    </main>
  );
}
