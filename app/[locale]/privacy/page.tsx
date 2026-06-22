/**
 * Privacy Policy screen — route: /{locale}/privacy
 *
 * Required per §8 of mvp_guidelines.md.
 *
 * KEY FACTS stated on this page (per §8):
 *   - The app collects and stores NO personal data.
 *   - No analytics, ad, or tracking SDKs are used.
 *   - Any admissions enquiry and any payment are handled by CRIS on CRIS's
 *     own website (golf.cris.ac.th/contact), under CRIS's own privacy policy.
 *   - Gallery videos use privacy-enhanced youtube-nocookie.com (click-to-load)
 *     so no third-party contact occurs until the user presses play.
 *   - The app is about a program involving minors; no child data is collected.
 *
 * PHASE 2 NOTE: The URL for this page —
 *   https://cris-golf-app.vercel.app/en/privacy
 * — is the "privacy policy URL" required by both Apple App Store and Google
 * Play Store listings. Supply this URL when completing the Phase 2 store
 * submission forms. If the canonical URL changes to app.cris.ac.th, update
 * config/links.ts canonicalSiteUrl and note the new URL in store listings.
 *
 * All visible text comes from the dictionary (all 4 locales).
 * "Last updated" date is a hard-coded dictionary string — no Date() call —
 * so the build is deterministic (no date/time APIs, per 1G constraints).
 */

import { getDictionary } from "@/i18n/getDictionary";
import { isValidLocale } from "@/i18n/detectLocale";
import type { Locale } from "@/i18n/types";

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PrivacyPage({ params }: PrivacyPageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const resolvedLocale: Locale = isValidLocale(locale) ? locale : "en";
  const dict = getDictionary(resolvedLocale);
  const d = dict.privacy;
  const s = d.sections;

  return (
    <main className="flex flex-col px-4 py-8 sm:px-6">
      {/* Page header */}
      <header className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-cris-navy sm:text-3xl">
          {d.heading}
        </h1>
        <p className="mt-2 text-xs text-slate-400">{d.lastUpdated}</p>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">{d.intro}</p>
      </header>

      {/* Privacy sections */}
      <div className="flex flex-col gap-8">

        {/* 1 — No data collection */}
        <section aria-labelledby="privacy-no-data">
          <h2
            id="privacy-no-data"
            className="mb-2 text-base font-semibold text-slate-800"
          >
            {s.noDataCollection.heading}
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            {s.noDataCollection.body}
          </p>
        </section>

        {/* 2 — External hand-off (admissions enquiry on CRIS website) */}
        <section aria-labelledby="privacy-hand-off">
          <h2
            id="privacy-hand-off"
            className="mb-2 text-base font-semibold text-slate-800"
          >
            {s.externalHandOff.heading}
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            {s.externalHandOff.body}
          </p>
        </section>

        {/* 3 — Videos / YouTube nocookie */}
        <section aria-labelledby="privacy-videos">
          <h2
            id="privacy-videos"
            className="mb-2 text-base font-semibold text-slate-800"
          >
            {s.videos.heading}
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            {s.videos.body}
          </p>
        </section>

        {/* 4 — Children's privacy */}
        <section aria-labelledby="privacy-minors">
          <h2
            id="privacy-minors"
            className="mb-2 text-base font-semibold text-slate-800"
          >
            {s.minors.heading}
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            {s.minors.body}
          </p>
        </section>

        {/* 5 — Contact / questions about this policy */}
        <section
          aria-labelledby="privacy-contact"
          className="rounded-lg bg-slate-50 px-4 py-4"
        >
          <h2
            id="privacy-contact"
            className="mb-2 text-base font-semibold text-slate-800"
          >
            {s.contact.heading}
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            {s.contact.body}
          </p>
        </section>

      </div>
    </main>
  );
}
