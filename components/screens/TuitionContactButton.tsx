"use client";

/**
 * TuitionContactButton — client component for the wired Contact Admissions
 * button on the Tuition & Fees screen.
 *
 * Wires: "Contact Admissions for Fee Details" → §8 HandOffModal → admissionsUrl
 *
 * Kept separate from TuitionPage (server component) for static export hygiene.
 */

import { useState } from "react";
import { HandOffModal } from "@/components/ui/HandOffModal";
import { admissionsUrl } from "@/config/links";
import type { Dictionary } from "@/i18n/types";

interface TuitionContactButtonProps {
  dict: Dictionary;
}

export function TuitionContactButton({ dict }: TuitionContactButtonProps): React.ReactElement {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-900 px-5 py-3.5 text-sm font-semibold text-white active:opacity-80"
        aria-label={dict.tuition.contactButton}
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
        {dict.tuition.contactButton}
      </button>

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
