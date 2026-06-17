/**
 * Q&A / FAQ screen — route: /faq
 *
 * Common questions and answers about the CRIS Golf Program.
 * Requires translation into EN / KO / ZH-Hans / TH (real translation
 * work the school must supply — see §6 and §10).
 * FAQ content and i18n wiring arrive in subphases 1D and 1C respectively.
 */

import { ScreenStub } from "@/components/ui/ScreenStub";

export default function FaqPage(): React.ReactElement {
  return (
    <ScreenStub
      heading="FAQ"
      description="Frequently asked questions about the CRIS Golf Program. Content and translations (EN / KO / ZH-Hans / TH) arrive in subphases 1D and 1C."
    />
  );
}
