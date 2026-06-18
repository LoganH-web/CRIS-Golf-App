/**
 * Admissions screen — route: /{locale}/admissions
 *
 * Step-by-step admissions process + "Contact Admissions / Enquire" hand-off
 * to golf.cris.ac.th/contact. The enquiry URL is config-driven (config/links.ts,
 * subphase 1E) so it swaps to the real "Apply" form with a one-line change.
 * Hand-off disclosure notice required (§8) — wired in subphase 1E.
 */

import { ScreenStub } from "@/components/ui/ScreenStub";
import { getDictionary } from "@/i18n/getDictionary";
import { isValidLocale } from "@/i18n/detectLocale";
import type { Locale } from "@/i18n/types";

interface AdmissionsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdmissionsPage({ params }: AdmissionsPageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const resolvedLocale: Locale = isValidLocale(locale) ? locale : "en";
  const dict = getDictionary(resolvedLocale);

  return (
    <ScreenStub
      heading={dict.admissions.heading}
      description={dict.admissions.description}
      stubNotice={dict.admissions.stubNotice}
    />
  );
}
