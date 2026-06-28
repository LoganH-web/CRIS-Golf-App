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
 * Videos shown at the top of the About (Introduction) screen.
 *   programIntro → CRIS Golf Program overview (youtube.com/watch?v=2H3CuxkoVBg)
 *   coachIntro   → Golf Program coach introduction (youtube.com/watch?v=EECSVuMC6FQ)
 * titleKey selects the localized caption from dict.introduction.videoTitles.
 */
export const aboutVideos: {
  id: string | null;
  titleKey: "programIntro" | "coachIntro";
}[] = [
  { id: "2H3CuxkoVBg", titleKey: "programIntro" },
  { id: "EECSVuMC6FQ", titleKey: "coachIntro" },
];

/**
 * Photo shown on each grade-level card on the About screen (one per level,
 * drawn from the gallery set). English alt text, consistent with galleryPhotos.
 */
export const introductionLevelPhotos: Record<
  "junior" | "intermediate" | "advanced",
  { src: string; alt: string }
> = {
  junior: { src: "/images/gallery/junior2.avif", alt: "Junior program students during a golf session" },
  intermediate: { src: "/images/gallery/inter1.avif", alt: "Intermediate program students during a golf session" },
  advanced: { src: "/images/gallery/adv1.avif", alt: "Advanced program students during a golf session" },
};

/**
 * Gallery videos (click-to-load youtube-nocookie embeds, §8).
 *   cris      → CRIS Golf Program informative video
 *              (https://www.youtube.com/watch?v=qiGw8xFid4Y)
 *   happyCity → Happy City Golf Resort intro — the course where the program runs
 *              (https://www.youtube.com/watch?v=briCLWge9Kk)
 * titleKey selects the localized caption from dict.gallery.videoTitles.
 */
export const galleryVideos: {
  id: string | null;
  titleKey: "cris" | "happyCity";
}[] = [
  { id: "qiGw8xFid4Y", titleKey: "cris"      },
  { id: "briCLWge9Kk", titleKey: "happyCity" },
];

/**
 * Curated gallery photos, grouped by program level (+ a general "golf classes"
 * set). The Gallery page renders one labelled section per category, in the
 * order: junior → intermediate → advanced → general.
 *
 * To add photos:
 *   1. Drop the image files into `public/images/gallery/` (AVIF preferred —
 *      smallest files; JPG/PNG/WebP also work). Use clean, URL-safe filenames
 *      (no spaces, parentheses, or ~) so the paths and precache stay valid.
 *   2. Add an entry below: `src` = public path, `alt` = descriptive English
 *      alt text (media consent confirmed — §0 Gate C), `category` = the section.
 *
 * When this array is empty, the Gallery page falls back to placeholder tiles.
 * Photos are NOT precached by the service worker (to keep the offline app
 * shell light); they are cached on first online view via the SW's cache-first
 * handler, so they remain available offline after being seen once.
 */
export const galleryPhotos: {
  src: string;
  alt: string;
  category: "junior" | "intermediate" | "advanced" | "general";
}[] = [
  // Junior program (Grades 4–5)
  { src: "/images/gallery/junior2.avif", alt: "Junior program students during a golf session", category: "junior" },
  { src: "/images/gallery/junior3.avif", alt: "Junior program students practicing golf", category: "junior" },
  { src: "/images/gallery/junior4.avif", alt: "Junior program students on the course", category: "junior" },

  // Intermediate program (Grades 6–8)
  { src: "/images/gallery/inter1.avif", alt: "Intermediate program students during a golf session", category: "intermediate" },
  { src: "/images/gallery/inter2.avif", alt: "Intermediate program students practicing golf", category: "intermediate" },
  { src: "/images/gallery/inter3.avif", alt: "Intermediate program students on the course", category: "intermediate" },
  { src: "/images/gallery/inter4.avif", alt: "Intermediate program students training", category: "intermediate" },

  // Advanced program (Grades 9–12)
  { src: "/images/gallery/adv1.avif", alt: "Advanced program students during a golf session", category: "advanced" },
  { src: "/images/gallery/adv2.avif", alt: "Advanced program students practicing golf", category: "advanced" },
  { src: "/images/gallery/adv3.avif", alt: "Advanced program students on the course", category: "advanced" },
  { src: "/images/gallery/adv4.avif", alt: "Advanced program students training", category: "advanced" },
  { src: "/images/gallery/adv5.avif", alt: "Advanced program (Grades 9–12) students", category: "advanced" },

  // General golf classes
  { src: "/images/gallery/golf-class-1.avif", alt: "Students lining up a putt during a CRIS golf class", category: "general" },
  { src: "/images/gallery/golf-class-2.avif", alt: "A coach guiding a student's swing at a CRIS golf class", category: "general" },
  { src: "/images/gallery/golf-class-3.avif", alt: "Students practicing on the driving range at a CRIS golf class", category: "general" },
  { src: "/images/gallery/golf-class-4.avif", alt: "A student teeing off during a CRIS golf class", category: "general" },
  { src: "/images/gallery/golf-class-5.avif", alt: "Students walking the fairway at a CRIS golf class", category: "general" },
  { src: "/images/gallery/golf-class-6.avif", alt: "A group of students at a CRIS golf class", category: "general" },
  { src: "/images/gallery/golf-class-7.avif", alt: "Short-game chipping practice at a CRIS golf class", category: "general" },
  { src: "/images/gallery/golf-class-8.avif", alt: "Students on the putting green at a CRIS golf class", category: "general" },
  { src: "/images/gallery/golf-class-9.avif", alt: "A coaching session at a CRIS golf class", category: "general" },
];
