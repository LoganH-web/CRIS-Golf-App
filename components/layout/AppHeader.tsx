/**
 * AppHeader — persistent top bar showing the app name and a language-switcher
 * placeholder slot. The placeholder is replaced by the real LanguageSwitcher
 * component in subphase 1C when i18n is wired up.
 *
 * Kept intentionally minimal for 1B; branding assets (logo) land in 1D.
 */

export function AppHeader(): React.ReactElement {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
      {/* App name / wordmark — logo image replaces this in 1D */}
      <span className="text-base font-semibold tracking-tight text-sky-900">
        CRIS Golf Program
      </span>

      {/*
       * Language-switcher placeholder slot.
       * This button element is intentionally non-functional in 1B.
       * Subphase 1C replaces it with the real <LanguageSwitcher /> component
       * that manages the EN / KO / ZH-Hans / TH selection.
       */}
      <button
        type="button"
        disabled
        aria-label="Language switcher — coming soon"
        className="flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-400 cursor-not-allowed select-none"
      >
        <span>EN</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </header>
  );
}
