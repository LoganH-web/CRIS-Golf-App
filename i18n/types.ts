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
    listboxLabel: string;
  };
  footer: {
    heading: string;
    phone: string;
    email: string;
    address: string;
    website: string;
    privacyPolicyLink: string;
  };
  home: {
    heading: string;
    tagline: string;
    welcomeLine: string;
    exploreHeading: string;
    cards: {
      introduction: { title: string; description: string };
      admissions: { title: string; description: string };
      tuition: { title: string; description: string };
      gallery: { title: string; description: string };
      faq: { title: string; description: string };
    };
  };
  introduction: {
    heading: string;
    lead: string;
    programOverview: string;
    levels: {
      junior: {
        label: string;
        grades: string;
        description: string;
        photoAlt: string;
        videoLabel: string;
      };
      intermediate: {
        label: string;
        grades: string;
        description: string;
        photoAlt: string;
        videoLabel: string;
      };
      advanced: {
        label: string;
        grades: string;
        description: string;
        photoAlt: string;
        videoLabel: string;
      };
    };
    photoPlaceholder: string;
    videoPlaceholder: string;
  };
  /** §8 hand-off disclosure modal shown before opening the admissions URL */
  handOff: {
    title: string;
    body: string;
    continueButton: string;
    cancelButton: string;
  };
  admissions: {
    heading: string;
    lead: string;
    stepsHeading: string;
    steps: Array<{
      title: string;
      description: string;
    }>;
    actionsHeading: string;
    /** Current button label (Enquire phase) */
    contactButton: string;
    /** Future button label — swaps in when real Apply form is live (admissionsButtonPhase = "apply") */
    applyButton: string;
    requestInfoButton: string;
    contactButtonNote: string;
  };
  tuition: {
    heading: string;
    lead: string;
    placeholderHeading: string;
    placeholderBody: string;
    tableNote: string;
    levelColumn: string;
    gradesColumn: string;
    termFeeColumn: string;
    annualFeeColumn: string;
    rows: Array<{
      level: string;
      grades: string;
      termFee: string;
      annualFee: string;
    }>;
    feesComingSoon: string;
    contactButton: string;
    disclaimer: string;
  };
  gallery: {
    heading: string;
    lead: string;
    photosHeading: string;
    videosHeading: string;
    photoPlaceholder: string;
    videoPlaceholder: string;
    videoNote: string;
    comingSoon: string;
  };
  faq: {
    heading: string;
    lead: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
    moreQuestionsNote: string;
    contactLink: string;
  };
  /** §8 — Privacy policy page (route: /{locale}/privacy) */
  privacy: {
    heading: string;
    lastUpdated: string;
    /** Short lead paragraph */
    intro: string;
    sections: {
      noDataCollection: {
        heading: string;
        body: string;
      };
      externalHandOff: {
        heading: string;
        body: string;
      };
      videos: {
        heading: string;
        body: string;
      };
      minors: {
        heading: string;
        body: string;
      };
      contact: {
        heading: string;
        body: string;
      };
    };
  };
}
