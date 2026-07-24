"use client";

/**
 * YoutubeNocookieEmbed — click-to-load YouTube privacy-enhanced embed.
 *
 * Privacy posture (§8):
 *   - Before the user clicks: renders a purely local CSS placeholder (no
 *     network requests, no contact with YouTube/Google servers whatsoever).
 *   - On click: injects an <iframe> pointing to youtube-nocookie.com ONLY.
 *     Standard youtube.com embeds are explicitly NEVER used — they set
 *     tracking cookies and call home on page load, which would break the
 *     "no data collected" claim in §8.
 *   - "youtube-nocookie.com" is YouTube's privacy-enhanced mode — it does not
 *     set tracking cookies. The iframe only loads (and contacts external
 *     servers) after the user actively taps/clicks the play button.
 *   - Zero third-party requests fire before the user clicks.
 *
 * When videoId is null (school hasn't supplied real videos yet), the
 * component renders a styled placeholder indistinguishable from the 1D
 * placeholder but clearly labelled. Replacing null with a real YouTube video
 * ID in config/links.ts is the only change needed to activate the embed.
 *
 * Embed URL params:
 *   - autoplay=1: starts the video immediately after the user clicks play
 *   - rel=0: suppresses related videos from other channels after playback
 *   - modestbranding=1: reduces YouTube logo prominence
 */

import { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";

interface YoutubeNocookieEmbedProps {
  /** YouTube video ID (e.g. "dQw4w9WgXcQ"). Set to null for placeholder mode. */
  videoId: string | null;
  /** Accessible label for the play button (from dictionary). */
  label: string;
  /** Text shown below the play icon before the user clicks (from dictionary). */
  placeholderText: string;
  /**
   * Call-to-action shown under the play button when a video IS available
   * (e.g. "Tap to play"). Falls back to placeholderText when omitted — which
   * is only correct for the null/coming-soon state.
   */
  playLabel?: string;
  /**
   * Local poster image shown behind the play button (a path under /public,
   * e.g. "/images/gallery/golf-class-1.avif").
   *
   * Deliberately NOT YouTube's img.youtube.com thumbnail: that would fire a
   * request to Google before the user has clicked anything, which is exactly
   * what the §8 posture above rules out — and it would leave the tile blank
   * offline. A bundled image keeps both promises.
   */
  poster?: string;
}

export function YoutubeNocookieEmbed({
  videoId,
  label,
  placeholderText,
  playLabel,
  poster,
}: YoutubeNocookieEmbedProps): React.ReactElement {
  const [playing, setPlaying] = useState(false);

  /*
   * iOS native (Capacitor) only. The iframe embed works everywhere EXCEPT the
   * iOS native WebView: WKWebView serves the app via a custom scheme handler
   * that drops the HTTP Referer on the cross-origin request to YouTube, so the
   * player gets no referrer and refuses to start ("Error 153"). Confirmed by
   * elimination — the identical embed plays in mobile Safari and in the Android
   * WebView (both send a Referer); only iOS in-app fails, and no URL parameter
   * (widget_referrer, origin, …) can re-add a header the WebView never sends.
   *
   * So on iOS native we don't inline the iframe; tapping opens the video in an
   * in-app Safari sheet (@capacitor/browser), a real Safari context where it
   * plays reliably. Detected after mount (Capacitor is a runtime global) so the
   * first render still matches the server HTML and avoids a hydration mismatch.
   */
  const [isIosNative, setIsIosNative] = useState(false);
  useEffect(() => {
    const cap = (window as unknown as { Capacitor?: { getPlatform?: () => string } }).Capacitor;
    if (cap?.getPlatform?.() === "ios") setIsIosNative(true);
  }, []);

  /*
   * Embed URL params:
   *   - autoplay=1: starts playback after the user taps play
   *   - rel=0: no related videos from other channels afterwards
   *   - modestbranding=1: reduces the YouTube logo
   *   - playsinline=1: plays inline on iOS Safari/PWA instead of forcing the
   *     fullscreen native player
   * (Still youtube-nocookie.com; still click-to-load — no request fires until
   * the user taps, so the §8 privacy posture is unchanged.)
   */
  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
    : null;

  const openInSafariSheet = async (): Promise<void> => {
    if (!videoId) return;
    // Dynamic import keeps the native plugin out of the web bundle; only loaded
    // when an iOS-native user actually taps a video.
    const { Browser } = await import("@capacitor/browser");
    await Browser.open({ url: `https://www.youtube.com/watch?v=${videoId}` });
  };

  const handlePlay = (): void => {
    if (!videoId) return;
    if (isIosNative) {
      void openInSafariSheet();
      return;
    }
    setPlaying(true);
  };

  // Once the user clicks, swap placeholder for the iframe
  if (playing && embedUrl) {
    return (
      <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: "16/9" }}>
        <iframe
          src={embedUrl}
          title={label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full rounded-xl border-0"
          loading="lazy"
        />
      </div>
    );
  }

  // Placeholder / pre-click state — zero external requests
  return (
    <button
      type="button"
      onClick={handlePlay}
      aria-label={label}
      disabled={!videoId}
      className={[
        "relative flex w-full items-center justify-center overflow-hidden rounded-xl border",
        "bg-slate-900 text-white",
        videoId
          ? "border-slate-600 cursor-pointer"
          : "border-dashed border-slate-300 bg-slate-50 text-slate-400 cursor-not-allowed",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ aspectRatio: "16/9" }}
    >
      {/*
       * Poster (local asset — no network) + scrim to keep the button legible.
       * object-contain, not cover: these are video title cards with text laid
       * over them, and cover would shave the edges — enough to clip the coach
       * card's name plate. Letterboxing against the dark tile reads as a
       * normal video player anyway.
       */}
      {videoId && poster && (
        <>
          <Image
            src={poster}
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 640px) 600px, 100vw"
            className="object-contain"
          />
          <div className="absolute inset-0 bg-black/40" />
        </>
      )}

      {videoId ? (
        // Ready-to-play state: play chevron over the poster (or plain dark tile)
        <div className="relative flex flex-col items-center gap-2">
          {/* Play button circle */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm">
            <Icon name="play-solid" size={28} className="ml-1 text-white" />
          </div>
          <span className="text-xs font-medium text-white/90">{playLabel ?? placeholderText}</span>
        </div>
      ) : (
        // No video yet: same look as 1D placeholder
        <div className="flex flex-col items-center gap-2">
          <Icon name="play" size={28} strokeWidth={1.5} />
          <span className="text-xs">{placeholderText}</span>
        </div>
      )}
    </button>
  );
}
