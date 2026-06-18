/**
 * Defines the six core screens and their routes.
 * Routes are now locale-prefixed: `/{locale}` for home, `/{locale}/{screen}` for others.
 *
 * Updated in subphase 1C to support `app/[locale]/` routing.
 * Call `getLocaleNavItems(locale)` to get nav items with the correct paths.
 */

import type { Locale } from "@/i18n/types";

export interface NavigationItem {
  /** Route path (locale-prefixed). */
  path: string;
  /** Dictionary key used to look up the label in the active locale. */
  labelKey: keyof import("@/i18n/types").Dictionary["nav"] & string;
  /** Dictionary key used to look up the accessible label. */
  accessibleLabelKey: keyof import("@/i18n/types").Dictionary["nav"] & string;
  /** SVG icon identifier (matched in NavIcon). */
  iconName: "home" | "introduction" | "admissions" | "tuition" | "gallery" | "faq";
}

/** Screen slugs used in the URL path (empty string = home). */
type ScreenSlug = "" | "introduction" | "admissions" | "tuition" | "gallery" | "faq";

const SCREEN_DEFINITIONS: Array<{
  slug: ScreenSlug;
  labelKey: NavigationItem["labelKey"];
  accessibleLabelKey: NavigationItem["accessibleLabelKey"];
  iconName: NavigationItem["iconName"];
}> = [
  {
    slug: "",
    labelKey: "home",
    accessibleLabelKey: "homeLabel",
    iconName: "home",
  },
  {
    slug: "introduction",
    labelKey: "introduction",
    accessibleLabelKey: "introductionLabel",
    iconName: "introduction",
  },
  {
    slug: "admissions",
    labelKey: "admissions",
    accessibleLabelKey: "admissionsLabel",
    iconName: "admissions",
  },
  {
    slug: "tuition",
    labelKey: "tuition",
    accessibleLabelKey: "tuitionLabel",
    iconName: "tuition",
  },
  {
    slug: "gallery",
    labelKey: "gallery",
    accessibleLabelKey: "galleryLabel",
    iconName: "gallery",
  },
  {
    slug: "faq",
    labelKey: "faq",
    accessibleLabelKey: "faqLabel",
    iconName: "faq",
  },
];

/**
 * Returns navigation items with locale-prefixed paths for use in the
 * BottomTabBar and other navigation components.
 *
 * Home:  /{locale}
 * Other: /{locale}/{slug}
 */
export function getLocaleNavItems(locale: Locale): NavigationItem[] {
  return SCREEN_DEFINITIONS.map(({ slug, labelKey, accessibleLabelKey, iconName }) => ({
    path: slug ? `/${locale}/${slug}` : `/${locale}`,
    labelKey,
    accessibleLabelKey,
    iconName,
  }));
}

/** Returns just the screen slugs (used for generateStaticParams). */
export const SCREEN_SLUGS: ScreenSlug[] = SCREEN_DEFINITIONS.map((d) => d.slug);
