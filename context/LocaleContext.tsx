"use client";

/**
 * LocaleContext — provides the active locale and dictionary to the component
 * tree under the [locale] layout. Also exposes setLocale() for the language
 * switcher to call when the user picks a different language.
 *
 * The context is intentionally thin — it only holds the locale string that was
 * determined server-side (from the URL segment). Client components that need
 * translated strings receive the Dictionary object as a prop from their
 * server-component parent, which avoids loading all four dictionaries on the
 * client.
 *
 * Why no runtime fetch? Because Next.js static export pre-renders every
 * [locale] route at build time. Each pre-rendered page already includes the
 * correct dictionary strings, so the client never needs to fetch them.
 */

import React, { createContext, useContext } from "react";
import type { Locale } from "@/i18n/types";

interface LocaleContextValue {
  /** The active locale, derived from the URL [locale] segment. */
  locale: Locale;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/** Provider that wraps the [locale] layout; value is set server-side. */
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <LocaleContext.Provider value={{ locale }}>
      {children}
    </LocaleContext.Provider>
  );
}

/** Hook — returns the active locale. Must be used inside LocaleProvider. */
export function useLocale(): Locale {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return ctx.locale;
}
