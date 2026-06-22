/**
 * generate-icons.mjs — subphase 1F placeholder icon generator
 *
 * Creates the CRIS Golf Program PWA icon set from an inline SVG.
 * Run once:  node scripts/generate-icons.mjs
 *
 * // 1G/asset: replace the SVG source below with the real CRIS Golf logo
 *             provided by the school, then re-run this script to regenerate
 *             all icon sizes.  Delete this script comment when the real logo
 *             is in place.
 *
 * Output:
 *   public/icons/icon-192.png            — standard 192×192 (manifest "any")
 *   public/icons/icon-512.png            — standard 512×512 (manifest "any")
 *   public/icons/icon-512-maskable.png   — 512×512 with safe-zone padding (manifest "maskable")
 *   public/icons/apple-touch-icon.png    — 180×180 for iOS "Add to Home Screen"
 *
 * Design: sky-900 (#0c4a6e) background, white "CG" monogram + golf-ball dot.
 * Deliberately a clean professional placeholder — the real logo swaps in at 1G.
 */

import sharp from "sharp";
import { mkdir } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "icons");

await mkdir(outDir, { recursive: true });

/**
 * Build the SVG source at a given canvas size.
 * @param {number} size        — total canvas size in px
 * @param {number} padFraction — fraction of size used as padding on each side
 *                              (use 0.1 for standard, 0.2 for maskable safe zone)
 */
function buildSvg(size, padFraction = 0.1) {
  const pad = Math.round(size * padFraction);
  const inner = size - pad * 2; // usable area after padding

  // The letter "CG" sits in the upper two-thirds; a small golf ball sits below.
  // All coordinates relative to the centre of the canvas.
  const cx = size / 2;
  const cy = size / 2;

  // Font metrics — approximate em-square
  const fontSize = Math.round(inner * 0.42);
  const letterSpacing = Math.round(fontSize * 0.04);

  // Golf-ball circle — sits below the monogram
  const ballRadius = Math.round(inner * 0.08);
  const ballY = cy + Math.round(inner * 0.33);

  // Dimple radius (decorative detail — only visible at 512; omit at 192/180)
  const dimpleR = Math.max(1, Math.round(ballRadius * 0.18));
  const dimpleOffset = Math.round(ballRadius * 0.38);

  // Text baseline — centred slightly above the golf ball
  const textY = cy + Math.round(inner * 0.08);

  // Tagline text — tiny, only legible at 512
  const tagFontSize = Math.max(6, Math.round(inner * 0.055));
  const tagY = cy - Math.round(inner * 0.34);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="#0c4a6e"/>

  <!-- Subtle radial vignette for depth -->
  <defs>
    <radialGradient id="vignette" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#1e6a9a" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#0c4a6e" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#vignette)"/>

  <!-- Thin white rule above monogram -->
  <rect x="${cx - inner * 0.28}" y="${cy - inner * 0.44}" width="${inner * 0.56}" height="${Math.max(1, Math.round(size * 0.006))}" rx="${Math.max(1, Math.round(size * 0.003))}" fill="rgba(255,255,255,0.4)"/>

  <!-- "CRIS GOLF" tagline — tiny, gives context at large sizes -->
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
  <!-- Dimples (decorative, only meaningful at 512) -->
  <circle cx="${cx - dimpleOffset}" cy="${ballY - dimpleOffset}" r="${dimpleR}" fill="rgba(0,0,0,0.12)"/>
  <circle cx="${cx + dimpleOffset}" cy="${ballY - dimpleOffset}" r="${dimpleR}" fill="rgba(0,0,0,0.12)"/>
  <circle cx="${cx}"              cy="${ballY + dimpleOffset}" r="${dimpleR}" fill="rgba(0,0,0,0.12)"/>

  <!-- Thin white rule below golf ball -->
  <rect x="${cx - inner * 0.28}" y="${ballY + ballRadius + Math.round(size * 0.018)}" width="${inner * 0.56}" height="${Math.max(1, Math.round(size * 0.006))}" rx="${Math.max(1, Math.round(size * 0.003))}" fill="rgba(255,255,255,0.4)"/>
</svg>`;

  return svg;
}

/**
 * Generate a PNG from SVG source at the given output size.
 */
async function generatePng(svgSource, outputPath, size) {
  await sharp(Buffer.from(svgSource))
    .resize(size, size)
    .png()
    .toFile(outputPath);
  console.log(`  created: ${outputPath} (${size}x${size})`);
}

console.log("Generating CRIS Golf Program placeholder PWA icons...");
console.log("// 1G/asset: replace SVG source with real CRIS Golf logo before launch.");

// Standard icon — 192x192
await generatePng(
  buildSvg(512, 0.1),
  join(outDir, "icon-192.png"),
  192
);

// Standard icon — 512x512
await generatePng(
  buildSvg(512, 0.1),
  join(outDir, "icon-512.png"),
  512
);

// Maskable icon — 512x512 with extra safe-zone padding (20% each side)
// Android adaptive icons crop to a circle/squircle; the safe zone ensures
// the brand mark is never clipped.
await generatePng(
  buildSvg(512, 0.20),
  join(outDir, "icon-512-maskable.png"),
  512
);

// Apple touch icon — 180x180
await generatePng(
  buildSvg(512, 0.1),
  join(outDir, "apple-touch-icon.png"),
  180
);

console.log("Done. Icons written to public/icons/");
