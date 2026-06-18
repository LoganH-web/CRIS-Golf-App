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
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-900 px-5 py-3.5 text-sm font-semibold text-white active:opacity-80"
          aria-label={contactButtonLabel}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" x2="19" y1="8" y2="14" />
            <line x1="22" x2="16" y1="11" y2="11" />
          </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
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
