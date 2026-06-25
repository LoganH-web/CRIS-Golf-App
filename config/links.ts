/**
 * config/links.ts — External URL and contact configuration for the CRIS Golf Program app.
 *
 * SINGLE SOURCE OF TRUTH for all outbound links and canonical URLs.
 *
 * =========================================================
 * CANONICAL SITE URL
 * =========================================================
 * canonicalSiteUrl is the single place that records the app's live URL.
 * It is used by:
 *   - scripts/generate-qr.mjs  (encodes this URL into the printable QR code)
 *   - Any absolute meta/OG tags that reference the app
 *
 * SUBDOMAIN UPGRADE: When the school's IT team sets up app.cris.ac.th:
 *   1. Change `canonicalSiteUrl` below to "https://app.cris.ac.th"
 *   2. Re-run:  node scripts/generate-qr.mjs
 *   3. Reprint/redistribute the QR code.
 *   No other code changes are needed.
 * =========================================================
 *
 * =========================================================
 * ONE-LINE UPGRADE PATH: Enquire → Apply
 * =========================================================
 * When the school launches its real online application form:
 *   1. Change `admissionsUrl` below to the new form URL.
 *   2. Update `admissionsButtonPhase` from "enquire" to "apply".
 *      The button label automatically switches via the dictionary key:
 *        "enquire" → dict.admissions.contactButton   (current: "Contact Admissions / Enquire")
 *        "apply"   → dict.admissions.applyButton     (future:  "Apply Now")
 *
 * No other code changes required.
 * =========================================================
 */

/**
 * The canonical public URL of this app.
 *
 * Current production URL: https://cris-golf-app.vercel.app
 * Future custom subdomain: https://app.cris.ac.th  (swap here when DNS is set up)
 *
 * This value is used by scripts/generate-qr.mjs — re-run that script and
 * reprint the QR code whenever this URL changes.
 */
export const canonicalSiteUrl = "https://cris-golf-app.vercel.app";

/**
 * The CRIS admissions enquiry form URL.
 *
 * Currently points to the contact/enquiry form at golf.cris.ac.th/contact.
 * When the school launches a full online application form, replace this URL
 * (and flip admissionsButtonPhase to "apply") — single-line upgrade.
 */
export const admissionsUrl = "https://golf.cris.ac.th/contact";

/**
 * Controls which button label variant is shown on the Contact Admissions button.
 *   "enquire" → current phase: "Contact Admissions / Enquire"
 *   "apply"   → future phase:  "Apply Now" (when real application form is live)
 */
export const admissionsButtonPhase: "enquire" | "apply" = "enquire";

/**
 * Admissions-specific enquiry email address.
 * Used for the "Request Information by Email" button (mailto: link).
 * Separate from the general admin contact email below.
 */
export const requestInfoEmail = "admission@cris.ac.th";

/**
 * General school contact email (footer, FAQ "contact us directly" link).
 * Distinct from the admissions enquiry email above.
 */
export const generalContactEmail = "admin@cris.ac.th";

/**
 * School-supplied YouTube video IDs for the School Introduction screen.
 *
 * To change a video: update the `id` value below. The component reads these
 * at render time — no other changes needed.
 *
 * Set `id: null` to hide a video slot entirely until a real ID is available.
 */

/**
 * General program introduction video, shown at the top of the Introduction
 * screen (above the three grade-level cards).
 * Source: https://www.youtube.com/watch?v=2H3CuxkoVBg
 */
export const programIntroVideoId: string | null = "2H3CuxkoVBg";

/**
 * Per-grade-level introduction videos.
 *   junior        → https://www.youtube.com/watch?v=EECSVuMC6FQ
 *   intermediate  → https://www.youtube.com/watch?v=mcIyZ_QAHHE
 *   advanced      → https://www.youtube.com/watch?v=QyU_EnL30Vg
 */
export const introductionVideos: {
  level: "junior" | "intermediate" | "advanced";
  id: string | null;
  titleKey: "junior" | "intermediate" | "advanced";
}[] = [
  { level: "junior",       id: "EECSVuMC6FQ", titleKey: "junior"       },
  { level: "intermediate", id: "mcIyZ_QAHHE", titleKey: "intermediate" },
  { level: "advanced",     id: "QyU_EnL30Vg", titleKey: "advanced"     },
];

export const galleryVideos: {
  id: string | null;
  index: number;
}[] = [
  { id: null, index: 0 },
  { id: null, index: 1 },
];
