import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: generates a fully self-contained out/ directory for Vercel
  // and the Phase 2 native shell. No server-side runtime required.
  output: "export",

  // Static export has no server-side image optimizer, so next/image must run
  // unoptimized — files (incl. AVIF) are served exactly as placed in /public.
  // AVIF is supported by all browsers this PWA targets (iOS Safari 16+,
  // Chrome, Firefox) and is much smaller than JPEG for the gallery photos.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
