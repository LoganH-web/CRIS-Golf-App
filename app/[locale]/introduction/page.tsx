/**
 * School Introduction ("About") screen — route: /{locale}/introduction
 *
 * Top of page: two intro videos (Program Introduction + Coach Introduction),
 * click-to-load youtube-nocookie embeds (§8).
 *
 * Then the three grade levels, each as a card with a photo banner, label,
 * grade range, and description:
 *   - Junior (Grades 4–5)
 *   - Intermediate (Grades 6–8)
 *   - Advanced (Grades 9–12)
 *
 * Videos and level photos come from config/links.ts (aboutVideos,
 * introductionLevelPhotos). Level descriptions are localized per dictionary.
 */

import Image from "next/image";
import { getDictionary } from "@/i18n/getDictionary";
import { isValidLocale } from "@/i18n/detectLocale";
import { YoutubeNocookieEmbed } from "@/components/ui/YoutubeNocookieEmbed";
import { aboutVideos, introductionLevelPhotos } from "@/config/links";
import type { Locale } from "@/i18n/types";

interface IntroductionPageProps {
  params: Promise<{ locale: string }>;
}

/** Display order for the affiliations list (matches the CRIS website). */
const affiliationKeys = ["wasc", "asean", "isat", "opec", "onesqa", "wida"] as const;

export default async function IntroductionPage({ params }: IntroductionPageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const resolvedLocale: Locale = isValidLocale(locale) ? locale : "en";
  const dict = getDictionary(resolvedLocale);
  const d = dict.introduction;

  const levels = [
    {
      key: "junior" as const,
      data: d.levels.junior,
      accentColor: "border-sky-400",
      labelBg: "bg-sky-100 text-sky-800",
    },
    {
      key: "intermediate" as const,
      data: d.levels.intermediate,
      accentColor: "border-emerald-400",
      labelBg: "bg-emerald-100 text-emerald-800",
    },
    {
      key: "advanced" as const,
      data: d.levels.advanced,
      accentColor: "border-amber-400",
      labelBg: "bg-amber-100 text-amber-800",
    },
  ];

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
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {d.programOverview}
        </p>
      </header>

      {/* Intro videos — click-to-load youtube-nocookie (§8) */}
      <div className="mb-8 flex flex-col gap-5">
        {aboutVideos.map((video) => (
          <div key={video.titleKey}>
            <h2 className="mb-2 text-sm font-semibold text-cris-navy">
              {d.videoTitles[video.titleKey]}
            </h2>
            <YoutubeNocookieEmbed
              videoId={video.id}
              label={d.videoTitles[video.titleKey]}
              placeholderText={d.videoPlaceholder}
              playLabel={d.videoPlay}
            />
          </div>
        ))}
      </div>

      {/* Grade-level cards */}
      <div className="flex flex-col gap-6">
        {levels.map(({ key, data, accentColor, labelBg }) => {
          const photo = introductionLevelPhotos[key];
          return (
            <article
              key={key}
              className={`overflow-hidden rounded-xl border-2 border-l-[6px] border-slate-200 bg-white shadow-sm ${accentColor}`}
            >
              {/* Photo — object-contain so the full image is always visible (never cropped) */}
              <div className="relative h-72 w-full bg-slate-100">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 640px) 600px, 100vw"
                  className="object-contain"
                />
              </div>

              <div className="p-4">
                {/* Level label + grade range */}
                <div className="mb-3 flex items-center gap-2">
                  <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${labelBg}`}>
                    {data.label}
                  </span>
                  <span className="text-xs text-slate-500">{data.grades}</span>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-slate-600">
                  {data.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {/* Affiliations & accreditations — source: cris.ac.th/affiliations */}
      <section aria-labelledby="affiliations-heading" className="mt-10">
        <h2
          id="affiliations-heading"
          className="text-lg font-bold tracking-tight text-cris-navy"
        >
          {d.affiliations.heading}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {d.affiliations.lead}
        </p>

        <ul className="mt-4 flex flex-col gap-3">
          {affiliationKeys.map((key) => {
            const item = d.affiliations.items[key];
            return (
              <li
                key={key}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <h3 className="text-sm font-semibold text-cris-navy">
                  {item.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
