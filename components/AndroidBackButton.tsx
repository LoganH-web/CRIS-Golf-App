"use client";

/**
 * AndroidBackButton — makes the Android hardware/gesture back button behave
 * the way users expect inside the native shell.
 *
 * THE PROBLEM (tester feedback):
 *   Capacitor's default back-button behaviour on Android is to exit the app
 *   the moment the WebView has nothing to go back to. On the home screen that
 *   means one tap kills the app outright, which feels abrupt.
 *
 * THE BEHAVIOUR we install instead:
 *   - On an inner page (Introduction, Admissions, …) → go to the previous page
 *     (window.history.back(), which Next's client router handles).
 *   - On a locale home page (/en, /ko, …) or when there is no history left →
 *     minimize the app to the phone's home screen (App.minimizeApp()) instead
 *     of destroying it. The app stays in memory, so reopening is instant and
 *     keeps its state — closer to how native apps treat back from the root.
 *
 * Web / static-export safety:
 *   Pure "use client" + useEffect. The Capacitor modules are imported lazily
 *   inside the effect so they never run at build time, and the whole handler
 *   is a no-op on any platform other than Android (getPlatform() !== "android"),
 *   so the browser build and iOS are unaffected.
 */

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { isValidLocale } from "@/i18n/detectLocale";

/** True when pathname is a locale root ("/", "/ko", "/en/") — the app's home. */
function isHome(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  // "/" → home; "/ko" → home; "/ko/faq" → not home
  return segments.length === 0 || (segments.length === 1 && isValidLocale(segments[0]));
}

export function AndroidBackButton(): null {
  const pathname = usePathname();

  // Keep the latest pathname in a ref so the single listener always reads the
  // current route without being torn down and re-registered on every nav.
  const pathRef = useRef(pathname);
  pathRef.current = pathname;

  useEffect(() => {
    let active = true;
    let remove: (() => void) | undefined;

    (async () => {
      const { Capacitor } = await import("@capacitor/core");
      if (Capacitor.getPlatform() !== "android") return;

      const { App } = await import("@capacitor/app");
      const handle = await App.addListener("backButton", () => {
        if (isHome(pathRef.current) || window.history.length <= 1) {
          // Root of the app: drop to the phone home screen, don't kill the app.
          App.minimizeApp();
        } else {
          window.history.back();
        }
      });

      // If the component unmounted while addListener was still resolving,
      // remove the handle immediately; otherwise wire it up for cleanup.
      if (!active) handle.remove();
      else remove = () => handle.remove();
    })();

    return () => {
      active = false;
      remove?.();
    };
  }, []);

  return null;
}
