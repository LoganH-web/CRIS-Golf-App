/**
 * [locale] nested layout — app shell for all six locale-prefixed screens.
 *
 * This layout:
 *   1. Validates the [locale] URL segment (redirects unknown values to /en).
 *   2. Loads the correct dictionary for the locale.
 *   3. Provides LocaleProvider (makes locale available to client components).
 *   4. Renders AppHeader, ContactFooter, and BottomTabBar with translated strings.
 *
 * Note: <html> and <body> live in the root app/layout.tsx (Next.js App Router
 * requirement). The <html lang> attribute is updated client-side via the
 * HtmlLangSync component also in the root layout.
 *
 * generateStaticParams ensures all four locales are pre-rendered at build time,
 * satisfying the static export requirement (output: "export").
 */

import { redirect } from "next/navigation";
import { getDictionary } from "@/i18n/getDictionary";
import { isValidLocale } from "@/i18n/detectLocale";
import { LOCALES } from "@/i18n/types";
import type { Locale } from "@/i18n/types";
import { LocaleProvider } from "@/context/LocaleContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { ContactFooter } from "@/components/layout/ContactFooter";
import type { Metadata } from "next";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams(): Promise<Array<{ locale: string }>> {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale: Locale = isValidLocale(locale) ? locale : "en";
  const dict = getDictionary(resolvedLocale);
  return {
    title: dict.meta.appName,
    description: dict.meta.tagline,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps): Promise<React.ReactElement> {
  const { locale } = await params;

  // Redirect unknown locale segments to English
  if (!isValidLocale(locale)) {
    redirect("/en");
  }

  const dict = getDictionary(locale);

  return (
    <LocaleProvider locale={locale}>
      <AppHeader dict={dict} />

      {/*
       * Page content. Reserve space so the fixed BottomTabBar never overlaps
       * screen content: its 4rem (h-16) row plus the iOS home-indicator safe
       * area the bar now pads into. Inset is 0 where absent (Android/desktop).
       */}
      <div className="flex flex-1 flex-col pb-[calc(4rem+env(safe-area-inset-bottom))]">
        {children}
        <ContactFooter dict={dict} locale={locale} />
      </div>

      <BottomTabBar dict={dict} />
    </LocaleProvider>
  );
}
