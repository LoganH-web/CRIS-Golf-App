/**
 * School Introduction screen — route: /{locale}/introduction
 *
 * The program introduction + three grade levels (Junior 4–5, Intermediate 6–8,
 * Advanced 9–12), photos, intro videos. Content lands in subphase 1D.
 */

import { ScreenStub } from "@/components/ui/ScreenStub";
import { getDictionary } from "@/i18n/getDictionary";
import { isValidLocale } from "@/i18n/detectLocale";
import type { Locale } from "@/i18n/types";

interface IntroductionPageProps {
  params: Promise<{ locale: string }>;
}

export default async function IntroductionPage({ params }: IntroductionPageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const resolvedLocale: Locale = isValidLocale(locale) ? locale : "en";
  const dict = getDictionary(resolvedLocale);

  return (
    <ScreenStub
      heading={dict.introduction.heading}
      description={dict.introduction.description}
      stubNotice={dict.introduction.stubNotice}
    />
  );
}
