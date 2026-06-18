/**
 * ContactFooter — persistent contact section at the bottom of every screen.
 *
 * Updated in subphase 1D: renders real contact details from the dictionary
 * (phone, email, address) as plain text / tel: / mailto: links.
 * Phone and email are factual contact info — tel:/mailto: is acceptable here.
 * The §8 hand-off disclosure applies to the admissions enquiry action (1E),
 * not to plain contact info.
 */

import type { Dictionary } from "@/i18n/types";

interface ContactFooterProps {
  dict: Dictionary;
}

export function ContactFooter({ dict }: ContactFooterProps): React.ReactElement {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-6 py-6 pb-4 text-center text-sm">
      {/* Section heading */}
      <p className="font-semibold text-slate-700">{dict.footer.heading}</p>

      <div className="mt-3 flex flex-col items-center gap-2 text-slate-600">
        {/* Phone */}
        <a
          href={`tel:${dict.footer.phone.replace(/[\s()-]/g, "")}`}
          className="flex items-center gap-2 text-sm hover:text-sky-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="shrink-0"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span>{dict.footer.phone}</span>
        </a>

        {/* Email */}
        <a
          href={`mailto:${dict.footer.email}`}
          className="flex items-center gap-2 text-sm hover:text-sky-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="shrink-0"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <span>{dict.footer.email}</span>
        </a>

        {/* Website */}
        <span className="flex items-center gap-2 text-sm text-slate-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span>{dict.footer.website}</span>
        </span>

        {/* Address */}
        <p className="mt-1 text-xs text-slate-400">{dict.footer.address}</p>
      </div>
    </footer>
  );
}
