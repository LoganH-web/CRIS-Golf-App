"use client";

/**
 * LanguageSwitcher — replaces the disabled placeholder in AppHeader (subphase 1C).
 *
 * Renders a dropdown showing the four supported locales. On selection:
 *   1. Persists the user's choice to localStorage (survives reloads).
 *   2. Navigates to the same screen in the new locale (preserves current path).
 *
 * How route-preservation works:
 *   Current pathname will be "/en/admissions" (or similar). We split off the
 *   locale prefix and replace it with the new locale, keeping the rest intact.
 *   e.g. "/en/admissions" → "/ko/admissions"
 *        "/zh"            → "/th"   (home screen)
 *
 * Static-export safety:
 *   All locale detection and navigation are purely client-side.
 *   No server middleware or API routes are involved.
 *
 * Device-language detection:
 *   On first visit (no stored override), the LocaleRedirect component in the
 *   root layout handles the browser-language → locale redirect. Once the user
 *   lands on a locale page this switcher handles further changes.
 */

import { useRouter, usePathname } from "next/navigation";
import { LOCALES, LOCALE_DISPLAY_NAMES, LOCALE_SHORT_LABELS } from "@/i18n/types";
import type { Locale } from "@/i18n/types";
import { setStoredLocale } from "@/i18n/detectLocale";
import { useLocale } from "@/context/LocaleContext";
import { useState, useRef, useEffect } from "react";

interface LanguageSwitcherProps {
  /** aria-label for the trigger button — from dict.header.langSwitcherLabel. */
  triggerLabel: string;
  /** aria-label for the open listbox — from dict.header.listboxLabel. */
  listboxLabel: string;
}

export function LanguageSwitcher({
  triggerLabel,
  listboxLabel,
}: LanguageSwitcherProps): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const activeLocale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  function handleLocaleChange(newLocale: Locale) {
    if (newLocale === activeLocale) {
      setIsOpen(false);
      return;
    }

    // Persist the user's manual choice
    setStoredLocale(newLocale);

    // Build the new path by replacing the locale prefix.
    // pathname is like "/en", "/en/admissions", "/ko/faq", etc.
    const segments = pathname.split("/").filter(Boolean); // ["en", "admissions"]
    const currentLocaleInPath = segments[0];

    let newPath: string;
    if (currentLocaleInPath && (LOCALES as string[]).includes(currentLocaleInPath)) {
      // Replace the locale segment, keep the rest
      segments[0] = newLocale;
      newPath = "/" + segments.join("/");
    } else {
      // Fallback: just go to the new locale home
      newPath = "/" + newLocale;
    }

    setIsOpen(false);
    router.push(newPath);
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={triggerLabel}
        className="flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 transition-colors"
      >
        <span>{LOCALE_SHORT_LABELS[activeLocale]}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown list */}
      {isOpen && (
        <ul
          role="listbox"
          aria-label={listboxLabel}
          className="absolute right-0 top-full mt-1 z-50 min-w-[10rem] overflow-hidden rounded-md border border-slate-200 bg-white shadow-md"
        >
          {LOCALES.map((locale) => {
            const isActive = locale === activeLocale;
            return (
              <li key={locale} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => handleLocaleChange(locale)}
                  className={[
                    "flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors",
                    isActive
                      ? "bg-sky-50 font-semibold text-sky-800"
                      : "text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <span className="w-8 shrink-0 text-xs font-mono text-slate-400">
                    {LOCALE_SHORT_LABELS[locale]}
                  </span>
                  <span>{LOCALE_DISPLAY_NAMES[locale]}</span>
                  {isActive && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-auto text-sky-700"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
