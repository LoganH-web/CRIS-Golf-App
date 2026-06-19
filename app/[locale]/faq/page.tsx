/**
 * Q&A / FAQ screen — route: /{locale}/faq
 *
 * Expandable accordion list of common questions and answers.
 * A few sensible placeholder Q&A entries are provided in all four locales.
 * The school supplies the final Q&A content (§10).
 *
 * Korean, Chinese, and Thai translations are real for short UI strings;
 * full Q&A items are properly translated in the dictionary (school provided
 * the context — real translations supplied for this screen in 1D).
 *
 * Uses <FaqAccordion> (client component) for expand/collapse interaction,
 * keeping the page itself a server component.
 */

import { FaqAccordion } from "@/components/screens/FaqAccordion";
import { FaqContactLink } from "@/components/screens/FaqContactLink";
import { getDictionary } from "@/i18n/getDictionary";
import { isValidLocale } from "@/i18n/detectLocale";
import type { Locale } from "@/i18n/types";

interface FaqPageProps {
  params: Promise<{ locale: string }>;
}

export default async function FaqPage({ params }: FaqPageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const resolvedLocale: Locale = isValidLocale(locale) ? locale : "en";
  const dict = getDictionary(resolvedLocale);
  const d = dict.faq;

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

      {/* FAQ accordion */}
      <FaqAccordion items={d.items} />

      {/* More questions CTA — wired in 1E via FaqContactLink (mailto:admin@cris.ac.th) */}
      <FaqContactLink
        moreQuestionsNote={d.moreQuestionsNote}
        contactLink={d.contactLink}
      />
    </main>
  );
}
