/**
 * School Introduction screen — route: /introduction
 *
 * Covers the program overview and the three grade levels:
 *   • Junior (Grades 4–5)
 *   • Intermediate (Grades 6–8)
 *   • Advanced (Grades 9–12)
 * Photos and intro videos arrive in subphase 1D.
 */

import { ScreenStub } from "@/components/ui/ScreenStub";

export default function IntroductionPage(): React.ReactElement {
  return (
    <ScreenStub
      heading="School Introduction"
      description="An overview of the CRIS Golf Program and its three grade levels: Junior (4–5), Intermediate (6–8), and Advanced (9–12). Photos and videos coming in 1D."
    />
  );
}
