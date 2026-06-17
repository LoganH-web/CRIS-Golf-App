import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: generates a fully self-contained out/ directory for Vercel
  // and the Phase 2 native shell. No server-side runtime required.
  output: "export",
};

export default nextConfig;
