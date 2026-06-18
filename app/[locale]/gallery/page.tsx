/**
 * Gallery screen — route: /{locale}/gallery
 *
 * Responsive grid for curated photos + a section for videos.
 * Photo slots and YouTube embed slots are styled placeholders in 1D.
 *
 * 1E: replace photo placeholders with real <Image> components from the
 * school's asset library (media consent confirmed for minors — §0 Gate C).
 *
 * 1E: replace video placeholders with click-to-load youtube-nocookie.com
 * embeds (§8). Each embed must use youtube-nocookie.com (not youtube.com) and
 * must be click-to-load (thumbnail shown; player only loads on tap) to avoid
 * contacting Google servers on page load. Markup structure is pre-built here
 * to make the 1E wiring a drop-in replacement.
 *
 * No tracking or analytics (§8). No autoplay.
 */

import { getDictionary } from "@/i18n/getDictionary";
import { isValidLocale } from "@/i18n/detectLocale";
import type { Locale } from "@/i18n/types";

interface GalleryPageProps {
  params: Promise<{ locale: string }>;
}

/** Number of placeholder photo tiles to render in the grid. */
const PHOTO_PLACEHOLDER_COUNT = 6;

/** Number of placeholder video tiles to render. */
const VIDEO_PLACEHOLDER_COUNT = 2;

export default async function GalleryPage({ params }: GalleryPageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const resolvedLocale: Locale = isValidLocale(locale) ? locale : "en";
  const dict = getDictionary(resolvedLocale);
  const d = dict.gallery;

  return (
    <main className="flex flex-col px-4 py-8 sm:px-6">
      {/* Page header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-sky-900 sm:text-3xl">
          {d.heading}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {d.lead}
        </p>
      </header>

      {/* Coming-soon notice */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-center">
        <p className="text-sm text-slate-500">{d.comingSoon}</p>
      </div>

      {/* Photos section */}
      <section aria-labelledby="photos-heading" className="mb-8">
        <h2
          id="photos-heading"
          className="mb-3 text-base font-semibold text-slate-800"
        >
          {d.photosHeading}
        </h2>

        {/*
         * 1E: replace each placeholder tile below with a real <Image> component.
         * Grid structure and aspect ratios are intentionally pre-defined here.
         */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Array.from({ length: PHOTO_PLACEHOLDER_COUNT }).map((_, i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center rounded-lg bg-slate-100"
              role="img"
              aria-label={d.photoPlaceholder}
            >
              <div className="flex flex-col items-center gap-1.5 text-slate-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                <span className="text-[10px]">{d.photoPlaceholder}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Videos section */}
      <section aria-labelledby="videos-heading">
        <h2
          id="videos-heading"
          className="mb-3 text-base font-semibold text-slate-800"
        >
          {d.videosHeading}
        </h2>

        {/* Privacy note for video embeds */}
        <p className="mb-3 text-xs text-slate-400">{d.videoNote}</p>

        {/*
         * 1E: replace each placeholder tile with a click-to-load
         * youtube-nocookie.com embed. Structure:
         *   <button> (shows thumbnail + play icon)
         *     → on click, replaces with <iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID">
         * This ensures the YouTube player only contacts Google's servers when
         * the user actively requests the video (§8 privacy requirement).
         * Embed URLs must use youtube-nocookie.com, NOT youtube.com.
         */}
        <div className="flex flex-col gap-4">
          {Array.from({ length: VIDEO_PLACEHOLDER_COUNT }).map((_, i) => (
            <div
              key={i}
              className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50"
              role="img"
              aria-label={d.videoPlaceholder}
            >
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span className="text-sm font-medium">{d.videoPlaceholder}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
