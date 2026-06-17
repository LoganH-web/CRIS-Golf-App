/**
 * Gallery screen — route: /gallery
 *
 * Curated photos and embedded videos.
 * Videos MUST use youtube-nocookie.com embeds, not youtube.com,
 * to honour the "no data collected" privacy claim (§8).
 * Media assets and embed wiring arrive in subphase 1D.
 */

import { ScreenStub } from "@/components/ui/ScreenStub";

export default function GalleryPage(): React.ReactElement {
  return (
    <ScreenStub
      heading="Gallery"
      description="Curated photos and videos (youtube-nocookie.com embeds only — §8 privacy). Media assets arrive in subphase 1D."
    />
  );
}
