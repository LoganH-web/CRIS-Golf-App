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

import Image from "next/image";
import { getDictionary } from "@/i18n/getDictionary";
import { isValidLocale } from "@/i18n/detectLocale";
import { YoutubeNocookieEmbed } from "@/components/ui/YoutubeNocookieEmbed";
import { Icon } from "@/components/ui/Icon";
import { galleryVideos, galleryPhotos } from "@/config/links";
import type { Locale } from "@/i18n/types";

interface GalleryPageProps {
  params: Promise<{ locale: string }>;
}

/** Number of placeholder photo tiles to render in the grid. */
const PHOTO_PLACEHOLDER_COUNT = 6;

export default async function GalleryPage({ params }: GalleryPageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const resolvedLocale: Locale = isValidLocale(locale) ? locale : "en";
  const dict = getDictionary(resolvedLocale);
  const d = dict.gallery;

  const hasPhotos = galleryPhotos.length > 0;

  // Group photos by category, in display order, dropping empty groups.
  const photoGroups = (["junior", "intermediate", "advanced", "general"] as const)
    .map((category) => ({
      category,
      label: d.categories[category],
      photos: galleryPhotos.filter((p) => p.category === category),
    }))
    .filter((group) => group.photos.length > 0);

  return (
    <main className="flex flex-col px-4 py-8 sm:px-6">
      {/* Page header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-cris-navy sm:text-3xl">
          {d.heading}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {d.lead}
        </p>
      </header>

      {/* Coming-soon notice — only while no photos are configured yet */}
      {!hasPhotos && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-center">
          <p className="text-sm text-slate-500">{d.comingSoon}</p>
        </div>
      )}

      {/* Photos section */}
      <section aria-labelledby="photos-heading" className="mb-8">
        <h2
          id="photos-heading"
          className="mb-4 text-base font-semibold text-slate-800"
        >
          {d.photosHeading}
        </h2>

        {hasPhotos ? (
          // Real curated photos (AVIF/JPG/PNG), grouped by program level.
          <div className="flex flex-col gap-6">
            {photoGroups.map((group) => (
              <div key={group.category}>
                <h3 className="mb-2 text-sm font-semibold text-cris-navy">
                  {group.label}
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {group.photos.map((photo) => (
                    <div
                      key={photo.src}
                      className="relative aspect-[3/4] overflow-hidden rounded-lg bg-slate-100"
                    >
                      {/*
                       * object-contain, matching the level cards on the About
                       * screen: these are photos of students, and object-cover
                       * on a square tile center-cropped the tall portraits
                       * (junior3 is 0.47:1 — over half its height was cut),
                       * beheading the subject. Contain never crops; the 3:4
                       * tile keeps the letterboxing small for the portraits
                       * that make up most of the set.
                       */}
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 640px) 33vw, 50vw"
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // No photos configured yet — show placeholder tiles.
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Array.from({ length: PHOTO_PLACEHOLDER_COUNT }).map((_, i) => (
              <div
                key={i}
                className="flex aspect-square items-center justify-center rounded-lg bg-slate-100"
                role="img"
                aria-label={d.photoPlaceholder}
              >
                <div className="flex flex-col items-center gap-1.5 text-slate-300">
                  <Icon name="image" size={24} strokeWidth={1.5} />
                  <span className="text-[10px]">{d.photoPlaceholder}</span>
                </div>
              </div>
            ))}
          </div>
        )}
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

        {/* Click-to-load youtube-nocookie.com embeds (§8 privacy requirement) */}
        {/* Zero third-party contact until the user explicitly presses play */}
        <div className="flex flex-col gap-5">
          {galleryVideos.map((video) => (
            <div key={video.titleKey}>
              <h3 className="mb-2 text-sm font-semibold text-cris-navy">
                {d.videoTitles[video.titleKey]}
              </h3>
              <YoutubeNocookieEmbed
                videoId={video.id}
                label={d.videoTitles[video.titleKey]}
                placeholderText={d.videoPlaceholder}
                playLabel={d.videoPlay}
                poster={video.poster}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
