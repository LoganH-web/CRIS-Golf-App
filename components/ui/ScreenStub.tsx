/**
 * ScreenStub — temporary placeholder used by every stub screen in 1B/1C.
 *
 * Updated in subphase 1C: heading, description, and notice text come from
 * the dictionary (passed as props) rather than hardcoded English strings.
 * Subphase 1D replaces each stub with real content.
 */

interface ScreenStubProps {
  /** The screen heading shown to the user (translated). */
  heading: string;
  /** One-line description of what this screen will contain (translated). */
  description: string;
  /** Stub notice text (translated). */
  stubNotice: string;
}

export function ScreenStub({ heading, description, stubNotice }: ScreenStubProps): React.ReactElement {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <h1 className="text-2xl font-bold tracking-tight text-cris-navy sm:text-3xl">
        {heading}
      </h1>
      <p className="mt-3 max-w-sm text-sm text-slate-500">{description}</p>
      <p className="mt-8 rounded-lg border border-amber-200 bg-amber-50 px-5 py-3 text-xs text-amber-700">
        {stubNotice}
      </p>
    </main>
  );
}
