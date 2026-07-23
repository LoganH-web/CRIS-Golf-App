"use client";

/**
 * GalleryPhotos — the gallery photo grid plus a full-screen, swipeable photo
 * viewer (lightbox) that behaves like the native iPhone Photos app.
 *
 * Why a client component: the grid tiles are server-renderable, but the viewer
 * needs interactivity (open on tap, swipe between photos, keyboard nav, body
 * scroll-lock). Keeping the grid here too lets a tapped tile map directly to a
 * flat index across every category, so a swipe carries through the whole set
 * (junior → intermediate → advanced → general), not just one group.
 *
 * Swiping is native CSS scroll-snap, not a hand-rolled touch handler. On iOS
 * that means real momentum, rubber-banding and snapping for free, and it is
 * far more robust in the Capacitor WebView than synthesising gestures. The
 * prev/next buttons and arrow keys drive the same scroll for desktop/a11y.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";

export interface GalleryPhotoGroup {
  category: string;
  label: string;
  photos: { src: string; alt: string }[];
}

interface GalleryPhotosProps {
  groups: GalleryPhotoGroup[];
  labels: {
    open: string;
    close: string;
    previous: string;
    next: string;
  };
}

export function GalleryPhotos({ groups, labels }: GalleryPhotosProps): React.ReactElement {
  // Flat, ordered list across every group — the sequence the viewer swipes.
  const flat = groups.flatMap((g) => g.photos);

  // null = viewer closed; otherwise the flat index the viewer opened at.
  const [openAt, setOpenAt] = useState<number | null>(null);
  // Index currently centered in the viewer (drives the counter + prev/next).
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const isOpen = openAt !== null;

  const open = useCallback((index: number) => {
    setOpenAt(index);
    setCurrent(index);
  }, []);

  const close = useCallback(() => setOpenAt(null), []);

  // Scroll a given flat index into view (used by buttons + keyboard).
  const goTo = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const el = scrollRef.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(flat.length - 1, index));
      el.scrollTo({ left: clamped * el.clientWidth, behavior });
    },
    [flat.length],
  );

  // On open, jump the track to the tapped photo before the first paint so the
  // viewer never flashes photo #1 first.
  useLayoutEffect(() => {
    if (!isOpen) return;
    goTo(openAt as number, "instant");
  }, [isOpen, openAt, goTo]);

  // While open: lock body scroll and wire keyboard navigation.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") goTo(current - 1);
      else if (e.key === "ArrowRight") goTo(current + 1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, current, close, goTo]);

  // Keep `current` in sync as the user swipes/snaps.
  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const width = el.clientWidth || 1;
    const index = Math.round(el.scrollLeft / width);
    setCurrent((c) => (c === index ? c : index));
  }, []);

  // Running offset so each tile knows its position in the flat sequence.
  let flatOffset = 0;

  return (
    <>
      {/* Grid — grouped by program level, identical layout to before */}
      <div className="flex flex-col gap-6">
        {groups.map((group) => {
          const groupStart = flatOffset;
          flatOffset += group.photos.length;
          return (
            <div key={group.category}>
              <h3 className="mb-2 text-sm font-semibold text-cris-navy">{group.label}</h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {group.photos.map((photo, i) => {
                  const flatIndex = groupStart + i;
                  return (
                    <button
                      key={photo.src}
                      type="button"
                      onClick={() => open(flatIndex)}
                      aria-label={labels.open}
                      className="relative aspect-[3/4] cursor-pointer overflow-hidden rounded-lg bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cris-navy"
                    >
                      {/*
                       * object-contain, matching the About level cards: these
                       * portraits (some 0.47:1) would be beheaded by cover on a
                       * tile. Contain never crops; the 3:4 tile keeps letterbox
                       * small for the portraits that dominate the set.
                       */}
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 640px) 33vw, 50vw"
                        className="object-contain"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full-screen viewer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black"
          role="dialog"
          aria-modal="true"
        >
          {/* Swipeable, snap-to-photo track (native scrolling) */}
          <div
            ref={scrollRef}
            onScroll={onScroll}
            className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-contain"
          >
            {flat.map((photo, i) => (
              <div
                key={photo.src}
                className="relative h-full w-full shrink-0 snap-center"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="100vw"
                  // Only the photos adjacent to the opener need to be eager;
                  // the rest lazy-load as the user swipes toward them.
                  priority={Math.abs(i - (openAt as number)) <= 1}
                  className="object-contain"
                />
              </div>
            ))}
          </div>

          {/* Close button — padded below the status-bar safe area */}
          <button
            type="button"
            onClick={close}
            aria-label={labels.close}
            className="absolute right-3 top-[calc(env(safe-area-inset-top)+0.75rem)] flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm active:bg-white/25"
          >
            <Icon name="x" size={22} />
          </button>

          {/* Prev / next — hidden on the first/last photo */}
          {current > 0 && (
            <button
              type="button"
              onClick={() => goTo(current - 1)}
              aria-label={labels.previous}
              className="absolute left-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm active:bg-white/25 sm:flex"
            >
              <Icon name="chevron-left" size={24} />
            </button>
          )}
          {current < flat.length - 1 && (
            <button
              type="button"
              onClick={() => goTo(current + 1)}
              aria-label={labels.next}
              className="absolute right-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm active:bg-white/25 sm:flex"
            >
              <Icon name="chevron-right" size={24} />
            </button>
          )}

          {/* Counter — padded above the home-indicator safe area */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1rem)] flex justify-center">
            <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white">
              {current + 1} / {flat.length}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
