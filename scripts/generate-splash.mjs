/**
 * generate-splash.mjs — subphase 1G follow-up: iOS startup-image generator
 *
 * Creates `<link rel="apple-touch-startup-image">` splash screens for every
 * common iPhone and iPad model (portrait + landscape).  iOS ignores the web
 * manifest for splash images — it requires one PNG per device resolution,
 * each served from a <link> tag with a matching `media` query in the HTML.
 *
 * Run once:  node scripts/generate-splash.mjs
 *
 * // 1G/asset: this script uses the same SVG source as generate-icons.mjs
 *             (the "CG" placeholder monogram on BRAND_NAVY background).
 *             When the real CRIS Golf logo is delivered, update buildSvg()
 *             in BOTH generate-icons.mjs AND this file, then re-run both
 *             scripts to regenerate all icon + splash assets.  The brand mark
 *             logic is intentionally duplicated (not shared) so each script
 *             remains independently runnable.
 *
 * Output directory: public/icons/splash/
 *
 * Design:
 *   - Background: BRAND_NAVY (#0c4a6e) — matches the app icon and AppHeader.
 *   - Logo: centred "CG" monogram, sized proportionally to the shortest edge.
 *   - The `background_color` in app/manifest.ts is #ffffff (manifest convention),
 *     but for the splash iOS renders the *icon* background, so we use the icon
 *     background colour (#0c4a6e) rather than white to avoid a jarring white flash.
 *
 * Media query format (required by iOS Safari):
 *   (device-width: Wpx) and (device-height: Hpx)
 *   and (-webkit-device-pixel-ratio: R)
 *   and (orientation: portrait|landscape)
 *
 * Reference: https://developer.apple.com/design/human-interface-guidelines/
 *            (Search "Launch Screen" under iOS/iPadOS)
 */

import sharp from "sharp";
import { mkdir } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "icons", "splash");

await mkdir(outDir, { recursive: true });

// Brand navy — must stay in sync with config/theme.ts and generate-icons.mjs
const BRAND_NAVY = "#0c4a6e";

/**
 * iOS device table.
 *
 * Each entry maps to the CSS logical resolution (device-width × device-height
 * in CSS points) and the device-pixel-ratio for the media query.  The actual
 * PNG pixel dimensions are (cssW * dpr) × (cssH * dpr).
 *
 * Sources:
 *   - Apple HIG launch-screen specs
 *   - https://appsco.pe/developer/splash-screens
 *
 * Fields:
 *   label      — human-readable model group (for filenames / comments)
 *   cssW       — CSS device-width  (points) — *shorter* edge used as width
 *   cssH       — CSS device-height (points) — *longer*  edge
 *   dpr        — -webkit-device-pixel-ratio
 */
const DEVICES = [
  // ─── iPhones ───────────────────────────────────────────────────────────────
  // iPhone SE (1st gen) / iPod touch 7th gen — 320×568 @2×
  { label: "iphone-se1",      cssW: 320, cssH: 568,  dpr: 2 },
  // iPhone 8 / 7 / 6s / 6 — 375×667 @2×
  { label: "iphone-8",        cssW: 375, cssH: 667,  dpr: 2 },
  // iPhone 8 Plus / 7 Plus / 6s Plus / 6 Plus — 414×736 @3×
  { label: "iphone-8-plus",   cssW: 414, cssH: 736,  dpr: 3 },
  // iPhone X / XS / 11 Pro / 12 mini / 13 mini — 375×812 @3×
  { label: "iphone-x",        cssW: 375, cssH: 812,  dpr: 3 },
  // iPhone XS Max / 11 Pro Max — 414×896 @3×
  { label: "iphone-xs-max",   cssW: 414, cssH: 896,  dpr: 3 },
  // iPhone XR / 11 — 414×896 @2×
  { label: "iphone-xr",       cssW: 414, cssH: 896,  dpr: 2 },
  // iPhone 12 / 12 Pro / 13 / 13 Pro / 14 — 390×844 @3×
  { label: "iphone-12",       cssW: 390, cssH: 844,  dpr: 3 },
  // iPhone 12 Pro Max / 13 Pro Max / 14 Plus — 428×926 @3×
  { label: "iphone-12-max",   cssW: 428, cssH: 926,  dpr: 3 },
  // iPhone 14 Pro — 393×852 @3×
  { label: "iphone-14-pro",   cssW: 393, cssH: 852,  dpr: 3 },
  // iPhone 14 Pro Max / 15 Plus / 16 Plus — 430×932 @3×
  { label: "iphone-14-pro-max", cssW: 430, cssH: 932, dpr: 3 },
  // iPhone 15 / 15 Pro / 16 / 16 Pro — 393×852 @3× (same logical as 14 Pro)
  // Covered by iphone-14-pro entry above.
  // iPhone 15 Pro Max / 16 Pro Max — 440×956 @3×
  { label: "iphone-15-pro-max", cssW: 440, cssH: 956, dpr: 3 },
  // iPhone SE (2nd & 3rd gen) — 375×667 @2× (same as iPhone 8)
  // Covered by iphone-8 entry above.

  // ─── iPads ─────────────────────────────────────────────────────────────────
  // iPad mini 4 / Air 2 / 9.7" — 768×1024 @2×
  { label: "ipad-97",         cssW: 768, cssH: 1024, dpr: 2 },
  // iPad Pro 10.5" / Air 3rd gen — 834×1112 @2×
  { label: "ipad-10-5",       cssW: 834, cssH: 1112, dpr: 2 },
  // iPad Pro 11" (all gens) / Air 4th–5th gen — 834×1194 @2×
  { label: "ipad-11",         cssW: 834, cssH: 1194, dpr: 2 },
  // iPad Pro 12.9" (2nd gen+) — 1024×1366 @2×
  { label: "ipad-12-9",       cssW: 1024, cssH: 1366, dpr: 2 },
  // iPad (10th gen) — 820×1180 @2×
  { label: "ipad-10th",       cssW: 820, cssH: 1180, dpr: 2 },
  // iPad mini 6th gen — 744×1133 @2×
  { label: "ipad-mini-6",     cssW: 744, cssH: 1133, dpr: 2 },
];

/**
 * Build an SVG splash canvas at the given pixel dimensions.
 *
 * // 1G/asset: When the real CRIS logo arrives, replace the inline SVG here.
 *             Keep the outer canvas size parameters — only the inner artwork changes.
 *
 * @param {number} pxW  — canvas pixel width
 * @param {number} pxH  — canvas pixel height
 * @returns {string} SVG source
 */
function buildSplashSvg(pxW, pxH) {
  const cx = pxW / 2;
  const cy = pxH / 2;

  // Logo sizing: base it on the shorter edge so it fits both portrait/landscape.
  const shorter = Math.min(pxW, pxH);
  const logoSize = Math.round(shorter * 0.28);   // logo occupies 28% of shorter edge
  const fontSize = Math.round(logoSize * 0.42);
  const letterSpacing = Math.round(fontSize * 0.04);

  // Golf ball below the monogram
  const ballRadius = Math.round(logoSize * 0.08);
  const ballY = cy + Math.round(logoSize * 0.33);

  // Dimples
  const dimpleR = Math.max(1, Math.round(ballRadius * 0.18));
  const dimpleOffset = Math.round(ballRadius * 0.38);

  // Monogram baseline — centred slightly above golf ball
  const textY = cy + Math.round(logoSize * 0.08);

  // Tagline
  const tagFontSize = Math.max(10, Math.round(logoSize * 0.12));
  const tagY = cy - Math.round(logoSize * 0.46);

  // Horizontal rules
  const ruleW = logoSize * 0.56;
  const ruleH = Math.max(1, Math.round(shorter * 0.003));
  const ruleRx = Math.max(1, Math.round(shorter * 0.0015));
  const ruleTopY = cy - Math.round(logoSize * 0.44);
  const ruleBotY = ballY + ballRadius + Math.round(shorter * 0.009);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${pxW}" height="${pxH}" viewBox="0 0 ${pxW} ${pxH}">
  <!-- Full-bleed background — matches BRAND_NAVY (#0c4a6e) from config/theme.ts -->
  <rect width="${pxW}" height="${pxH}" fill="${BRAND_NAVY}"/>

  <!-- Subtle radial vignette for depth (matches generate-icons.mjs) -->
  <defs>
    <radialGradient id="vignette" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#1e6a9a" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="${BRAND_NAVY}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${pxW}" height="${pxH}" fill="url(#vignette)"/>

  <!-- Thin white rule above monogram -->
  <rect x="${cx - ruleW / 2}" y="${ruleTopY}" width="${ruleW}" height="${ruleH}" rx="${ruleRx}" fill="rgba(255,255,255,0.4)"/>

  <!-- "CRIS GOLF" tagline -->
  <text
    x="${cx}"
    y="${tagY}"
    text-anchor="middle"
    dominant-baseline="auto"
    font-family="'Arial', 'Helvetica Neue', sans-serif"
    font-size="${tagFontSize}"
    font-weight="600"
    letter-spacing="${Math.round(tagFontSize * 0.18)}"
    fill="rgba(255,255,255,0.6)"
  >CRIS GOLF</text>

  <!-- "CG" monogram — primary brand mark -->
  <text
    x="${cx}"
    y="${textY}"
    text-anchor="middle"
    dominant-baseline="middle"
    font-family="'Arial', 'Helvetica Neue', sans-serif"
    font-size="${fontSize}"
    font-weight="700"
    letter-spacing="${letterSpacing}"
    fill="#ffffff"
  >CG</text>

  <!-- Golf ball -->
  <circle cx="${cx}" cy="${ballY}" r="${ballRadius}" fill="#ffffff"/>
  <!-- Dimples -->
  <circle cx="${cx - dimpleOffset}" cy="${ballY - dimpleOffset}" r="${dimpleR}" fill="rgba(0,0,0,0.12)"/>
  <circle cx="${cx + dimpleOffset}" cy="${ballY - dimpleOffset}" r="${dimpleR}" fill="rgba(0,0,0,0.12)"/>
  <circle cx="${cx}"              cy="${ballY + dimpleOffset}" r="${dimpleR}" fill="rgba(0,0,0,0.12)"/>

  <!-- Thin white rule below golf ball -->
  <rect x="${cx - ruleW / 2}" y="${ruleBotY}" width="${ruleW}" height="${ruleH}" rx="${ruleRx}" fill="rgba(255,255,255,0.4)"/>
</svg>`;
}

/**
 * Render SVG → PNG at exact pixel dimensions.
 */
async function generatePng(svgSource, outputPath, pxW, pxH) {
  await sharp(Buffer.from(svgSource))
    .resize(pxW, pxH)
    .png()
    .toFile(outputPath);
  console.log(`  created: ${outputPath} (${pxW}x${pxH})`);
}

console.log("Generating CRIS Golf Program iOS startup images...");
console.log("// 1G/asset: replace buildSplashSvg() with real CRIS logo artwork when delivered.");

// Collect generated metadata for use in layout.tsx link tags
const generated = [];

for (const device of DEVICES) {
  const { label, cssW, cssH, dpr } = device;

  // Portrait
  const pW = cssW * dpr;
  const pH = cssH * dpr;
  const portraitFile = `splash-${label}-portrait.png`;
  await generatePng(buildSplashSvg(pW, pH), join(outDir, portraitFile), pW, pH);
  generated.push({
    href: `/icons/splash/${portraitFile}`,
    media: `(device-width: ${cssW}px) and (device-height: ${cssH}px) and (-webkit-device-pixel-ratio: ${dpr}) and (orientation: portrait)`,
  });

  // Landscape (swap W/H)
  const lW = cssH * dpr;
  const lH = cssW * dpr;
  const landscapeFile = `splash-${label}-landscape.png`;
  await generatePng(buildSplashSvg(lW, lH), join(outDir, landscapeFile), lW, lH);
  generated.push({
    href: `/icons/splash/${landscapeFile}`,
    media: `(device-width: ${cssH}px) and (device-height: ${cssW}px) and (-webkit-device-pixel-ratio: ${dpr}) and (orientation: landscape)`,
  });
}

console.log("\nDone. Splash images written to public/icons/splash/");
console.log(`\nGenerated ${generated.length} splash entries (portrait + landscape):\n`);

// Print the <link> tags for reference / copy-paste into layout.tsx
for (const entry of generated) {
  console.log(`  <link rel="apple-touch-startup-image" media="${entry.media}" href="${entry.href}" />`);
}
