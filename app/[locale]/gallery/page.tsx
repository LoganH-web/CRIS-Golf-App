/**
 * Gallery screen — route: /{locale}/gallery
 *
 * Curated photos + embedded videos via privacy-enhanced YouTube embeds
 * (youtube-nocookie.com, §8). Content lands in subphase 1D.
 */

import { ScreenStub } from "@/components/ui/ScreenStub";
import { getDictionary } from "@/i18n/getDictionary";
import { isValidLocale } from "@/i18n/detectLocale";
import type { Locale } from "@/i18n/types";

interface GalleryPageProps {
  params: Promise<{ locale: string }>;
}

export default async function GalleryPage({ params }: GalleryPageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const resolvedLocale: Locale = isValidLocale(locale) ? locale : "en";
  const dict = getDictionary(resolvedLocale);

  return (
    <ScreenStub
      heading={dict.gallery.heading}
      description={dict.gallery.description}
      stubNotice={dict.gallery.stubNotice}
    />
  );
}
