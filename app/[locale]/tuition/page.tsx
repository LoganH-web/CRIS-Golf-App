/**
 * Tuition & Fees screen — route: /{locale}/tuition
 *
 * A native in-app screen (no link-out, no payment — §2 Gate B). Shows the
 * school's annual fee matrix (categories × grade bands) with a currency toggle.
 *
 * Figures live in config/fees.ts: USD/KRW are official; CNY/THB are indicative
 * conversions. The currency defaults to the language's currency but the user
 * can switch (FeeTable, client component). The Contact Admissions button opens
 * the §8 hand-off; no data is collected here.
 */

import { getDictionary } from "@/i18n/getDictionary";
import { isValidLocale } from "@/i18n/detectLocale";
import { TuitionContactButton } from "@/components/screens/TuitionContactButton";
import { FeeTable } from "@/components/screens/FeeTable";
import { localeDefaultCurrency } from "@/config/fees";
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
        <h1 className="text-2xl font-bold tracking-tight text-cris-navy sm:text-3xl">
          {d.heading}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {d.lead}
        </p>
      </header>

      {/* Fee matrix + currency toggle */}
      <div className="mb-6">
        <FeeTable
          locale={resolvedLocale}
          defaultCurrency={localeDefaultCurrency[resolvedLocale]}
          labels={{
            currencyLabel: d.currencyLabel,
            itemizedHeader: d.itemizedHeader,
            categories: d.categories,
            notes: d.notes,
            annualNote: d.annualNote,
            indicativeNote: d.indicativeNote,
          }}
        />
      </div>

      {/* Contact Admissions — §8 hand-off (client component) */}
      <TuitionContactButton dict={dict} />

      {/* Disclaimer */}
      <p className="mt-4 text-center text-xs text-slate-400">{d.disclaimer}</p>
    </main>
  );
}
