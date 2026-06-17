"use client";

/**
 * BottomTabBar — persistent bottom navigation for the six core screens.
 *
 * WHY bottom tabs rather than a header hamburger menu:
 * This app is opened via QR scan on a mobile phone. Bottom tabs are reachable
 * with one thumb, match the iOS/Android native app pattern the Phase 2 native
 * shell will wrap, and make all six destinations immediately visible without a
 * tap to open a menu. This layout decision aligns with §4 (PWA-first, native
 * shell additive) and §9 (store-approval requires content to render inside the app).
 *
 * Active state: the current route path is highlighted with a sky-blue icon and
 * label so the user always knows which screen they are on.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS } from "@/config/navigation";
import { NavIcon } from "@/components/ui/NavIcon";

export function BottomTabBar(): React.ReactElement {
  const currentPathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-stretch border-t border-slate-200 bg-white"
    >
      {NAVIGATION_ITEMS.map((navigationItem) => {
        const isActive = currentPathname === navigationItem.path;

        return (
          <Link
            key={navigationItem.path}
            href={navigationItem.path}
            aria-label={navigationItem.accessibleLabel}
            aria-current={isActive ? "page" : undefined}
            className={[
              "flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
              isActive
                ? "text-sky-700"
                : "text-slate-500 hover:text-slate-700",
            ].join(" ")}
          >
            <NavIcon iconName={navigationItem.iconName} isActive={isActive} />
            <span>{navigationItem.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
