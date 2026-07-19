"use client";

/**
 * AdmissionsActions — client component for the wired action buttons on the
 * Admissions screen.
 *
 * Wires:
 *   - "Online Application" button        → §8 HandOffModal → admissionsFormUrl
 *   - "Contact Admissions / Enquire" button → §8 HandOffModal → admissionsUrl
 *   - "Request Information by Email" button → mailto:admission@cris.ac.th
 *
 * Kept separate from AdmissionsPage (server component) so the page itself
 * can remain a server component (better for static export / SEO).
 */

import { useState } from "react";
import { HandOffModal } from "@/components/ui/HandOffModal";
import { Icon } from "@/components/ui/Icon";
import {
  admissionsUrl,
  admissionsFormUrl,
  requestInfoEmail,
  admissionsButtonPhase,
} from "@/config/links";
import type { Dictionary } from "@/i18n/types";

interface AdmissionsActionsProps {
  dict: Dictionary;
}

export function AdmissionsActions({ dict }: AdmissionsActionsProps): React.ReactElement {
  /** Target URL for the §8 hand-off modal; null while the modal is closed. */
  const [handOffUrl, setHandOffUrl] = useState<string | null>(null);
  const d = dict.admissions;

  // Label switches based on admissionsButtonPhase in config/links.ts
  const contactButtonLabel =
    admissionsButtonPhase === "apply" ? d.applyButton : d.contactButton;

  return (
    <>
      <div className="flex flex-col gap-3">
        {/*
         * Online Application → §8 disclosure → the final Google Form.
         * Primary action: it is the shortest route to actually applying, so it
         * leads; the enquiry button below is the softer alternative.
         */}
        <button
          type="button"
          onClick={() => setHandOffUrl(admissionsFormUrl)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cris-navy px-5 py-3.5 text-sm font-semibold text-white active:opacity-80"
          aria-label={d.applyOnlineButton}
        >
          <Icon name="external-link" size={16} />
          {d.applyOnlineButton}
        </button>

        {/* Contact Admissions / Enquire → §8 disclosure → golf.cris.ac.th/contact */}
        <button
          type="button"
          onClick={() => setHandOffUrl(admissionsUrl)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 active:opacity-80"
          aria-label={contactButtonLabel}
        >
          <Icon name="user-plus" size={16} />
          {contactButtonLabel}
        </button>

        {/*
         * Request Information by Email → mailto:admission@cris.ac.th
         * mailto: links do NOT need the §8 disclosure — no data passes through
         * the app; the user's own mail client handles everything.
         */}
        <a
          href={`mailto:${requestInfoEmail}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 active:opacity-80"
          aria-label={d.requestInfoButton}
        >
          <Icon name="mail" size={16} />
          {d.requestInfoButton}
        </a>
      </div>

      {/* §8 hand-off disclosure modal — shared by both outbound buttons */}
      <HandOffModal
        isOpen={handOffUrl !== null}
        url={handOffUrl ?? admissionsUrl}
        dict={dict.handOff}
        onClose={() => setHandOffUrl(null)}
      />
    </>
  );
}
