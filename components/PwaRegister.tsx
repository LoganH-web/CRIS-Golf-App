"use client";

/**
 * PwaRegister — registers the service worker on the client side.
 *
 * Subphase 1F PWA layer.
 *
 * Why a client component for registration:
 *   - Service worker registration requires the browser environment
 *     (window / navigator).  Static export has no server runtime, but Next.js
 *     still processes the component tree at build time, so any top-level
 *     navigator access would break the static build.
 *   - A "use client" component with a useEffect is the standard pattern:
 *     it runs only in the browser, after hydration, and is harmless at
 *     build time.
 *
 * Update / cache behaviour (see also public/sw.js):
 *   - skipWaiting + clients.claim in the SW mean a new version activates
 *     immediately.  The next page navigation (or reload) will use the fresh
 *     cache.  For most content updates this is seamless.
 *   - If you need to signal the user that a new version is available, extend
 *     this component to listen for the "controllerchange" event and show a
 *     toast — that is a 1G/v2 polish item; not needed for MVP.
 *
 * Privacy (§8): this component makes no analytics or third-party calls.
 */

import { useEffect } from "react";

export function PwaRegister(): null {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    // Register after the page has loaded so SW registration doesn't compete
    // with page resources during the critical render path.
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          console.log("[PWA] Service worker registered:", registration.scope);
        })
        .catch((err) => {
          // Registration failure is non-fatal — the app works without the SW;
          // it just won't be installable or available offline.
          console.warn("[PWA] Service worker registration failed:", err);
        });
    });
  }, []);

  // Renders nothing — pure side-effect component.
  return null;
}
