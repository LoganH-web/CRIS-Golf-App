/**
 * Defines the six core screens and their routes.
 * Used by the shell navigation so route paths are never duplicated.
 * 1C will wrap these under a /[locale] prefix — changing this file
 * is the only thing needed at that point.
 */

export interface NavigationItem {
  /** Route path (relative to app root). */
  path: string;
  /** Short label shown in the bottom tab bar. */
  label: string;
  /** Accessible name used for aria-label on the nav item. */
  accessibleLabel: string;
  /** SVG icon identifier (matched in BottomTabBar). */
  iconName: "home" | "introduction" | "admissions" | "tuition" | "gallery" | "faq";
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    path: "/",
    label: "Home",
    accessibleLabel: "Home — CRIS Golf Program landing screen",
    iconName: "home",
  },
  {
    path: "/introduction",
    label: "About",
    accessibleLabel: "School Introduction — about the CRIS Golf Program",
    iconName: "introduction",
  },
  {
    path: "/admissions",
    label: "Admissions",
    accessibleLabel: "Admissions — how to join the program",
    iconName: "admissions",
  },
  {
    path: "/tuition",
    label: "Tuition",
    accessibleLabel: "Tuition and Fees — golf-program fee schedule",
    iconName: "tuition",
  },
  {
    path: "/gallery",
    label: "Gallery",
    accessibleLabel: "Gallery — photos and videos",
    iconName: "gallery",
  },
  {
    path: "/faq",
    label: "FAQ",
    accessibleLabel: "Frequently Asked Questions",
    iconName: "faq",
  },
] as const;
