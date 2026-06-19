import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { HtmlLangSync } from "@/components/HtmlLangSync";
import { PwaRegister } from "@/components/PwaRegister";
import { BRAND_NAVY } from "@/config/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Root metadata — used for the "/" redirect page only.
 * Locale-specific titles/descriptions come from [locale]/layout.tsx.
 *
 * Subphase 1F additions:
 *   - manifest: Next.js App Router wires this automatically from app/manifest.ts
 *   - themeColor: in generateViewport (Next.js 16 requirement — not in metadata)
 *   - appleWebApp: improves iOS "Add to Home Screen" experience (§4 PWA notes)
 *   - icons: apple-touch-icon 180×180 for iOS home-screen icon
 *
 * Note (§4): iOS PWA via "Add to Home Screen" (Safari share sheet) is the
 * iOS install path for the PWA.  The App Store iOS build is Phase 2 only.
 * These meta tags maximise the quality of the iOS "Add to Home Screen" path.
 *
 * // 1G/asset: update apple-touch-icon src to the real CRIS Golf logo.
 */
export const metadata: Metadata = {
  title: "CRIS Golf Program",
  description: "Chiang Rai International School – Golf Program",
  // manifest is auto-linked by Next.js from app/manifest.ts
  manifest: "/manifest.webmanifest",
  // Apple PWA meta tags — improve "Add to Home Screen" on iOS Safari
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CRIS Golf",
  },
  // Apple touch icon — shown on iOS home screen
  icons: {
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

/**
 * Viewport export — Next.js 16 requires themeColor here, not in metadata.
 * Sets the browser chrome colour to the CRIS brand navy on Android/Chrome,
 * matching the AppHeader background.
 */
export const viewport: Viewport = {
  themeColor: BRAND_NAVY,
};

/**
 * Root layout — the single required Next.js App Router root layout.
 *
 * Responsibilities:
 *   - Provides the <html> and <body> elements (required here, not in nested layouts).
 *   - Loads the Geist font variable.
 *   - Renders HtmlLangSync which updates <html lang> client-side to match
 *     the active locale URL segment (so screen-readers and translators see
 *     the correct language code after hydration).
 *   - Renders PwaRegister (subphase 1F) which registers the service worker
 *     client-side after page load.
 *
 * The app shell (header, tabs, footer) lives in app/[locale]/layout.tsx
 * and is not rendered for the root "/" redirect page.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    /*
     * lang defaults to "en" at render time; HtmlLangSync updates it
     * client-side to match the active [locale] URL segment.
     */
    <html
      lang="en"
      dir="ltr"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-slate-900">
        {/* Syncs <html lang> to the active locale from the URL */}
        <HtmlLangSync />
        {/* Registers the service worker for PWA installability + offline (1F) */}
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
