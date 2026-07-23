/**
 * AppHeader — persistent top bar: app name + working language switcher.
 *
 * Updated in subphase 1C:
 *   - Accepts the active locale's Dictionary so the app name is translated.
 *   - Renders the real <LanguageSwitcher /> (replaces the 1B disabled placeholder).
 *
 * Branding assets (logo image) still land in 1D.
 */

import type { Dictionary } from "@/i18n/types";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface AppHeaderProps {
  dict: Dictionary;
}

export function AppHeader({ dict }: AppHeaderProps): React.ReactElement {
  return (
    /*
     * pt-[env(safe-area-inset-top)] extends the white header background up into
     * the iOS status-bar area so the bar content (in the h-14 inner row) never
     * collides with the clock/wifi/battery. On devices with no inset (Android,
     * desktop, browsers) the inset is 0 and this is a no-op.
     */
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white px-4 shadow-sm pt-[env(safe-area-inset-top)]">
      <div className="flex h-14 items-center justify-between">
        {/* App name / wordmark — logo image replaces this in 1D */}
        <span className="text-base font-semibold tracking-tight text-cris-navy">
          {dict.header.appName}
        </span>

        {/* Working language switcher — EN / KO / ZH-Hans / TH */}
        <LanguageSwitcher
          triggerLabel={dict.header.langSwitcherLabel}
          listboxLabel={dict.header.listboxLabel}
        />
      </div>
    </header>
  );
}
