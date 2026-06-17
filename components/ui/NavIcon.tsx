/**
 * NavIcon — renders a simple SVG icon for a navigation item.
 * Each icon corresponds to one of the six app screens.
 * Icons are intentionally minimal 24×24 outlines; the active screen
 * receives a filled treatment via the `isActive` prop.
 */

import type { NavigationItem } from "@/config/navigation";

interface NavIconProps {
  iconName: NavigationItem["iconName"];
  isActive: boolean;
}

export function NavIcon({ iconName, isActive }: NavIconProps): React.ReactElement {
  const strokeClass = isActive ? "stroke-sky-700" : "stroke-slate-500";
  const sharedProps = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    strokeWidth: isActive ? 2.2 : 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: strokeClass,
    "aria-hidden": true as const,
  };

  switch (iconName) {
    case "home":
      return (
        <svg {...sharedProps}>
          <path d="M3 9.5L12 3l9 6.5V21H3V9.5z" />
          <path d="M9 21V12h6v9" />
        </svg>
      );
    case "introduction":
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      );
    case "admissions":
      return (
        <svg {...sharedProps}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="13" x2="15" y2="13" />
          <line x1="9" y1="17" x2="13" y2="17" />
        </svg>
      );
    case "tuition":
      return (
        <svg {...sharedProps}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M12 10v4M9 12h6" />
        </svg>
      );
    case "gallery":
      return (
        <svg {...sharedProps}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    case "faq":
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
  }
}
