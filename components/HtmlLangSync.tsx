"use client";

/**
 * HtmlLangSync — reads the locale from the current URL and updates the
 * <html lang> attribute to match.
 *
 * WHY this is needed:
 *   Next.js App Router requires <html> in the root layout (app/layout.tsx).
 *   The root layout doesn't know which locale is active at build time for the
 *   static root "/" page. The [locale] nested layout pre-renders with the
 *   correct locale in the URL, so we read it from pathname here and sync it
 *   to <html lang> client-side.
 *
 *   For statically pre-rendered [locale] pages the lang is also set via the
 *   metadata `alternates` / Open Graph locale, but for the live DOM experience
 *   this component ensures <html lang> is always correct.
 *
 * Static-export safety:
 *   Pure useEffect — no server runtime. Runs after hydration in the browser.
 */

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isValidLocale } from "@/i18n/detectLocale";
import { DEFAULT_LOCALE } from "@/i18n/types";

export function HtmlLangSync(): null {
  const pathname = usePathname();

  useEffect(() => {
    // pathname is like "/en", "/en/admissions", "/ko/faq", "/"
    const segments = pathname.split("/").filter(Boolean);
    const firstSegment = segments[0] ?? "";
    const locale = isValidLocale(firstSegment) ? firstSegment : DEFAULT_LOCALE;

    const html = document.documentElement;
    if (html.lang !== locale) {
      html.lang = locale;
    }
    // All four locales are LTR
    html.dir = "ltr";
  }, [pathname]);

  return null;
}
