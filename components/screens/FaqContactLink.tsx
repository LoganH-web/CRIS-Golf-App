/**
 * FaqContactLink — wired "Contact us directly" link on the FAQ screen.
 *
 * Wires: "Contact us directly" → mailto:admin@cris.ac.th
 *
 * Decision: FAQ uses the GENERAL admin email (admin@cris.ac.th), not the
 * admissions-specific email (admission@cris.ac.th), because FAQ visitors may
 * have general questions not specifically about admissions. The general email
 * is the appropriate triage point — the school can route from there.
 *
 * mailto: links do NOT require the §8 hand-off disclosure — no data passes
 * through the app; the user's own mail client handles everything.
 *
 * A plain mailto: anchor needs no client-side JS, so this stays a server
 * component — extracted only to keep the contact-email decision in one place.
 */

import { generalContactEmail } from "@/config/links";

interface FaqContactLinkProps {
  moreQuestionsNote: string;
  contactLink: string;
}

export function FaqContactLink({
  moreQuestionsNote,
  contactLink,
}: FaqContactLinkProps): React.ReactElement {
  return (
    <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 text-center">
      <p className="text-sm text-slate-600">
        {moreQuestionsNote}{" "}
        <a
          href={`mailto:${generalContactEmail}`}
          className="font-medium text-sky-700 underline-offset-2 hover:underline"
        >
          {contactLink}
        </a>
      </p>
    </div>
  );
}
