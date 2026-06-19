/**
 * Icon — the shared 24×24 line-icon set for the app.
 *
 * Extracted to kill the inline-<svg> duplication that had spread across
 * screens and components (GUIDELINES §9: "extract repetition into a component,
 * not a wall of duplicated classes"). The same external-link, contact, image,
 * mail, and chevron glyphs were pasted in 6+ files before this.
 *
 * Every glyph is a `0 0 24 24` viewBox. Line icons inherit colour from
 * `currentColor` (set a text-* class on the caller), and size / stroke width
 * are caller-controlled so existing call sites keep their exact look.
 *
 * NavIcon is intentionally kept separate: its six glyphs carry an active /
 * inactive stroke-weight treatment specific to the bottom tab bar.
 */

import type { ReactNode } from "react";

export type IconName =
  | "external-link"
  | "user-plus"
  | "image"
  | "mail"
  | "phone"
  | "globe"
  | "info-circle"
  | "chevron-down"
  | "chevron-right"
  | "check"
  | "book-open"
  | "credit-card"
  | "help-circle"
  | "play"
  | "play-solid";

interface IconProps {
  name: IconName;
  /** Width & height in px (square). Default 24. */
  size?: number;
  /** Stroke width for line icons. Ignored by the filled `play-solid`. Default 2. */
  strokeWidth?: number;
  className?: string;
}

/** Outline glyphs — rendered with fill:none + stroke:currentColor. */
const STROKE_ICON_PATHS: Record<Exclude<IconName, "play-solid">, ReactNode> = {
  "external-link": (
    <>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" x2="21" y1="14" y2="3" />
    </>
  ),
  "user-plus": (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </>
  ),
  image: (
    <>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </>
  ),
  mail: (
    <>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  ),
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </>
  ),
  "info-circle": (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </>
  ),
  "chevron-down": <polyline points="6 9 12 15 18 9" />,
  "chevron-right": <path d="m9 18 6-6-6-6" />,
  check: <polyline points="20 6 9 17 4 12" />,
  "book-open": (
    <>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </>
  ),
  "credit-card": (
    <>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </>
  ),
  "help-circle": (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </>
  ),
  play: <polygon points="5 3 19 12 5 21 5 3" />,
};

export function Icon({
  name,
  size = 24,
  strokeWidth = 2,
  className,
}: IconProps): React.ReactElement {
  // play-solid is the only filled glyph — solid triangle, no stroke.
  if (name === "play-solid") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className={className}
      >
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {STROKE_ICON_PATHS[name]}
    </svg>
  );
}
