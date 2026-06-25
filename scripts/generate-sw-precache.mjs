/**
 * generate-sw-precache.mjs — postbuild: generates out/precache-manifest.js
 *
 * Run automatically by the build script AFTER `next build` exports to out/.
 * Command: node scripts/generate-sw-precache.mjs
 *
 * What it does:
 *   1. Reads .next/BUILD_ID (set by Next.js per-build) and uses it as
 *      CACHE_VERSION.  Because BUILD_ID is content-addressed, every deploy
 *      whose output changes gets a new cache key automatically — no more
 *      manual version bumps.
 *   2. Walks out/ and collects every deployable asset as a browser-URL:
 *        out/_next/static/**          → /_next/static/…
 *        out/index.html               → /           (cleanUrls: root)
 *        out/en/introduction.html     → /en/introduction   (cleanUrls strip .html)
 *        out/{locale}/index.html      → /{locale}          (cleanUrls strip index)
 *        out/icons/**                 → /icons/…
 *        out/manifest.webmanifest     → /manifest.webmanifest
 *      Any path already ending in .txt, .map, .json (build artifacts only
 *      consumed by tooling) is excluded.
 *   3. Writes out/precache-manifest.js — a JS file that assigns to
 *      self.__PRECACHE_MANIFEST.  The service worker (public/sw.js) calls
 *      importScripts('/precache-manifest.js') at the top to load it.
 *
 * Privacy (§8): only same-origin first-party assets are collected.  The
 *   walker stays inside out/ so no third-party URLs are ever introduced.
 *
 * cleanUrls mapping (Vercel vercel.json: cleanUrls: true):
 *   - out/index.html              → /
 *   - out/foo/index.html          → /foo
 *   - out/foo/bar.html            → /foo/bar
 *   - all other extensions kept   → as-is (icons, woff2, css, js, etc.)
 */

import { readFileSync, writeFileSync } from "fs";
import { readdir, stat } from "fs/promises";
import { createHash } from "crypto";
import { join, relative, sep } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "out");
const BUILD_ID_PATH = join(ROOT, ".next", "BUILD_ID");
const OUT_MANIFEST = join(OUT_DIR, "precache-manifest.js");

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Recursively collect every file under a directory.
 * @param {string} dir
 * @returns {Promise<string[]>} absolute paths
 */
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walk(full)));
    } else if (entry.isFile()) {
      results.push(full);
    }
  }
  return results;
}

/**
 * Convert an absolute out/ file path to the browser URL path the browser
 * will use to fetch it, respecting Vercel cleanUrls: true.
 *
 * cleanUrls rules (from vercel.json):
 *   index.html at any depth → strip filename (keep trailing slash removed by Vercel)
 *   foo.html at any depth   → strip .html extension
 *   everything else         → path as-is
 *
 * @param {string} absPath  absolute path inside out/
 * @returns {string}  URL starting with /
 */
function toUrl(absPath) {
  // Relative to out/, using forward slashes
  const rel = relative(OUT_DIR, absPath).split(sep).join("/");

  if (rel.endsWith("/index.html")) {
    // e.g. en/index.html → /en
    return "/" + rel.slice(0, -"/index.html".length);
  }
  if (rel === "index.html") {
    // Root index
    return "/";
  }
  if (rel.endsWith(".html")) {
    // e.g. en/introduction.html → /en/introduction
    return "/" + rel.slice(0, -".html".length);
  }
  return "/" + rel;
}

/**
 * Returns true for files that should be excluded from the precache.
 * These are either build-tooling artifacts that browsers never request
 * directly, or Next.js App Router internal RSC payload files that are
 * served through framework-internal routing (not as standalone URLs).
 *
 * @param {string} absPath
 * @returns {boolean}
 */
function shouldExclude(absPath) {
  const rel = relative(OUT_DIR, absPath).split(sep).join("/");

  // Source maps — not fetched by browsers in production
  if (rel.endsWith(".map")) return true;

  // Next.js internal trace/analysis files
  if (rel.endsWith(".nft.json")) return true;

  // The precache manifest itself — SW loads it via importScripts, not cache.add
  if (rel === "precache-manifest.js") return true;

  // Next.js 16 App Router / Turbopack RSC payload files (.txt).
  // These are emitted to out/ as internal routing artifacts for client-side
  // navigation (React Server Components streaming format).  They are NOT
  // standalone browser resources — fetching them directly as a URL would
  // return 404 on Vercel.  Exclude ALL .txt files and any path segment
  // containing "__next." (the internal RSC route naming convention).
  if (rel.endsWith(".txt")) return true;
  if (rel.includes("/__next.") || rel.startsWith("__next.")) return true;

  // 404 page — served by the host on actual 404s, not a navigable URL we
  // want to precache (prefetching /404 or /_not-found as a user destination
  // is unnecessary and would waste cache space / potentially cause confusion).
  if (rel === "404.html" || rel === "_not-found.html") return true;
  if (rel.startsWith("_not-found/")) return true;

  // Gallery photos — deliberately NOT precached, to keep the offline app shell
  // light (see config/links.ts galleryPhotos). The SW's runtime cache-first
  // handler caches each photo after its first online view, so the gallery still
  // works offline once browsed. (Brand/icon/splash assets are NOT excluded —
  // those belong to the shell and must be available on first offline launch.)
  if (rel.startsWith("images/gallery/")) return true;

  return false;
}

// ─── Main ────────────────────────────────────────────────────────────────────

// 1. Read the Next.js build ID — this is our CACHE_VERSION.
let buildId;
try {
  buildId = readFileSync(BUILD_ID_PATH, "utf8").trim();
} catch {
  console.error(
    "[generate-sw-precache] ERROR: .next/BUILD_ID not found.\n" +
      "  Run this script only after `next build` has completed.\n" +
      "  Expected path: " + BUILD_ID_PATH
  );
  process.exit(1);
}

console.log("[generate-sw-precache] Build ID (→ CACHE_VERSION):", buildId);

// 2. Walk out/ and collect all files → URL paths.
let allFiles;
try {
  allFiles = await walk(OUT_DIR);
} catch {
  console.error(
    "[generate-sw-precache] ERROR: out/ directory not found.\n" +
      "  Run `next build` first so the static export exists at: " + OUT_DIR
  );
  process.exit(1);
}

const urls = allFiles
  .filter((f) => !shouldExclude(f))
  .map(toUrl)
  .sort();

// 3. Spot-check: log a few representative entries for human verification.
console.log("[generate-sw-precache] Sample URL mappings (spot-check these):");
const spotCheck = [
  urls.find((u) => u === "/"),
  urls.find((u) => u === "/en/introduction"),
  urls.find((u) => u?.startsWith("/_next/static/chunks/") && u.endsWith(".js")),
  urls.find((u) => u?.startsWith("/_next/static/chunks/") && u.endsWith(".css")),
  urls.find((u) => u?.startsWith("/_next/static/media/") && u.endsWith(".woff2")),
  urls.find((u) => u === "/icons/icon-192.png"),
  urls.find((u) => u === "/manifest.webmanifest"),
].filter(Boolean);
spotCheck.forEach((u) => console.log("  ", u));

// Count breakdown for the build log.
const nextCount = urls.filter((u) => u.startsWith("/_next/")).length;
const htmlCount = urls.filter(
  (u) =>
    !u.startsWith("/_next/") &&
    !u.startsWith("/icons/") &&
    u !== "/manifest.webmanifest" &&
    !u.endsWith(".txt") &&
    !u.endsWith(".ico")
).length;
const iconCount = urls.filter((u) => u.startsWith("/icons/")).length;
console.log(
  `[generate-sw-precache] Total: ${urls.length} URLs` +
    ` (${nextCount} _next assets, ${htmlCount} HTML routes, ${iconCount} icons + splashes, rest = manifest/favicon)`
);

// 4. Also derive a short hash of the URL list itself (extra safety: if assets
//    change but the build ID somehow doesn't, the hash will catch it).
const listHash = createHash("sha256")
  .update(urls.join("\n"))
  .digest("hex")
  .slice(0, 8);

console.log("[generate-sw-precache] Precache list hash:", listHash);

// 5. Write out/precache-manifest.js
//    The SW loads this via importScripts('/precache-manifest.js').
//    Both CACHE_VERSION and the URL array are injected here.
const manifest = `/**
 * precache-manifest.js — AUTO-GENERATED by scripts/generate-sw-precache.mjs
 *
 * DO NOT EDIT by hand.  This file is regenerated on every build.
 * Source: scripts/generate-sw-precache.mjs
 *
 * Build ID : ${buildId}
 * List hash: ${listHash}
 * Generated: ${new Date().toISOString()}
 * Asset count: ${urls.length}
 */

// CACHE_VERSION is the Next.js build ID — unique per deploy.
// Changes automatically whenever the build output changes.
self.__PRECACHE_VERSION = ${JSON.stringify(buildId)};

// Complete list of first-party assets to precache at SW install time.
// Includes all _next/static JS/CSS/woff2 chunks, all exported HTML routes
// (cleanUrls form), all icons + splash images, and the web manifest.
self.__PRECACHE_MANIFEST = ${JSON.stringify(urls, null, 2)};
`;

writeFileSync(OUT_MANIFEST, manifest, "utf8");
console.log("[generate-sw-precache] Written:", OUT_MANIFEST);
console.log("[generate-sw-precache] Done.");
