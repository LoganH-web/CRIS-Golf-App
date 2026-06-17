import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { ContactFooter } from "@/components/layout/ContactFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CRIS Golf Program",
  description: "Chiang Rai International School – Golf Program",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      {/*
       * App shell — persistent across all six screens:
       *   • AppHeader: app name + language-switcher placeholder slot (1C)
       *   • main area: screen content + ContactFooter
       *   • BottomTabBar: fixed bottom navigation between the six screens
       *
       * The body uses a flex-column layout so the content area fills all
       * available height between the sticky header and fixed tab bar.
       */}
      <body className="flex min-h-full flex-col bg-white text-slate-900">
        <AppHeader />

        {/*
         * Page content. pb-16 reserves space so the fixed BottomTabBar
         * (h-16) never overlaps the bottom of screen content.
         */}
        <div className="flex flex-1 flex-col pb-16">
          {children}
          <ContactFooter />
        </div>

        <BottomTabBar />
      </body>
    </html>
  );
}
