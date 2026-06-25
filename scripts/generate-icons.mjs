/**
 * generate-icons.mjs — PWA icon generator (real CRIS Golf logo)
 *
 * Creates the CRIS Golf Program PWA icon set from the school-approved logo.
 * Run:  node scripts/generate-icons.mjs
 *
 * Sources (assets/brand/, NOT served — build inputs only):
 *   alternativeB.png — minimalist gold "wing + golf ball" mark on a navy
 *                      rounded square (white surround). Used for the APP ICONS
 *                      because it stays legible down to ~48px.
 *   primary.png      — full eagle crest on full-bleed navy. Used for the larger
 *                      in-app brand logo (home hero) and the iOS splash
 *                      (see generate-splash.mjs).
 *
 * Output:
 *   public/icons/icon-192.png            — 192×192 (manifest "any")
 *   public/icons/icon-512.png            — 512×512 (manifest "any")
 *   public/icons/icon-512-maskable.png   — 512×512 with safe-zone padding (maskable)
 *   public/icons/apple-touch-icon.png    — 180×180 (iOS "Add to Home Screen")
 *   public/brand/logo.png                — 256×256 crest for the in-app home hero
 *
 * How alternativeB is processed: the source has a white margin around a navy
 * rounded square (the central 616×616 of the 1024 canvas). We mask out
 * everything outside that rounded square so the white (and the rounded corners)
 * become transparent, then composite the mark onto a full-bleed navy canvas
 * whose colour matches the mark's own navy (#063e5c) — giving a seamless,
 * full-bleed square icon that the OS can mask/round itself.
 */

import sharp from "sharp";
import { mkdir } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const brandDir = join(__dirname, "..", "assets", "brand");
const iconsDir = join(__dirname, "..", "public", "icons");
const brandOutDir = join(__dirname, "..", "public", "brand");

await mkdir(iconsDir, { recursive: true });
await mkdir(brandOutDir, { recursive: true });

// Navy that matches the alternativeB mark's own background, so the composited
// canvas is seamless. (Sampled from the source; close to BRAND_NAVY #0c4a6e.)
const MARK_NAVY = "#063e5c";

// Geometry of the navy rounded square inside alternativeB.png (1024×1024):
// it occupies the central 616×616 region. A generous corner radius ensures all
// white is masked away (over-rounding just reveals more navy — harmless).
const SRC = join(brandDir, "alternativeB.png");
const SQUARE = { left: 204, top: 204, size: 616, radius: 140 };

/**
 * Return the gold mark on a transparent background (white surround + rounded
 * corners removed), at its native 616×616 size.
 */
async function extractMark() {
  const square = await sharp(SRC)
    .extract({ left: SQUARE.left, top: SQUARE.top, width: SQUARE.size, height: SQUARE.size })
    .png()
    .toBuffer();

  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${SQUARE.size}" height="${SQUARE.size}">
       <rect width="${SQUARE.size}" height="${SQUARE.size}" rx="${SQUARE.radius}" ry="${SQUARE.radius}" fill="#fff"/>
     </svg>`
  );

  // dest-in: keep the mark only where the rounded-rect mask is opaque.
  return sharp(square)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

/**
 * Build a full-bleed navy icon: the mark, scaled to `markFraction` of the
 * canvas, centered on a MARK_NAVY background, output at `outSize`.
 */
async function buildIcon(mark, outSize, markFraction, outPath) {
  // Build directly at outSize: the mark is resized to markPx (<= outSize) and
  // composited onto a same-size canvas. (Compositing must never be larger than
  // the base — and sharp resizes the base before compositing, so we avoid a
  // post-composite resize entirely.)
  const markPx = Math.round(outSize * markFraction);
  const resized = await sharp(mark).resize(markPx, markPx).toBuffer();

  await sharp({
    create: { width: outSize, height: outSize, channels: 4, background: MARK_NAVY },
  })
    .composite([{ input: resized, gravity: "center" }])
    .png()
    .toFile(outPath);

  console.log(`  created: ${outPath} (${outSize}x${outSize})`);
}

console.log("Generating CRIS Golf Program PWA icons from the real logo...");

const mark = await extractMark();

// Standard icons: mark fills ~86% of the frame (prominent, full-bleed navy).
await buildIcon(mark, 192, 0.86, join(iconsDir, "icon-192.png"));
await buildIcon(mark, 512, 0.86, join(iconsDir, "icon-512.png"));
await buildIcon(mark, 180, 0.86, join(iconsDir, "apple-touch-icon.png"));

// Maskable icon: mark fits within the safe zone (~60%) so adaptive masks
// (circle/squircle) never clip it.
await buildIcon(mark, 512, 0.6, join(iconsDir, "icon-512-maskable.png"));

// In-app brand logo for the home hero — the full eagle crest (primary.png),
// already full-bleed navy and square. 256px is enough for an 80px hero slot @3×.
await sharp(join(brandDir, "primary.png"))
  .resize(256, 256)
  .png()
  .toFile(join(brandOutDir, "logo.png"));
console.log(`  created: ${join(brandOutDir, "logo.png")} (256x256)`);

console.log("Done. Icons → public/icons/, in-app logo → public/brand/logo.png");
