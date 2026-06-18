/**
 * Q&A / FAQ screen — route: /{locale}/faq
 *
 * Common questions and answers about the CRIS Golf Program.
 * Requires translation into EN / KO / ZH-Hans / TH (real translation
 * work the school must supply — see §6 and §10).
 * FAQ content and full i18n wiring arrive in subphases 1D and beyond.
 */

import { ScreenStub } from "@/components/ui/ScreenStub";
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

  return (
    <ScreenStub
      heading={dict.faq.heading}
      description={dict.faq.description}
      stubNotice={dict.faq.stubNotice}
    />
  );
}
