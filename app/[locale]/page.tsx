/**
 * Home / Entry screen — route: /{locale}
 *
 * The branded landing screen opened when a visitor scans the QR code.
 * In subphase 1C strings come from the dictionary. Real brand assets and
 * copy land in 1D.
 */

import { getDictionary } from "@/i18n/getDictionary";
import { isValidLocale } from "@/i18n/detectLocale";
import type { Locale } from "@/i18n/types";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const resolvedLocale: Locale = isValidLocale(locale) ? locale : "en";
  const dict = getDictionary(resolvedLocale);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      {/* Brand mark — replaced with real logo in subphase 1D */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sky-900 text-white">
        <span className="text-2xl font-bold" aria-hidden="true">
          CG
        </span>
      </div>

      {/* App name */}
      <h1 className="text-3xl font-bold tracking-tight text-sky-900 sm:text-4xl">
        {dict.home.heading}
      </h1>

      {/* Tagline */}
      <p className="mt-2 text-sm text-slate-500 sm:text-base">
        {dict.home.tagline}
      </p>

      {/* 1C scaffold notice — remove when real content lands in 1D */}
      <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-5 py-3 text-xs text-amber-700">
        {dict.home.scaffoldNotice}
      </p>
    </main>
  );
}
