/**
 * Tuition & Fees screen — route: /tuition
 *
 * A NATIVE in-app screen showing golf-program-specific fee figures
 * (NOT a link-out — the general CRIS fees page has different numbers).
 * Fee figures must be provided by the school; placeholder until then.
 * A "Contact Admissions" button is always shown here.
 * No in-app payment of any kind (§2, §3).
 */

import { ScreenStub } from "@/components/ui/ScreenStub";

export default function TuitionPage(): React.ReactElement {
  return (
    <ScreenStub
      heading="Tuition &amp; Fees"
      description="Golf-program fee figures (school-provided) shown natively in-app. No link-out — the general CRIS fees page has different numbers. Figures and Contact Admissions button arrive in 1D."
    />
  );
}
