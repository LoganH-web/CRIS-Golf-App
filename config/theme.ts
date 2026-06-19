/**
 * Brand theme constants for contexts that can't use Tailwind classes
 * (the web manifest and the viewport theme-color meta tag).
 *
 * MUST stay in sync with the `--color-cris-navy` token in app/globals.css —
 * Tailwind v4 defines colours in CSS, which can't be imported into TS, so this
 * is the single TS-side source for the brand navy. Components use the
 * `cris-navy` Tailwind utility instead of this constant.
 */

/** CRIS brand navy (Tailwind sky-900 family) — app header, primary buttons. */
export const BRAND_NAVY = "#0c4a6e";
