/**
 * ContactFooter — persistent contact section at the bottom of every screen.
 *
 * Updated in subphase 1C: accepts the Dictionary so the heading and
 * placeholder text are translated. Real contact details land in 1D.
 */

import type { Dictionary } from "@/i18n/types";

interface ContactFooterProps {
  dict: Dictionary;
}

export function ContactFooter({ dict }: ContactFooterProps): React.ReactElement {
  return (
    <footer className="border-t border-slate-100 bg-slate-50 px-6 py-5 pb-20 text-center text-sm text-slate-500">
      {/* Section heading */}
      <p className="font-semibold text-slate-700">{dict.footer.heading}</p>

      {/*
       * Contact detail placeholders — replaced with real values in 1D.
       * Phone: +66 (0) 53 600-900 | Email: admin@cris.ac.th
       */}
      <p className="mt-1 text-xs text-slate-400">{dict.footer.placeholder}</p>
    </footer>
  );
}
