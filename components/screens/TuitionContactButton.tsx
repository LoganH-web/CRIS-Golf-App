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
import { Icon } from "@/components/ui/Icon";
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
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-cris-navy px-5 py-3.5 text-sm font-semibold text-white active:opacity-80"
        aria-label={dict.tuition.contactButton}
      >
        <Icon name="user-plus" size={16} />
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
