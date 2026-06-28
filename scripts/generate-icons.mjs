/**
 * generate-icons.mjs — PWA icon generator (CRIS Golf app logo)
 *
 * Source: assets/brand/app-logo.jpg — the circular CRIS Golf crest (navy badge,
 * gold eagle, golf ball, "GOLF PROGRAM" banner) on a white rounded square.
 * Run:  node scripts/generate-icons.mjs
 *
 * We isolate the crest circle (transparent outside) and composite it on a
 * full-bleed WHITE canvas — matching the logo's white background — so the OS
 * can mask/round the icon itself without leaving the source's pre-baked
 * rounded corners or black corner fill.
 *
 * Output:
 *   public/icons/icon-192.png            — 192×192 (manifest "any")
 *   public/icons/icon-512.png            — 512×512 (manifest "any")
 *   public/icons/icon-512-maskable.png   — 512×512 with safe-zone padding (maskable)
 *   public/icons/apple-touch-icon.png    — 180×180 (iOS "Add to Home Screen")
 *   public/brand/logo.png                — 256×256 crest for the in-app home hero
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

const SRC = join(brandDir, "app-logo.jpg");
const ICON_BG = "#ffffff";

// Crest circle geometry in the 2048² source (measured from the gold ring):
// centered, outer radius ~745px. A few px of margin keeps the ring crisp.
const CIRCLE = { size: 2048, cx: 1024, cy: 1024, r: 748 };

/**
 * Return the crest as a square PNG with everything outside the circle made
 * transparent (the white square, shadow, and black corners are discarded).
 */
async function extractCrest() {
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${CIRCLE.size}" height="${CIRCLE.size}">
       <circle cx="${CIRCLE.cx}" cy="${CIRCLE.cy}" r="${CIRCLE.r}" fill="#fff"/>
     </svg>`
  );
  const masked = await sharp(SRC)
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const left = CIRCLE.cx - CIRCLE.r;
  const top = CIRCLE.cy - CIRCLE.r;
  const side = CIRCLE.r * 2;
  return sharp(masked).extract({ left, top, width: side, height: side }).png().toBuffer();
}

/** Composite the crest at `fraction` of the canvas, centered on white. */
async function buildIcon(crest, outSize, fraction, outPath) {
  const markPx = Math.round(outSize * fraction);
  const resized = await sharp(crest).resize(markPx, markPx).toBuffer();
  await sharp({
    create: { width: outSize, height: outSize, channels: 4, background: ICON_BG },
  })
    .composite([{ input: resized, gravity: "center" }])
    .png()
    .toFile(outPath);
  console.log(`  created: ${outPath} (${outSize}x${outSize})`);
}

console.log("Generating CRIS Golf Program PWA icons from app-logo.jpg...");

const crest = await extractCrest();

// Standard icons: crest fills ~84% of the white frame (OS rounds the corners).
await buildIcon(crest, 192, 0.84, join(iconsDir, "icon-192.png"));
await buildIcon(crest, 512, 0.84, join(iconsDir, "icon-512.png"));
await buildIcon(crest, 180, 0.84, join(iconsDir, "apple-touch-icon.png"));

// Maskable: crest fits within the safe zone (~66%) so adaptive masks never clip it.
await buildIcon(crest, 512, 0.66, join(iconsDir, "icon-512-maskable.png"));

// In-app home-hero logo: crest fills the frame (shown in a round container).
await sharp({ create: { width: 256, height: 256, channels: 4, background: ICON_BG } })
  .composite([{ input: await sharp(crest).resize(256, 256).toBuffer(), gravity: "center" }])
  .png()
  .toFile(join(brandOutDir, "logo.png"));
console.log(`  created: ${join(brandOutDir, "logo.png")} (256x256)`);

console.log("Done. Icons → public/icons/, in-app logo → public/brand/logo.png");
