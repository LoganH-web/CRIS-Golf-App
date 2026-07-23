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
      junior: { label: string; grades: string; description: string };
      intermediate: { label: string; grades: string; description: string };
      advanced: { label: string; grades: string; description: string };
    };
    /** Fallback text for a video embed with no id (embed requires it) */
    videoPlaceholder: string;
    /** Call-to-action under the play button when a real video is available */
    videoPlay: string;
    /** Captions / accessible titles for the two top-of-page videos */
    videoTitles: {
      programIntro: string;
      coachIntro: string;
    };
    /**
     * School affiliations & accreditations.
     * Source: https://www.cris.ac.th/affiliations
     * Organisation `name`s stay in English in every locale (official proper
     * names); only the descriptions are localized.
     */
    affiliations: {
      heading: string;
      lead: string;
      items: {
        wasc: { name: string; description: string };
        asean: { name: string; description: string };
        isat: { name: string; description: string };
        opec: { name: string; description: string };
        onesqa: { name: string; description: string };
        wida: { name: string; description: string };
      };
    };
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
    /** Opens the CRIS golf online application form directly (admissionsFormUrl) */
    applyOnlineButton: string;
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
    /** Left-column header for the fee matrix */
    itemizedHeader: string;
    /** Label preceding the currency toggle */
    currencyLabel: string;
    /** Note under the table (annual, per student) */
    annualNote: string;
    /** Shown when an indicative (converted) currency is selected (CNY/THB) */
    indicativeNote: string;
    /**
     * Shown above the fee table: amounts move with the baht exchange rate.
     * Not rendered for th — Thai families pay in baht, so there is no
     * conversion for them to account for.
     */
    exchangeRateNote: string;
    /** Itemized fee row labels + the total-row label */
    categories: {
      tuition: string;
      golfProgram: string;
      golfLesson: string;
      dormitory: string;
      total: string;
    };
    /** Sub-notes shown under specific fee rows */
    notes: {
      golfProgram: string;
      dormitory: string;
    };
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
    /** Call-to-action under the play button when a real video is available */
    videoPlay: string;
    /** Captions / accessible titles for the gallery videos */
    videoTitles: {
      cris: string;
      happyCity: string;
    };
    /** Section labels for the photo groups */
    categories: {
      junior: string;
      intermediate: string;
      advanced: string;
      general: string;
    };
    /**
     * Descriptive alt text for each gallery photo, keyed by a stable slug
     * (see galleryPhotos[].altKey in config/links.ts). Also reused for the
     * grade-level photos on the About screen (introductionLevelPhotos).
     * Every image the user sees pulls its alt text from here (§5 / §11).
     */
    photoAlt: {
      juniorSession: string;
      juniorPracticing: string;
      juniorCourse: string;
      intermediateSession: string;
      intermediatePracticing: string;
      intermediateCourse: string;
      intermediateTraining: string;
      advancedSession: string;
      advancedPracticing: string;
      advancedCourse: string;
      advancedTraining: string;
      advancedStudents: string;
      classPutt: string;
      classSwingGuidance: string;
      classDrivingRange: string;
      classTeeOff: string;
      classFairway: string;
      classGroup: string;
      classSwingCoaching: string;
      classPuttingGreen: string;
      classCoaching: string;
    };
    /** Accessible labels for the full-screen photo viewer (lightbox) */
    lightbox: {
      /** aria-label naming the viewer dialog itself ("Photo viewer") */
      dialogLabel: string;
      /** aria-label for the tappable photo tile ("View photo") */
      open: string;
      /** aria-label for the close (X) button */
      close: string;
      /** aria-label for the previous-photo button */
      previous: string;
      /** aria-label for the next-photo button */
      next: string;
    };
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
