/**
 * Admissions screen — route: /{locale}/admissions
 *
 * Explains the admissions process step-by-step (numbered steps component)
 * and provides placeholder action buttons for:
 *   - "Contact Admissions / Enquire" → golf.cris.ac.th/contact (1E wires this)
 *   - "Request Info" → mailto:admission@cris.ac.th (1E wires this)
 *
 * Buttons are visually complete but non-wired (disabled / no-op) in 1D.
 * The §8 hand-off disclosure is wired in 1E.
 */

import { getDictionary } from "@/i18n/getDictionary";
import { isValidLocale } from "@/i18n/detectLocale";
import type { Locale } from "@/i18n/types";

interface AdmissionsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdmissionsPage({ params }: AdmissionsPageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const resolvedLocale: Locale = isValidLocale(locale) ? locale : "en";
  const dict = getDictionary(resolvedLocale);
  const d = dict.admissions;

  return (
    <main className="flex flex-col px-4 py-8 sm:px-6">
      {/* Page header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-sky-900 sm:text-3xl">
          {d.heading}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {d.lead}
        </p>
      </header>

      {/* Step-by-step process */}
      <section aria-labelledby="steps-heading" className="mb-8">
        <h2
          id="steps-heading"
          className="mb-4 text-base font-semibold text-slate-800"
        >
          {d.stepsHeading}
        </h2>

        <ol className="flex flex-col gap-4">
          {d.steps.map((step, index) => (
            <li key={index} className="flex gap-4">
              {/* Step number bubble */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-900 text-sm font-bold text-white">
                {index + 1}
              </div>

              {/* Step content */}
              <div className="min-w-0 pb-4 border-b border-slate-100 last:border-0">
                <p className="font-semibold text-slate-800">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Action buttons */}
      <section aria-labelledby="actions-heading">
        <h2
          id="actions-heading"
          className="mb-4 text-base font-semibold text-slate-800"
        >
          {d.actionsHeading}
        </h2>

        <div className="flex flex-col gap-3">
          {/*
           * 1E: wire this button to open golf.cris.ac.th/contact in the in-app
           * browser with the §8 hand-off disclosure shown first.
           * URL must come from config/links.ts (config-driven for easy swap to
           * the future full "Apply" form URL).
           */}
          <button
            type="button"
            disabled
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-900 px-5 py-3.5 text-sm font-semibold text-white opacity-70 cursor-not-allowed"
            aria-label={d.contactButton}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" x2="19" y1="8" y2="14" />
              <line x1="22" x2="16" y1="11" y2="11" />
            </svg>
            {d.contactButton}
          </button>

          {/*
           * 1E: wire this button to mailto:admission@cris.ac.th.
           * Keep as a <button> here so 1E can convert it to an <a href="mailto:...">
           * or use router.push without structural change.
           */}
          <button
            type="button"
            disabled
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 opacity-70 cursor-not-allowed"
            aria-label={d.requestInfoButton}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            {d.requestInfoButton}
          </button>
        </div>

        {/* Contextual note about the contact button destination */}
        <p className="mt-3 text-center text-xs text-slate-400">
          {d.contactButtonNote}
        </p>
      </section>
    </main>
  );
}
