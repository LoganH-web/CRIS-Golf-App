/**
 * School Introduction screen — route: /{locale}/introduction
 *
 * Describes the CRIS Golf Program and its three grade levels:
 *   - Junior (Grades 4–5)
 *   - Intermediate (Grades 6–8)
 *   - Advanced (Grades 9–12)
 *
 * Each level renders as a card with heading, grade range, description, and
 * placeholder slots for photos and intro videos.
 *
 * Subphase 1D: real structure and English copy; ko/zh/th level descriptions
 * fall back to English (school supplies translations — §6 / §10).
 * Photo and video slots are styled placeholders — real media wired in 1E.
 */

import { getDictionary } from "@/i18n/getDictionary";
import { isValidLocale } from "@/i18n/detectLocale";
import { YoutubeNocookieEmbed } from "@/components/ui/YoutubeNocookieEmbed";
import { Icon } from "@/components/ui/Icon";
import { introductionVideos } from "@/config/links";
import type { Locale } from "@/i18n/types";

interface IntroductionPageProps {
  params: Promise<{ locale: string }>;
}

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

      {/* Grade-level cards */}
      <div className="flex flex-col gap-6">
        {levels.map(({ key, data, accentColor, labelBg }) => (
          <article
            key={key}
            className={`overflow-hidden rounded-xl border-2 border-l-[6px] border-slate-200 bg-white shadow-sm ${accentColor}`}
          >
            {/* Photo placeholder slot */}
            {/* 1E: replace this placeholder div with a real <Image> component once school supplies photos */}
            <div
              className="flex h-40 w-full items-center justify-center bg-slate-100"
              role="img"
              aria-label={data.photoAlt}
            >
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <Icon name="image" size={32} strokeWidth={1.5} />
                <span className="text-xs">{d.photoPlaceholder}</span>
              </div>
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

              {/* Video slot — click-to-load youtube-nocookie.com embed (§8) */}
              {/* Zero third-party contact until the user explicitly presses play */}
              <div className="mt-4">
                <YoutubeNocookieEmbed
                  videoId={introductionVideos.find((v) => v.level === key)?.id ?? null}
                  label={data.videoLabel}
                  placeholderText={d.videoPlaceholder}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
