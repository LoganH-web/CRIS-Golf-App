/**
 * CRIS Golf Program — Service Worker (subphase 1F)
 *
 * Strategy: "App Shell + Static Precache"
 *   - On install: precache the app shell (HTML pages, JS/CSS chunks, icons,
 *     manifest) so the app opens offline after the first visit.
 *   - On fetch: cache-first for precached assets; network-first for navigation
 *     requests (so a live deploy always wins over stale HTML once online).
 *
 * Privacy (§8): This service worker makes NO third-party network calls.
 *   It does NOT use push notifications, background sync, or analytics.
 *   It only caches first-party assets from this same origin.
 *   youtube-nocookie embeds are NOT precached — they load from the network
 *   only when the user presses play (as in 1E), keeping the "no third-party
 *   contact on page load" guarantee intact.
 *
 * Update / versioning:
 *   Bump CACHE_VERSION below on every deploy that changes the precache list.
 *   The install event caches under the new key; the activate event deletes
 *   the old cache.  skipWaiting + clients.claim mean the new SW takes effect
 *   immediately for all open tabs — no "waiting for the next navigation"
 *   limbo.  Users testing updates should open an Incognito window or use
 *   DevTools > Application > Service Workers > "Update on reload".
 *
 * How to add/remove precached pages:
 *   1. Update PRECACHE_URLS below.
 *   2. Bump CACHE_VERSION.
 *   3. Deploy. The new SW will install and replace the old cache on activate.
 */

// ─── Cache versioning ────────────────────────────────────────────────────────
// Bump this string on every deploy to invalidate the old cache.
const CACHE_VERSION = "v2";
const CACHE_NAME = `cris-golf-${CACHE_VERSION}`;

// ─── URLs to precache ────────────────────────────────────────────────────────
// All locale-prefixed routes (4 locales × 6 screens + root redirect).
// Static-export pages land at these exact paths in the out/ directory.
const PRECACHE_URLS = [
  // Root locale-redirect page
  "/",
  // English
  "/en",
  "/en/introduction",
  "/en/admissions",
  "/en/tuition",
  "/en/gallery",
  "/en/faq",
  // Korean
  "/ko",
  "/ko/introduction",
  "/ko/admissions",
  "/ko/tuition",
  "/ko/gallery",
  "/ko/faq",
  // Chinese (Simplified)
  "/zh",
  "/zh/introduction",
  "/zh/admissions",
  "/zh/tuition",
  "/zh/gallery",
  "/zh/faq",
  // Thai
  "/th",
  "/th/introduction",
  "/th/admissions",
  "/th/tuition",
  "/th/gallery",
  "/th/faq",
  // App icons (referenced by manifest + apple-touch-icon)
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-512-maskable.png",
  "/icons/apple-touch-icon.png",
  // Web manifest
  "/manifest.webmanifest",
];

// ─── Install: precache all shell assets ──────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        // Cache each URL INDEPENDENTLY (not cache.addAll, which is atomic and
        // would discard the entire batch if any single URL 404s). This keeps
        // the precache resilient: one missing route never empties the cache.
        return Promise.allSettled(
          PRECACHE_URLS.map((u) =>
            cache.add(u).catch((err) => {
              console.warn("[SW] Precache failed for", u, err);
            })
          )
        );
      })
      .then(() => {
        // Skip the waiting phase so the new SW activates immediately.
        return self.skipWaiting();
      })
  );
});

// ─── Activate: delete stale caches ───────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("cris-golf-") && key !== CACHE_NAME)
            .map((key) => {
              console.log("[SW] Deleting stale cache:", key);
              return caches.delete(key);
            })
        )
      )
      .then(() => {
        // Claim all open clients immediately so the new cache is used at once.
        return self.clients.claim();
      })
  );
});

// ─── Fetch: serve from cache, fall back to network ───────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests — never intercept third-party calls
  // (youtube-nocookie, fonts, etc.) to respect §8.
  if (url.origin !== self.location.origin) {
    return; // let the browser handle it normally
  }

  // Navigation requests (HTML pages): network-first so a fresh deploy is
  // served immediately when online; fall back to cache when offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Cache the fresh page for offline use
          if (networkResponse.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline: serve from cache
          return caches.match(request).then(
            (cached) =>
              cached ||
              // If the exact page isn't cached, serve the locale root
              // (e.g. /en for /en/gallery when offline after a partial install)
              caches.match("/en") ||
              caches.match("/")
          );
        })
    );
    return;
  }

  // Static assets (JS, CSS, images, fonts): cache-first for speed.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      // Not in cache — fetch from network and cache for next time.
      return fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
          });
        }
        return networkResponse;
      });
    })
  );
});
