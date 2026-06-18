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

import { useState } from "react";

interface YoutubeNocookieEmbedProps {
  /** YouTube video ID (e.g. "dQw4w9WgXcQ"). Set to null for placeholder mode. */
  videoId: string | null;
  /** Accessible label for the play button (from dictionary). */
  label: string;
  /** Text shown below the play icon before the user clicks (from dictionary). */
  placeholderText: string;
}

export function YoutubeNocookieEmbed({
  videoId,
  label,
  placeholderText,
}: YoutubeNocookieEmbedProps): React.ReactElement {
  const [playing, setPlaying] = useState(false);

  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
    : null;

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
      onClick={() => {
        if (videoId) setPlaying(true);
      }}
      aria-label={label}
      disabled={!videoId}
      className={[
        "relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-dashed",
        "bg-slate-900 text-white",
        videoId
          ? "border-slate-600 cursor-pointer"
          : "border-slate-300 bg-slate-50 text-slate-400 cursor-not-allowed",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ aspectRatio: "16/9" }}
    >
      {videoId ? (
        // Ready-to-play state: dark background with play chevron
        <div className="flex flex-col items-center gap-2">
          {/* Play button circle */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="ml-1 text-white"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <span className="text-xs font-medium text-white/80">{placeholderText}</span>
        </div>
      ) : (
        // No video yet: same look as 1D placeholder
        <div className="flex flex-col items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
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
          <span className="text-xs">{placeholderText}</span>
        </div>
      )}
    </button>
  );
}
