/**
 * i18n types for the CRIS Golf Program app.
 * The Dictionary type mirrors the shape of every JSON dictionary file.
 * TypeScript will error if any locale's JSON deviates from this shape.
 */

export type Locale = "en" | "ko" | "zh" | "th";

export const LOCALES: Locale[] = ["en", "ko", "zh", "th"];

export const DEFAULT_LOCALE: Locale = "en";

/** Maps each locale to its native display name shown in the switcher. */
export const LOCALE_DISPLAY_NAMES: Record<Locale, string> = {
  en: "English",
  ko: "한국어",
  zh: "简体中文",
  th: "ไทย",
};

/** Maps each locale to its short label shown in the header switcher button. */
export const LOCALE_SHORT_LABELS: Record<Locale, string> = {
  en: "EN",
  ko: "KO",
  zh: "ZH",
  th: "TH",
};

/**
 * The full shape of a dictionary file. This type is inferred from the
 * structure of en.json and all other locale files must match it.
 */
export interface Dictionary {
  meta: {
    appName: string;
    tagline: string;
    lang: string;
  };
  nav: {
    home: string;
    introduction: string;
    admissions: string;
    tuition: string;
    gallery: string;
    faq: string;
    homeLabel: string;
    introductionLabel: string;
    admissionsLabel: string;
    tuitionLabel: string;
    galleryLabel: string;
    faqLabel: string;
  };
  header: {
    appName: string;
    langSwitcherLabel: string;
    currentLang: string;
  };
  footer: {
    heading: string;
    placeholder: string;
  };
  home: {
    heading: string;
    tagline: string;
    scaffoldNotice: string;
  };
  introduction: {
    heading: string;
    description: string;
    stubNotice: string;
  };
  admissions: {
    heading: string;
    description: string;
    stubNotice: string;
  };
  tuition: {
    heading: string;
    description: string;
    stubNotice: string;
  };
  gallery: {
    heading: string;
    description: string;
    stubNotice: string;
  };
  faq: {
    heading: string;
    description: string;
    stubNotice: string;
  };
  langSwitcher: {
    en: string;
    ko: string;
    zh: string;
    th: string;
  };
}
