/**
 * Web App Manifest — subphase 1F PWA layer.
 *
 * Uses Next.js App Router's MetadataRoute.Manifest API so the manifest is
 * generated at build time as /manifest.webmanifest and referenced automatically
 * in the exported static HTML.  This is the cleanest approach for static export
 * (output: "export") + App Router — no manual <link rel="manifest"> needed
 * in layout.tsx, Next.js wires it automatically.
 *
 * "force-static" is required for the manifest route when using output: "export".
 * Without it, Next.js 16 throws "export const dynamic not configured" at build.
 *
 * Color choices:
 *   theme_color    = BRAND_NAVY (#0c4a6e — matches AppHeader / cris-navy token)
 *   background_color = #ffffff (white — matches body background)
 *
 * Icons reference the placeholder set in /public/icons/ created in this same
 * subphase.  // 1G/asset: swap placeholder icons with real CRIS Golf logo here.
 */

// Required for output: "export" — tells Next.js to statically render this route.
export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { BRAND_NAVY } from "@/config/theme";

export default function manifest(): MetadataRoute.Manifest {
  // Typed against Next's own icon member type so the "any" / "maskable"
  // purpose literals are checked against the real union — no casts needed.
  const icons: MetadataRoute.Manifest["icons"] = [
    {
      src: "/icons/icon-192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/icons/icon-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/icons/icon-512-maskable.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ];

  return {
    name: "CRIS Golf Program",
    short_name: "CRIS Golf",
    description: "Chiang Rai International School – Golf Program",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "en",
    theme_color: BRAND_NAVY,
    background_color: "#ffffff",
    categories: ["education", "sports"],
    icons,
  };
}
