/**
 * generate-qr.mjs — QR code generator for the CRIS Golf Program app (subphase 1G)
 *
 * §7 (Option A): The QR code encodes the app's canonical URL. Scanning it on
 * any device opens the URL in the browser, where the user is redirected to
 * their device language and can "Add to Home Screen".
 *
 * In Phase 2 (native store release), Android App Links / iOS Universal Links
 * will be added so the QR opens the *installed native app* directly, with a
 * fallback to the store download page.
 *
 * CURRENTLY ENCODED URL:
 *   https://cris-golf-app.vercel.app
 *
 * HOW TO REGENERATE (e.g. when the custom subdomain app.cris.ac.th is set up):
 *   1. Update `canonicalSiteUrl` in config/links.ts to the new URL.
 *   2. Run:  node scripts/generate-qr.mjs
 *   3. The files in public/qr/ will be regenerated with the new URL.
 *   4. Reprint / redistribute the QR code materials.
 *
 * Output:
 *   public/qr/cris-golf-qr.svg   — crisp vector QR code (preferred for printing)
 *   public/qr/cris-golf-qr.png   — high-resolution PNG fallback (1024×1024 px)
 *
 * Dependencies: qrcode (devDependency — build-time only, NOT shipped to browser)
 *
 * Privacy: this script is a one-time local build tool. It makes NO runtime
 * network calls and introduces NO third-party code into the app bundle.
 */

import QRCode from "qrcode";
import { createWriteStream, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Canonical URL (sourced from config/links.ts conceptually; hard-coded here
//     so this script has zero build-tool dependencies and runs with plain Node) ─
//
// SUBDOMAIN UPGRADE: when app.cris.ac.th is set up, change this to:
//   const ENCODED_URL = "https://app.cris.ac.th";
// Then re-run this script and reprint the QR materials.
const ENCODED_URL = "https://cris-golf-app.vercel.app";

const outDir = join(__dirname, "..", "public", "qr");
mkdirSync(outDir, { recursive: true });

const svgPath = join(outDir, "cris-golf-qr.svg");
const pngPath = join(outDir, "cris-golf-qr.png");

// ─── QR configuration ─────────────────────────────────────────────────────────
const qrOptions = {
  errorCorrectionLevel: "M", // "M" = ~15% data restoration; good balance of
                             //        density vs. print resilience. Use "H" if
                             //        the QR will be printed very small.
  margin: 4,                 // Quiet zone (modules). 4 is the QR spec minimum.
  color: {
    dark: "#0c4a6e",         // CRIS sky-900 — matches app header / theme color
    light: "#ffffff",        // White background
  },
};

// ─── Generate SVG ─────────────────────────────────────────────────────────────
const svgString = await QRCode.toString(ENCODED_URL, {
  ...qrOptions,
  type: "svg",
  width: 400, // viewBox units — SVG is resolution-independent
});

const svgStream = createWriteStream(svgPath, { encoding: "utf8" });
svgStream.write(svgString);
svgStream.end();
await new Promise((resolve, reject) => {
  svgStream.on("finish", resolve);
  svgStream.on("error", reject);
});
console.log(`  created SVG: ${svgPath}`);

// ─── Generate PNG (1024×1024) ──────────────────────────────────────────────────
await QRCode.toFile(pngPath, ENCODED_URL, {
  ...qrOptions,
  width: 1024, // High-res PNG — suitable for print materials at any reasonable size
  type: "png",
});
console.log(`  created PNG: ${pngPath}`);

console.log(`
QR code generation complete.
  Encoded URL : ${ENCODED_URL}
  SVG output  : public/qr/cris-golf-qr.svg  (use for print — crisp at any size)
  PNG output  : public/qr/cris-golf-qr.png  (1024x1024 px — fallback)

To update the URL: edit ENCODED_URL in this file (or canonicalSiteUrl in
config/links.ts), then re-run:  node scripts/generate-qr.mjs
`);
