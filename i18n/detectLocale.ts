/**
 * detectLocale — client-side locale detection with manual override persistence.
 *
 * Priority order (highest to lowest):
 *   1. localStorage override (user's explicit manual choice)
 *   2. navigator.languages / navigator.language (device/browser language)
 *   3. DEFAULT_LOCALE ("en")
 *
 * This runs entirely in the browser — no server runtime required —
 * so it is fully compatible with Next.js output: "export" static builds.
 *
 * The stored key is intentionally simple ("cris-golf-locale") so it is
 * easy to clear in tests and easy to reason about.
 */

import { LOCALES, DEFAULT_LOCALE } from "./types";
import type { Locale } from "./types";

const STORAGE_KEY = "cris-golf-locale";

/**
 * Maps a raw BCP-47 language tag to one of the four supported locales,
 * or returns null if the tag doesn't match any supported locale.
 *
 * Matching rules (in order):
 *   - Exact match after lower-casing the first subtag (e.g. "ko" → "ko").
 *   - "zh", "zh-hans", "zh-cn", "zh-sg" → "zh"  (Simplified Chinese)
 *   - All other "zh-*" variants (Traditional) are NOT matched → fall through.
 */
function mapLanguageTag(tag: string): Locale | null {
  const lower = tag.toLowerCase();
  const primary = lower.split("-")[0];

  // Thai
  if (primary === "th") return "th";
  // Korean
  if (primary === "ko") return "ko";
  // English
  if (primary === "en") return "en";
  // Chinese — only Simplified
  if (primary === "zh") {
    // Traditional variants (zh-TW, zh-HK, zh-MO) → do not match
    if (lower === "zh-tw" || lower === "zh-hk" || lower === "zh-mo") {
      return null;
    }
    return "zh";
  }
  return null;
}

/** Returns the locale persisted from a previous manual override, or null. */
export function getStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (LOCALES as string[]).includes(stored)) {
      return stored as Locale;
    }
  } catch {
    // localStorage may be blocked (private mode, security policy)
  }
  return null;
}

/** Persists the user's manual locale choice to localStorage. */
export function setStoredLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Silently ignore — the switcher still works for the current session
  }
}

/**
 * Detects the best locale to use, consulting (in order):
 *   1. localStorage override
 *   2. browser language preferences
 *   3. DEFAULT_LOCALE
 *
 * This function is safe to call during SSR/SSG (returns DEFAULT_LOCALE then).
 */
export function detectLocale(): Locale {
  // 1. Manual override
  const stored = getStoredLocale();
  if (stored) return stored;

  // 2. Browser language
  if (typeof window !== "undefined" && navigator.languages) {
    for (const lang of navigator.languages) {
      const mapped = mapLanguageTag(lang);
      if (mapped) return mapped;
    }
  }
  if (typeof window !== "undefined" && navigator.language) {
    const mapped = mapLanguageTag(navigator.language);
    if (mapped) return mapped;
  }

  // 3. Fallback
  return DEFAULT_LOCALE;
}

/**
 * Returns true if `value` is a valid Locale string.
 * Used to validate URL segments before using them as locales.
 */
export function isValidLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}
