# CRIS Golf Program — Build Progress

**App:** CRIS Golf Program (Chiang Rai International School – Golf Program)
**Plan:** see [`mvp_guideline.md`](./mvp_guideline.md) — Phase 1 decomposed into subphases 1A–1G
**Live URL:** https://cris-golf-app.vercel.app
**Repo:** https://github.com/LoganH-web/CRIS-Golf-App

---

## Status at a glance

| Phase | State |
|---|---|
| **Phase 1 — PWA on Vercel** | ✅ **Code complete** — pending school content + device sign-off |
| Phase 2 — Native store release (App Store + Play Store) | ⬜ Not started |

Phase 1 is a fully multilingual (EN / KO / ZH-Hans / TH), installable, offline-capable, **zero-data-collection** read-only information PWA. Built English-first with deliberate placeholders so launch isn't blocked on translations/content.

---

## Phase 1 subphases

| Sub | Scope | Status | Commit |
|---|---|---|---|
| **1A** | Scaffold (Next.js static export + TS + Tailwind) + placeholder; proven build/deploy pipeline | ✅ Done | `af53b59` |
| **1B** | App shell: header, mobile-first bottom tab bar, Contact footer, 6 route stubs | ✅ Done | `ebb4d5c` |
| **1C** | i18n: `app/[locale]/` routing, 4 dictionaries, language switcher, device-default + persistence | ✅ Done | `c9a074e` |
| **1D** | Screen content (English-first) for all 6 screens, dictionary-driven | ✅ Done | `9938930` |
| **1E** | Interactions + CRIS hand-off: §8 disclosure modal, config-driven admissions URL, mailto, youtube-nocookie click-to-load | ✅ Done | `fb10bfa` |
| **1F** | PWA layer: manifest, service worker, icons/splash, installability, offline | ✅ Done | `139ea9e` |
| **1F-fix** | Vercel `cleanUrls` + hardened SW precache (locale routes were 404ing on hard nav) | ✅ Done | `2ae64fe` |
| **1G** | Launch polish: privacy policy page, QR code, subdomain readiness, `DEPLOYMENT.md` | ✅ Done | `e96759c` |

---

## What's built

**Tech stack**
- Next.js 16 (App Router) + React 19, **static export** (`output: "export"`)
- TypeScript (strict), Tailwind CSS v4
- Hosting: Vercel (output dir `out/`, `vercel.json` → `cleanUrls: true`)

**Screens (6 core, all 4 locales = `/{en,ko,zh,th}/...`)**
- Home / Entry — branded landing + entry cards
- School Introduction — Junior (4–5), Intermediate (6–8), Advanced (9–12)
- Admissions — 5-step process + Contact Admissions / Request Info
- Tuition & Fees — native in-app screen (fee table ready for figures), no payment, no link-out
- Gallery — photo grid + click-to-load video slots
- Q&A / FAQ — accessible accordion

**Cross-cutting**
- i18n via custom dictionary context (`i18n/dictionaries/{en,ko,zh,th}.json`); no hardcoded UI strings; device-language default + manual override persisted in `localStorage`
- §8 hand-off disclosure modal before any external CRIS link; opens in visible browser
- Config-driven admissions URL + "Enquire → Apply" flag (`config/links.ts`) — one-line swap when the real form launches
- Privacy policy at `/{locale}/privacy` (footer-linked) — store-listing URL: `https://cris-golf-app.vercel.app/en/privacy`
- PWA: manifest, hand-rolled service worker (network-first nav, cache-first assets, resilient per-URL precache), maskable icons, installable + offline
- QR code (`public/qr/cris-golf-qr.{svg,png}`) encoding the production URL

**Privacy posture (§8) — intact**
- No analytics / ad / crash / tracking SDKs anywhere
- Videos use `youtube-nocookie.com`, click-to-load → zero third-party contact until the user presses play
- Service worker caches first-party assets only (same-origin guard); no push/background-sync
- App stores' "no data collected" forms can be answered honestly

---

## Outstanding before true launch (not code)

**School content track** (the real schedule risk — §10/§12; each has a documented one-file swap-in in [`DEPLOYMENT.md`](./DEPLOYMENT.md)):
- ☐ Golf program fee figures → `tuition.rows` in the 4 dictionaries
- ☐ Final FAQ Q&A → `faq.items` in the 4 dictionaries
- ☐ Gallery photos → `public/images/` + `gallery/page.tsx`
- ☐ Intro/gallery video IDs → `config/links.ts`
- ☐ Real logo → `scripts/generate-icons.mjs`, then re-run
- ☐ Professional KO / ZH / TH translations for long-form body text → the 4 dictionary JSONs
- ☐ Real online application form URL (when built) → `config/links.ts` (flip Enquire → Apply)

**Deploy / sign-off track:**
- ☑ `git push` to deploy latest — live deploy serves `/sw.js` + `/manifest.webmanifest` (HTTP 200)
- ☑ **Offline bug fixed** — precache was HTML-only (31 routes + icons, 0 `_next` entries). Installed app failed to launch offline because the hashed `/_next/static/chunks/*.js` and `*.css` bundles were never precached, so the page couldn't hydrate. Fixed in commit `d47060e`. New approach: `scripts/generate-sw-precache.mjs` runs as a postbuild step (`next build && node scripts/generate-sw-precache.mjs`), walks `out/`, and emits `out/precache-manifest.js` with the complete asset list (97 URLs: 25 `_next` assets including all JS/CSS/woff2 chunks, 32 HTML routes, 38 icons/splashes, manifest, favicon). `public/sw.js` now loads this via `importScripts('/precache-manifest.js')` instead of a hand-maintained array. `CACHE_VERSION` is now the Next.js `BUILD_ID` — auto-changes every deploy, no manual bumps.
- ☐ Lighthouse PWA audit on the live URL
- ☐ Android "Add to Home Screen" install test
- ☐ iOS Safari share-sheet install test (real iPhone + Safari only; Simulator and Chrome/Firefox-iOS don't offer "Add to Home Screen")
- ☐ Offline reload test — **follow the exact sequence below**, or it will false-fail
- ☐ School sign-off on the live PWA
- ☐ (Optional) map `app.cris.ac.th` subdomain — DNS steps in `DEPLOYMENT.md`

> **⚠️ Service-worker test sequence (iOS standalone — one online launch required).**
> A service worker does **not** control the page on its very first visit — it
> installs + precaches in the background and only takes control on the *next*
> load.  Turning on Airplane Mode too early means nothing is cached yet → Safari
> shows *"server stopped responding."*  This is a known SW lifecycle constraint,
> **not** a bug in the precache (the incomplete-precache offline bug is separately
> fixed — see above).  Correct test sequence:
> 1. Airplane Mode **OFF** → open the live URL in Safari on a real iPhone.
> 2. Tap through a couple of screens and wait ~10 s for the SW to precache all 97 assets.
> 3. Add to Home Screen, then launch the installed PWA from the home screen.
> 4. Navigate a few screens so the new SW controls the page.
> 5. **Now** turn Airplane Mode **ON**.
> 6. Kill and relaunch the installed PWA from the home screen → the full app shell should render offline.
>
> **Important caveat (always true for iOS standalone):** The installed app must be
> launched at least once online before offline works.  iOS Safari does not precache
> during the "Add to Home Screen" gesture itself — the SW installs on the first
> in-app load.  This is an iOS constraint, not fixable in the SW.
>
> If it still fails: inspect via Mac + Safari Web Inspector
> (iPhone → Settings → Safari → Advanced → Web Inspector), or sanity-check on
> Android Chrome first (Android caches more aggressively) to isolate iOS-only quirks.

**1G follow-up — iOS splash screen:**
- ☑ Add `apple-touch-startup-image` link tags so the **installed** iOS app shows a
  branded splash. Done in commit `873a68e` — 34 PNGs generated
  (17 device groups × portrait + landscape) by `scripts/generate-splash.mjs` into
  `public/icons/splash/`; 34 `<link rel="apple-touch-startup-image">` tags wired
  into `app/layout.tsx` via raw `<head>`; SW `CACHE_VERSION` bumped v3→v4 with all
  34 paths added to `PRECACHE_URLS`. Build verified (`npm run build` clean) and
  all 34 tags confirmed present in `out/index.html`.
  Placeholder logo dependency: splash uses same "CG" monogram as icons (BRAND_NAVY
  background). When real logo arrives, re-run `scripts/generate-splash.mjs` and
  rebuild — no layout.tsx changes needed.

---

## Phase 2 (after sign-off) — not started

- Wrap the same static build in a thin native shell (e.g. Capacitor)
- Deep links (Universal Links / App Links) so the QR opens the installed app
- Store assets, privacy policy URL, "App Privacy" / "Data safety" forms (= no data collected)
- **Apple org account needs a free D-U-N-S number — start the lookup early** (can take weeks; it's the critical path)
- Requires a Mac/Xcode (or cloud-Mac/CI) for the iOS build

---

*Last updated: 2026-06-25 · Phase 1 code complete; offline bug fixed (incomplete precache → build-generated full precache); awaiting school content + sign-off. iOS standalone caveat: installed app must be launched once online before offline works — see test sequence above.*
