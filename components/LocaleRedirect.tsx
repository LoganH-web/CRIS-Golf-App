"use client";

/**
 * LocaleRedirect — detects the user's preferred locale and redirects them
 * from the root "/" to the appropriate "/{locale}" page.
 *
 * This component is rendered by the root app/page.tsx stub.
 * It uses detectLocale() (which checks localStorage first, then
 * navigator.languages, then defaults to "en") and immediately replaces
 * the current history entry so the back button works naturally.
 *
 * Static-export safety:
 *   The redirect is entirely client-side (useEffect + router.replace).
 *   No server middleware is involved — fully compatible with output: "export".
 *
 * Why useEffect and not an immediate render-time call?
 *   - window/navigator are not available during SSR/SSG.
 *   - useEffect only runs in the browser, after hydration.
 *   - The static HTML for "/" is a bare shell; the meaningful render is in
 *     the target /[locale] page that the user lands on after the redirect.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { detectLocale } from "@/i18n/detectLocale";

export function LocaleRedirect(): null {
  const router = useRouter();

  useEffect(() => {
    const locale = detectLocale();
    router.replace(`/${locale}`);
  }, [router]);

  // Show nothing while the redirect is in flight — the target page renders immediately.
  return null;
}
