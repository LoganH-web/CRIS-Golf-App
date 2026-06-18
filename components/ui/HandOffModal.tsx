"use client";

/**
 * HandOffModal — §8 privacy disclosure shown before the user leaves the app
 * to any external CRIS URL (the admissions enquiry form).
 *
 * Privacy posture (§3 / §8):
 *   - Opens the external URL in the VISIBLE system/in-app browser via
 *     window.open(url, "_blank", "noopener,noreferrer"). This makes the
 *     hand-off obvious to the user; it does NOT use a silent hidden webview.
 *   - The modal text explicitly states the app collects no data and that any
 *     information entered on the CRIS site is handled under CRIS's policy.
 *   - The user must actively click "Continue" to proceed — the hand-off is
 *     never silent or automatic.
 *
 * Accessibility:
 *   - role="dialog" + aria-modal="true" + aria-labelledby / aria-describedby
 *   - Focus is trapped inside the modal while it is open
 *   - ESC key dismisses the modal (calls onClose)
 *   - First focusable element (Cancel) receives focus on open via autoFocus
 *
 * Usage:
 *   <HandOffModal
 *     isOpen={showModal}
 *     url="https://golf.cris.ac.th/contact"
 *     dict={dict.handOff}
 *     onClose={() => setShowModal(false)}
 *   />
 */

import { useEffect, useRef } from "react";

export interface HandOffModalDict {
  title: string;
  body: string;
  continueButton: string;
  cancelButton: string;
}

interface HandOffModalProps {
  isOpen: boolean;
  url: string;
  dict: HandOffModalDict;
  onClose: () => void;
}

export function HandOffModal({
  isOpen,
  url,
  dict,
  onClose,
}: HandOffModalProps): React.ReactElement | null {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Focus the Cancel button when the modal opens
  useEffect(() => {
    if (isOpen) {
      cancelRef.current?.focus();
    }
  }, [isOpen]);

  // ESC key dismissal
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      // Focus trap: Tab / Shift+Tab cycles between Cancel and Continue only
      if (e.key === "Tab") {
        const focusable = [cancelRef.current, continueRef.current].filter(
          Boolean
        ) as HTMLButtonElement[];
        if (focusable.length < 2) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleContinue = () => {
    // Open external URL in the visible system/in-app browser.
    // target="_blank" + noopener,noreferrer keeps the hand-off visible (§3).
    // A silent hidden webview is explicitly NOT used here (§8).
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Clicking the backdrop (not the dialog card) dismisses the modal
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    // Backdrop — full-screen semi-opaque overlay
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 pb-4 sm:items-center sm:pb-0"
      onClick={handleOverlayClick}
      aria-hidden="false"
    >
      {/* Dialog card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="handoff-modal-title"
        aria-describedby="handoff-modal-body"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      >
        {/* Icon */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-sky-700"
            aria-hidden="true"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" x2="21" y1="14" y2="3" />
          </svg>
        </div>

        {/* Title */}
        <h2
          id="handoff-modal-title"
          className="mb-3 text-base font-semibold text-slate-900"
        >
          {dict.title}
        </h2>

        {/* Body — the §8 disclosure text */}
        <p
          id="handoff-modal-body"
          className="mb-6 text-sm leading-relaxed text-slate-600"
        >
          {dict.body}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            ref={continueRef}
            type="button"
            onClick={handleContinue}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-900 px-5 py-3 text-sm font-semibold text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" x2="21" y1="14" y2="3" />
            </svg>
            {dict.continueButton}
          </button>

          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            autoFocus
            className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
          >
            {dict.cancelButton}
          </button>
        </div>
      </div>
    </div>
  );
}
