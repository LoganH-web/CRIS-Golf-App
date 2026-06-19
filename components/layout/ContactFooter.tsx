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
import { Icon } from "@/components/ui/Icon";

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
          <Icon name="phone" size={14} className="shrink-0" />
          <span>{dict.footer.phone}</span>
        </a>

        {/* Email */}
        <a
          href={`mailto:${dict.footer.email}`}
          className="flex items-center gap-2 text-sm hover:text-sky-700 transition-colors"
        >
          <Icon name="mail" size={14} className="shrink-0" />
          <span>{dict.footer.email}</span>
        </a>

        {/* Website */}
        <span className="flex items-center gap-2 text-sm text-slate-500">
          <Icon name="globe" size={14} className="shrink-0" />
          <span>{dict.footer.website}</span>
        </span>

        {/* Address */}
        <p className="mt-1 text-xs text-slate-400">{dict.footer.address}</p>
      </div>
    </footer>
  );
}
