/**
 * Admissions screen — route: /{locale}/admissions
 *
 * Explains the admissions process step-by-step (numbered steps component)
 * and provides wired action buttons (wired in 1E):
 *   - "Contact Admissions / Enquire" → §8 HandOffModal → golf.cris.ac.th/contact
 *   - "Request Info" → mailto:admission@cris.ac.th (no modal needed for mailto)
 *
 * The interactive section is extracted to <AdmissionsActions> (client component)
 * so this page remains a server component (better for static export / SEO).
 */

import { getDictionary } from "@/i18n/getDictionary";
import { isValidLocale } from "@/i18n/detectLocale";
import { AdmissionsActions } from "@/components/screens/AdmissionsActions";
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

      {/* Action buttons — wired in 1E via AdmissionsActions (client component) */}
      <section aria-labelledby="actions-heading">
        <h2
          id="actions-heading"
          className="mb-4 text-base font-semibold text-slate-800"
        >
          {d.actionsHeading}
        </h2>

        <AdmissionsActions dict={dict} />

        {/* Contextual note about the contact button destination */}
        <p className="mt-3 text-center text-xs text-slate-400">
          {d.contactButtonNote}
        </p>
      </section>
    </main>
  );
}
