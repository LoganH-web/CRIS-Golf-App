"use client";

/**
 * AdmissionsActions — client component for the wired action buttons on the
 * Admissions screen.
 *
 * Wires:
 *   - "Contact Admissions / Enquire" button → §8 HandOffModal → admissionsUrl
 *   - "Request Information by Email" button → mailto:admission@cris.ac.th
 *
 * Kept separate from AdmissionsPage (server component) so the page itself
 * can remain a server component (better for static export / SEO).
 */

import { useState } from "react";
import { HandOffModal } from "@/components/ui/HandOffModal";
import { Icon } from "@/components/ui/Icon";
import { admissionsUrl, requestInfoEmail, admissionsButtonPhase } from "@/config/links";
import type { Dictionary } from "@/i18n/types";

interface AdmissionsActionsProps {
  dict: Dictionary;
}

export function AdmissionsActions({ dict }: AdmissionsActionsProps): React.ReactElement {
  const [modalOpen, setModalOpen] = useState(false);
  const d = dict.admissions;

  // Label switches based on admissionsButtonPhase in config/links.ts
  const contactButtonLabel =
    admissionsButtonPhase === "apply" ? d.applyButton : d.contactButton;

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Contact Admissions / Enquire → §8 disclosure → golf.cris.ac.th/contact */}
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cris-navy px-5 py-3.5 text-sm font-semibold text-white active:opacity-80"
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

      {/* §8 hand-off disclosure modal */}
      <HandOffModal
        isOpen={modalOpen}
        url={admissionsUrl}
        dict={dict.handOff}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
