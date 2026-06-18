/**
 * Tuition & Fees screen — route: /{locale}/tuition
 *
 * A native in-app screen showing golf-specific fee figures (school-provided)
 * + a "Contact Admissions" button. Not a link-out. Content lands in subphase 1D.
 * (The general CRIS fee page has different numbers — do not link to it.)
 */

import { ScreenStub } from "@/components/ui/ScreenStub";
import { getDictionary } from "@/i18n/getDictionary";
import { isValidLocale } from "@/i18n/detectLocale";
import type { Locale } from "@/i18n/types";

interface TuitionPageProps {
  params: Promise<{ locale: string }>;
}

export default async function TuitionPage({ params }: TuitionPageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const resolvedLocale: Locale = isValidLocale(locale) ? locale : "en";
  const dict = getDictionary(resolvedLocale);

  return (
    <ScreenStub
      heading={dict.tuition.heading}
      description={dict.tuition.description}
      stubNotice={dict.tuition.stubNotice}
    />
  );
}
