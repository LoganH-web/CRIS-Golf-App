/**
 * config/fees.ts — Annual tuition & fee figures for the CRIS Golf Program.
 *
 * SINGLE SOURCE OF TRUTH for the numbers shown on the Tuition & Fees screen.
 *
 * Currency policy (confirmed with the school):
 *   - USD and KRW are the school's OFFICIAL figures, stored verbatim from the
 *     two fee tables they provided (do not recompute these).
 *   - CNY and THB have no official table, so they are DERIVED from the USD
 *     figures at a fixed indicative rate (see `indicativeRates`). The Tuition
 *     screen shows a clear "indicative — contact admissions for exact figures"
 *     note whenever a derived currency is selected.
 *
 * Why fixed rates (not a live FX API): the app is offline-first and makes no
 * third-party network calls (§8). Live rates would break both. The figures are
 * fees, not a converter — an indicative number plus a "contact admissions"
 * hand-off is the honest, compliant choice.
 *
 * To update: replace the official USD/KRW arrays below when the school issues
 * new figures; adjust `indicativeRates` if the reference rate should change.
 */

import type { Locale } from "@/i18n/types";

export type Currency = "USD" | "KRW" | "CNY" | "THB";

/** All selectable currencies, in toggle order. */
export const feeCurrencies: Currency[] = ["USD", "KRW", "CNY", "THB"];

/** Currency shown by default for each language (user can switch manually). */
export const localeDefaultCurrency: Record<Locale, Currency> = {
  en: "USD",
  ko: "KRW",
  zh: "CNY",
  th: "THB",
};

/** Symbol + code label for the currency toggle. */
export const currencyLabels: Record<Currency, string> = {
  USD: "USD $",
  KRW: "KRW ₩",
  CNY: "CNY ¥",
  THB: "THB ฿",
};

/** Grade-band column headers — language-neutral (just grade ranges). */
export const feeGradeBands = ["G4–6", "G7–9", "G10–12"] as const;

export type FeeCategoryKey = "tuition" | "golfProgram" | "golfLesson" | "dormitory";

/** Display order of the itemized fee rows. */
export const feeCategoryOrder: FeeCategoryKey[] = [
  "tuition",
  "golfProgram",
  "golfLesson",
  "dormitory",
];

/** Per-grade figures, one amount per grade band: [G4–6, G7–9, G10–12]. */
type GradeBandAmounts = readonly [number, number, number];
interface OfficialRow {
  usd: GradeBandAmounts;
  krw: GradeBandAmounts;
}

/**
 * Official figures, verbatim from the school's USD and KRW fee tables.
 * (KRW columns sum exactly to the official totals below.)
 */
const officialFeeRows: Record<FeeCategoryKey, OfficialRow> = {
  tuition: { usd: [8066, 9184, 10053], krw: [12130700, 13813300, 15119900] },
  golfProgram: { usd: [14676, 16877, 19408], krw: [22072610, 25382350, 29189880] },
  golfLesson: { usd: [4688, 5313, 6250], krw: [7050000, 7990000, 9400000] },
  dormitory: { usd: [9947, 11535, 12688], krw: [14960100, 17348640, 19082940] },
};

/** Official totals, verbatim (do not sum the rows — USD has ±1 rounding). */
const officialFeeTotals: OfficialRow = {
  usd: [37376, 42908, 48399],
  krw: [56213410, 64534290, 72792720],
};

/**
 * Indicative USD→currency rates for currencies WITHOUT an official table.
 * USD and KRW never use these (they're shown verbatim). Update if the school
 * wants a different reference rate. Reference: mid-2026 approximate rates.
 */
export const indicativeRates: Record<"CNY" | "THB", number> = {
  CNY: 7.2,
  THB: 33,
};

/** USD and KRW are official figures; CNY and THB are indicative conversions. */
export function isOfficialCurrency(currency: Currency): boolean {
  return currency === "USD" || currency === "KRW";
}

/**
 * The fee amount for a category (or the grand total) at a grade index, in the
 * given currency. Official for USD/KRW; derived from USD for CNY/THB.
 */
export function feeAmount(
  categoryOrTotal: FeeCategoryKey | "total",
  gradeIndex: number,
  currency: Currency,
): number {
  const row = categoryOrTotal === "total" ? officialFeeTotals : officialFeeRows[categoryOrTotal];
  if (currency === "USD") return row.usd[gradeIndex];
  if (currency === "KRW") return row.krw[gradeIndex];
  return Math.round(row.usd[gradeIndex] * indicativeRates[currency]);
}

/** BCP-47 tag for Intl number formatting per app locale. */
const intlLocaleTags: Record<Locale, string> = {
  en: "en",
  ko: "ko",
  zh: "zh-CN",
  th: "th",
};

/** Format a whole-number fee amount as a localized currency string. */
export function formatFee(amount: number, currency: Currency, locale: Locale): string {
  return new Intl.NumberFormat(intlLocaleTags[locale], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}
