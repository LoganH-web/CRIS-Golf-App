import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { HtmlLangSync } from "@/components/HtmlLangSync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Root metadata — used for the "/" redirect page only.
 * Locale-specific titles/descriptions come from [locale]/layout.tsx.
 */
export const metadata: Metadata = {
  title: "CRIS Golf Program",
  description: "Chiang Rai International School – Golf Program",
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
        {children}
      </body>
    </html>
  );
}
