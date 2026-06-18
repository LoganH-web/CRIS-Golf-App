/**
 * Home / Entry screen — route: /{locale}
 *
 * Branded landing screen opened when a visitor scans the QR code.
 * Displays app name, tagline, welcome line, and entry cards linking to the
 * other 5 screens. All strings come from the dictionary (§6 rule).
 *
 * Subphase 1D: real structure and copy. Logo image replaces the CG mark in 1F.
 */

import Link from "next/link";
import { getDictionary } from "@/i18n/getDictionary";
import { isValidLocale } from "@/i18n/detectLocale";
import type { Locale } from "@/i18n/types";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

interface ScreenCard {
  key: keyof ReturnType<typeof getDictionary>["home"]["cards"];
  href: string;
  icon: React.ReactElement;
  colorClass: string;
}

export default async function HomePage({ params }: HomePageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const resolvedLocale: Locale = isValidLocale(locale) ? locale : "en";
  const dict = getDictionary(resolvedLocale);

  const cards: ScreenCard[] = [
    {
      key: "introduction",
      href: `/${resolvedLocale}/introduction`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
      colorClass: "bg-sky-50 text-sky-700 group-hover:bg-sky-100",
    },
    {
      key: "admissions",
      href: `/${resolvedLocale}/admissions`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="19" x2="19" y1="8" y2="14" />
          <line x1="22" x2="16" y1="11" y2="11" />
        </svg>
      ),
      colorClass: "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100",
    },
    {
      key: "tuition",
      href: `/${resolvedLocale}/tuition`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
      ),
      colorClass: "bg-amber-50 text-amber-700 group-hover:bg-amber-100",
    },
    {
      key: "gallery",
      href: `/${resolvedLocale}/gallery`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      ),
      colorClass: "bg-purple-50 text-purple-700 group-hover:bg-purple-100",
    },
    {
      key: "faq",
      href: `/${resolvedLocale}/faq`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      ),
      colorClass: "bg-rose-50 text-rose-700 group-hover:bg-rose-100",
    },
  ];

  return (
    <main className="flex flex-col px-4 py-8 sm:px-6">
      {/* Hero / brand mark */}
      <section className="mb-8 flex flex-col items-center text-center">
        {/* Logo placeholder — replaced with real logo asset in 1F */}
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-sky-900 text-white shadow-md">
          <span className="text-2xl font-bold" aria-hidden="true">CG</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-sky-900 sm:text-4xl">
          {dict.home.heading}
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-500">
          {dict.home.tagline}
        </p>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
          {dict.home.welcomeLine}
        </p>
      </section>

      {/* Entry cards grid */}
      <section aria-labelledby="explore-heading">
        <h2
          id="explore-heading"
          className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-slate-400"
        >
          {dict.home.exploreHeading}
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {cards.map((card) => {
            const cardContent = dict.home.cards[card.key];
            return (
              <Link
                key={card.key}
                href={card.href}
                className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-slate-300 hover:shadow-md active:scale-[0.98]"
              >
                <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${card.colorClass}`}>
                  {card.icon}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 group-hover:text-sky-900">
                    {cardContent.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                    {cardContent.description}
                  </p>
                </div>
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
                  className="ml-auto mt-1 shrink-0 text-slate-300 group-hover:text-slate-400 transition-colors"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
