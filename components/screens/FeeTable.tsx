"use client";

/**
 * FeeTable — the Tuition & Fees matrix with a currency toggle.
 *
 * Rows = itemized fee categories, columns = grade bands (G4–6 / G7–9 / G10–12).
 * The currency toggle defaults to the language's currency (localeDefaultCurrency)
 * but the user can switch freely. USD/KRW are the school's official figures;
 * CNY/THB are indicative conversions and surface the indicativeNote.
 *
 * Client component: only the currency selection is interactive state. The
 * figures themselves come from config/fees.ts (no network, §8-safe).
 */

import { useState } from "react";
import type { Locale } from "@/i18n/types";
import {
  FEE_CURRENCIES,
  FEE_CATEGORY_ORDER,
  feeGradeBands,
  feeAmount,
  formatFee,
  isOfficialCurrency,
  currencyLabels,
  type Currency,
  type FeeCategoryKey,
} from "@/config/fees";

interface FeeTableProps {
  locale: Locale;
  defaultCurrency: Currency;
  labels: {
    currencyLabel: string;
    itemizedHeader: string;
    categories: Record<FeeCategoryKey | "total", string>;
    notes: { golfProgram: string; dormitory: string };
    annualNote: string;
    indicativeNote: string;
  };
}

export function FeeTable({ locale, defaultCurrency, labels }: FeeTableProps): React.ReactElement {
  const [currency, setCurrency] = useState<Currency>(defaultCurrency);

  const noteFor = (key: FeeCategoryKey): string | null =>
    key === "golfProgram"
      ? labels.notes.golfProgram
      : key === "dormitory"
        ? labels.notes.dormitory
        : null;

  return (
    <section aria-label={labels.itemizedHeader}>
      {/* Currency toggle */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">{labels.currencyLabel}</span>
        <div role="group" aria-label={labels.currencyLabel} className="flex flex-wrap gap-1.5">
          {FEE_CURRENCIES.map((c) => {
            const active = c === currency;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                aria-pressed={active}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  active
                    ? "bg-cris-navy text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {currencyLabels[c]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fee matrix */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-cris-navy text-white">
              <th scope="col" className="px-3 py-2.5 text-left text-xs font-semibold">
                {labels.itemizedHeader}
              </th>
              {feeGradeBands.map((band) => (
                <th
                  key={band}
                  scope="col"
                  className="whitespace-nowrap px-3 py-2.5 text-right text-xs font-semibold"
                >
                  {band}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FEE_CATEGORY_ORDER.map((key, i) => {
              const note = noteFor(key);
              return (
                <tr key={key} className={i % 2 ? "bg-slate-50/60" : "bg-white"}>
                  <th scope="row" className="px-3 py-3 text-left font-medium text-slate-800">
                    {labels.categories[key]}
                    {note && (
                      <span className="mt-0.5 block text-[10px] font-normal leading-tight text-slate-400">
                        {note}
                      </span>
                    )}
                  </th>
                  {feeGradeBands.map((_, gi) => (
                    <td
                      key={gi}
                      className="whitespace-nowrap px-3 py-3 text-right tabular-nums text-slate-700"
                    >
                      {formatFee(feeAmount(key, gi, currency), currency, locale)}
                    </td>
                  ))}
                </tr>
              );
            })}

            {/* Grand total */}
            <tr className="border-t-2 border-cris-navy/20 bg-cris-navy/5 font-bold">
              <th scope="row" className="px-3 py-3 text-left text-cris-navy">
                {labels.categories.total}
              </th>
              {feeGradeBands.map((_, gi) => (
                <td
                  key={gi}
                  className="whitespace-nowrap px-3 py-3 text-right tabular-nums text-cris-navy"
                >
                  {formatFee(feeAmount("total", gi, currency), currency, locale)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Notes */}
      <p className="mt-2 text-xs text-slate-400">{labels.annualNote}</p>
      {!isOfficialCurrency(currency) && (
        <p className="mt-1 text-xs text-amber-600">{labels.indicativeNote}</p>
      )}
    </section>
  );
}
