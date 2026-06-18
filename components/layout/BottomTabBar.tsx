"use client";

/**
 * BottomTabBar — persistent bottom navigation for the six core screens.
 *
 * Updated in subphase 1C:
 *   - Accepts the active locale's Dictionary for translated tab labels.
 *   - Uses getLocaleNavItems(locale) so paths are locale-prefixed.
 *   - Active-tab detection uses pathname after stripping the locale prefix.
 *
 * WHY bottom tabs (unchanged rationale from 1B):
 * Opened via QR scan on mobile — bottom tabs are reachable with one thumb,
 * match iOS/Android native patterns the Phase 2 shell will wrap, and make
 * all six destinations immediately visible.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLocaleNavItems } from "@/config/navigation";
import { NavIcon } from "@/components/ui/NavIcon";
import { useLocale } from "@/context/LocaleContext";
import type { Dictionary } from "@/i18n/types";

interface BottomTabBarProps {
  dict: Dictionary;
}

export function BottomTabBar({ dict }: BottomTabBarProps): React.ReactElement {
  const currentPathname = usePathname();
  const locale = useLocale();
  const navItems = getLocaleNavItems(locale);

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-stretch border-t border-slate-200 bg-white"
    >
      {navItems.map((item) => {
        const isActive = currentPathname === item.path;
        const label = dict.nav[item.labelKey];
        const accessibleLabel = dict.nav[item.accessibleLabelKey];

        return (
          <Link
            key={item.path}
            href={item.path}
            aria-label={accessibleLabel}
            aria-current={isActive ? "page" : undefined}
            className={[
              "flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
              isActive
                ? "text-sky-700"
                : "text-slate-500 hover:text-slate-700",
            ].join(" ")}
          >
            <NavIcon iconName={item.iconName} isActive={isActive} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
