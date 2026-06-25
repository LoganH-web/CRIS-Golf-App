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
 * Source: assets/brand/primary.png — the full CRIS Golf eagle crest on
 *         full-bleed navy. Composited centered on a BRAND_NAVY canvas at each
 *         device resolution. (To change the splash art, replace primary.png
 *         and re-run.)
 *
 * Output directory: public/icons/splash/
 *
 * Design:
 *   - Background: BRAND_NAVY (#0c4a6e) — matches the app icon and AppHeader.
 *   - Logo: centred eagle crest, sized to ~50% of the shortest edge.
 *   - The `background_color` in app/manifest.ts is #ffffff (manifest convention),
 *     but for the splash iOS renders the *icon* background, so we use the navy
 *     background (#0c4a6e) rather than white to avoid a jarring white flash.
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
const SRC = join(__dirname, "..", "assets", "brand", "primary.png");

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
 * The crest art (max gold radius ~389 of the 512 half-canvas) carries a navy
 * vignette background. Compositing that square straight onto the navy canvas
 * leaves a faint square seam. So we feather a circular alpha mask just outside
 * the artwork (~r=410): the crest's navy fades to transparent and blends
 * invisibly into the canvas navy, leaving only the gold crest visible.
 * Built once and reused for every device.
 */
async function buildCrest() {
  const src = await sharp(SRC).ensureAlpha().png().toBuffer();
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
       <defs>
         <radialGradient id="g" cx="50%" cy="50%" r="50%">
           <stop offset="0" stop-color="#fff"/>
           <stop offset="0.78" stop-color="#fff"/>
           <stop offset="0.83" stop-color="#fff" stop-opacity="0"/>
         </radialGradient>
       </defs>
       <rect width="1024" height="1024" fill="url(#g)"/>
     </svg>`
  );
  return sharp(src).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
}

/**
 * Render a splash PNG: the feathered eagle crest centered on a BRAND_NAVY
 * canvas at the exact device pixel dimensions. The crest is sized to ~50% of
 * the shorter edge so it sits comfortably in both portrait and landscape.
 *
 * @param {Buffer} crestSrc  — pre-masked crest (from buildCrest)
 * @param {string} outputPath
 * @param {number} pxW  — canvas pixel width
 * @param {number} pxH  — canvas pixel height
 */
async function generateSplash(crestSrc, outputPath, pxW, pxH) {
  const crestPx = Math.round(Math.min(pxW, pxH) * 0.5);
  const crest = await sharp(crestSrc).resize(crestPx, crestPx).toBuffer();

  await sharp({
    create: { width: pxW, height: pxH, channels: 4, background: BRAND_NAVY },
  })
    .composite([{ input: crest, gravity: "center" }])
    .png()
    .toFile(outputPath);

  console.log(`  created: ${outputPath} (${pxW}x${pxH})`);
}

console.log("Generating CRIS Golf Program iOS startup images from the real logo...");

const CREST = await buildCrest();

// Collect generated metadata for use in layout.tsx link tags
const generated = [];

for (const device of DEVICES) {
  const { label, cssW, cssH, dpr } = device;

  // Portrait
  const pW = cssW * dpr;
  const pH = cssH * dpr;
  const portraitFile = `splash-${label}-portrait.png`;
  await generateSplash(CREST, join(outDir, portraitFile), pW, pH);
  generated.push({
    href: `/icons/splash/${portraitFile}`,
    media: `(device-width: ${cssW}px) and (device-height: ${cssH}px) and (-webkit-device-pixel-ratio: ${dpr}) and (orientation: portrait)`,
  });

  // Landscape (swap W/H)
  const lW = cssH * dpr;
  const lH = cssW * dpr;
  const landscapeFile = `splash-${label}-landscape.png`;
  await generateSplash(CREST, join(outDir, landscapeFile), lW, lH);
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
