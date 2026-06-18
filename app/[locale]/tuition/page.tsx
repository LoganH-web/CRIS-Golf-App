/**
 * Tuition & Fees screen — route: /{locale}/tuition
 *
 * A native in-app screen (no link-out). Golf-specific fee figures come from
 * the school. Until figures are provided, shows a clear placeholder with a
 * fee table structure ready to receive real data.
 *
 * No payment, no external link (§2 Gate B). The "Contact Admissions" button
 * is visually complete but non-wired in 1D.
 *
 * Subphase 1D: layout + placeholder copy fully driven by dictionary keys.
 * Dropping in real fee figures = updating the dictionary "rows" array.
 */

import { getDictionary } from "@/i18n/getDictionary";
import { isValidLocale } from "@/i18n/detectLocale";
import { TuitionContactButton } from "@/components/screens/TuitionContactButton";
import type { Locale } from "@/i18n/types";

interface TuitionPageProps {
  params: Promise<{ locale: string }>;
}

export default async function TuitionPage({ params }: TuitionPageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const resolvedLocale: Locale = isValidLocale(locale) ? locale : "en";
  const dict = getDictionary(resolvedLocale);
  const d = dict.tuition;

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

      {/* Placeholder notice */}
      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
        <div className="flex gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-amber-600"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          <div>
            <p className="font-semibold text-amber-800">{d.placeholderHeading}</p>
            <p className="mt-1 text-sm text-amber-700">{d.placeholderBody}</p>
          </div>
        </div>
      </div>

      {/* Fee table — structure ready for real figures */}
      <section aria-label={d.heading} className="mb-6">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Table header */}
          <div className="grid grid-cols-4 gap-0 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
            <div className="px-3 py-3">{d.levelColumn}</div>
            <div className="px-3 py-3">{d.gradesColumn}</div>
            <div className="px-3 py-3">{d.termFeeColumn}</div>
            <div className="px-3 py-3">{d.annualFeeColumn}</div>
          </div>

          {/* Table rows */}
          {d.rows.map((row, index) => (
            <div
              key={index}
              className={`grid grid-cols-4 gap-0 border-b border-slate-100 text-sm last:border-0 ${
                index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
              }`}
            >
              <div className="px-3 py-3.5 font-medium text-slate-800">{row.level}</div>
              <div className="px-3 py-3.5 text-slate-600">{row.grades}</div>
              <div className="px-3 py-3.5 text-slate-500 italic">{row.termFee}</div>
              <div className="px-3 py-3.5 text-slate-500 italic">{row.annualFee}</div>
            </div>
          ))}
        </div>

        {/* Table footnote */}
        <p className="mt-2 text-xs text-slate-400">{d.tableNote}</p>
      </section>

      {/* Coming soon note */}
      <p className="mb-6 text-center text-sm text-slate-500">{d.feesComingSoon}</p>

      {/* Contact Admissions — wired in 1E via TuitionContactButton (client component) */}
      <TuitionContactButton dict={dict} />

      {/* Disclaimer */}
      <p className="mt-4 text-center text-xs text-slate-400">{d.disclaimer}</p>
    </main>
  );
}
