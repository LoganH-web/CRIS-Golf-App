/**
 * config/links.ts — External URL and contact configuration for the CRIS Golf Program app.
 *
 * SINGLE SOURCE OF TRUTH for all outbound links.
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
 * Placeholder YouTube video IDs used until the school supplies real video links.
 *
 * To replace with real videos: update the `id` values below. The component
 * reads these at render time — no other changes needed.
 *
 * Convention: use a recognisable PLACEHOLDER_ prefix so stale placeholder IDs
 * are immediately obvious in a code review.
 *
 * Set `id: null` to hide a video slot entirely until a real ID is available.
 */
export const introductionVideos: {
  level: "junior" | "intermediate" | "advanced";
  id: string | null;
  titleKey: "junior" | "intermediate" | "advanced";
}[] = [
  { level: "junior",       id: null, titleKey: "junior"       },
  { level: "intermediate", id: null, titleKey: "intermediate" },
  { level: "advanced",     id: null, titleKey: "advanced"     },
];

export const galleryVideos: {
  id: string | null;
  index: number;
}[] = [
  { id: null, index: 0 },
  { id: null, index: 1 },
];
