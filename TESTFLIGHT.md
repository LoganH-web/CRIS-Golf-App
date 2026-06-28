# Publishing CRIS Golf Program to TestFlight (no Mac required)

This is the Phase 2 path to get the app onto **TestFlight** for the school to
test on real iPhones — using **Codemagic CI** so you never need a Mac yourself.

- **App name:** CRIS Golf Program
- **Bundle ID:** `th.ac.cris.golf`
- **Web layer:** the same Next.js static export that deploys to Vercel (`out/`),
  wrapped with **Capacitor**.

> Account choice: this guide assumes an **individual** Apple Developer account
> (fast — no D-U-N-S wait). You can transfer the app to a school **organization**
> account later. If you'd rather start with the org, begin the free **D-U-N-S**
> lookup now (it can take days–weeks) before Phase 0.

---

## ✅ Already scaffolded in this repo (done for you)

- Capacitor installed (`@capacitor/core`, `cli`, `ios`) + `@capacitor/assets`.
- `capacitor.config.ts` — `appId: th.ac.cris.golf`, `webDir: "out"`.
- `npm run` helpers: `cap:sync`, `cap:assets`.
- `resources/icon.png` (1024) + `resources/splash.png` (2732) — generated from
  the app logo by `scripts/generate-icons.mjs`; `capacitor-assets` turns these
  into the iOS icon/launch set.
- Service worker is **disabled inside the native shell** (web build still uses it).
- `codemagic.yaml` — the cloud build → TestFlight pipeline.
- `ios/` is git-ignored — the native project is generated fresh by CI.

You do **not** run `cap add ios`, CocoaPods, or Xcode locally — Codemagic does.

---

## Phase 0 — Apple Developer account (~1–2 days)

1. Enroll in the **Apple Developer Program** ($99/yr) as an **Individual**:
   [developer.apple.com/programs/enroll](https://developer.apple.com/programs/enroll).
2. Wait for approval email (usually 24–48h).

---

## Phase 1 — App Store Connect: register the app (browser, ~10 min)

1. **Register the Bundle ID** (if not auto-created): [Certificates, IDs & Profiles](https://developer.apple.com/account/resources/identifiers/list)
   → Identifiers → **+** → App IDs → App → Description "CRIS Golf Program",
   Bundle ID **explicit** `th.ac.cris.golf` → Register.
2. **Create the app record:** [App Store Connect](https://appstoreconnect.apple.com)
   → My Apps → **+ → New App**:
   - Platform **iOS**, Name **CRIS Golf Program**, Primary language,
   - Bundle ID `th.ac.cris.golf`, SKU `cris-golf-001` (any unique string).
3. **App Privacy** → set **"Data Not Collected"** (honest — the app collects
   nothing; the enquiry form lives on the CRIS website, §8).
4. Note the app's **numeric Apple ID** (App Store Connect → your app → App
   Information → "Apple ID", a 10-digit number). You'll paste it into the CI config.

---

## Phase 2 — Codemagic: one-time setup (browser, ~15 min)

1. Sign up at [codemagic.io](https://codemagic.io) and **connect this Git repo**.
2. **Add an App Store Connect API key** so CI can sign + upload:
   - In App Store Connect → **Users and Access → Integrations → App Store Connect API**
     → generate a key with **App Manager** role. Download the `.p8` (once only),
     and note the **Issuer ID** and **Key ID**.
   - In Codemagic → **Teams → Integrations → App Store Connect → Connect**.
     Name it **exactly** `CRIS Golf ASC` (matches `codemagic.yaml`).
3. In **`codemagic.yaml`**, set `APP_STORE_APP_ID` to the numeric Apple ID from Phase 1.4,
   commit, and push.

---

## Phase 3 — Build → TestFlight (Codemagic, ~15–25 min, automated)

1. In Codemagic, open the app → **Start new build** → workflow **"CRIS Golf — iOS TestFlight"**.
2. The pipeline runs automatically:
   `npm ci` → `npm run build` → `cap add ios` → `capacitor-assets generate`
   → `cap sync` → signing → build number → `.ipa` → **upload to TestFlight**.
3. When it finishes, Apple processes the build (~5–30 min; you get an email).

---

## Phase 4 — Invite testers (App Store Connect, browser)

1. App Store Connect → your app → **TestFlight** tab.
2. **Internal testing** (fastest, **no review**): add up to 100 testers who are in
   your team (Users and Access) → assign the build. Available immediately.
3. **External testing** (up to 10,000 via email or public link): create a group,
   add the build, fill "What to test" → submit for **Beta App Review** (usually <24h).
4. Testers install the **TestFlight** app from the App Store, accept the invite,
   and install the build.

> Each new upload needs a **higher build number** — the CI bumps it automatically
> (latest TestFlight build + 1).

---

## ⚠️ Verify on a real device before inviting the school

Because this is a wrapped static-export PWA, sanity-check these once the first
build is on TestFlight:

1. **Navigation** — tapping through Home / About / Admissions / Tuition / Gallery /
   FAQ works (Next.js client-side routing). If a hard reload of a deep page fails,
   the fix is `trailingSlash: true` in `next.config.ts` (directory-style URLs that
   the native file server resolves) — ask and I'll apply it.
2. **External links open outside the app** — the §8 hand-off (CRIS enquiry form),
   `mailto:`, and YouTube (no-cookie) should open in Safari, not inside the webview.
   If any load in-app, we add `@capacitor/browser` to force external opening.
3. **Language switch, currency toggle, video play, offline** all behave as on the web.
4. **Icon + splash** show the CRIS Golf crest (from `resources/`).

---

## Eventual public release (later, not needed for TestFlight)

- Full store metadata: screenshots, description (EN + ideally KO/ZH/TH), **privacy
  policy URL** (`/en/privacy`), support URL, age rating.
- Apple **Guideline 4.2**: the app renders intro/FAQ/gallery *inside* the app
  (it does) — only enquiry/email/fees go external. You're well-positioned.
- Transfer to the school **organization** account if desired (needs D-U-N-S).

---

## Local Mac alternative (if you ever get a Mac)

```
npm run build
npx cap add ios
npm run cap:assets
npx cap sync ios
npx cap open ios     # opens Xcode → set Team, then Product ▸ Archive ▸ Distribute
```
