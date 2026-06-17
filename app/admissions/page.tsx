/**
 * Admissions screen — route: /admissions
 *
 * Step-by-step admissions process + "Contact Admissions / Enquire" hand-off
 * to golf.cris.ac.th/contact. The enquiry URL is config-driven (config/links.ts,
 * subphase 1E) so it swaps to the real "Apply" form with a one-line change.
 * Hand-off disclosure notice required (§8) — wired in subphase 1E.
 */

import { ScreenStub } from "@/components/ui/ScreenStub";

export default function AdmissionsPage(): React.ReactElement {
  return (
    <ScreenStub
      heading="Admissions"
      description="Step-by-step admissions process and a Contact Admissions button. Hand-off to golf.cris.ac.th/contact wired in subphase 1E."
    />
  );
}
