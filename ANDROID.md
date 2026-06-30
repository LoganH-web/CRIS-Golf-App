# Publishing CRIS Golf Program to Google Play (Internal testing)

Android is the easiest first target: **$25 one-time**, fast approval, and it
**builds entirely on Windows — no Mac, no CI required.** Google Play's
**Internal testing** track is the equivalent of TestFlight: instant, no review,
up to 100 testers.

- **App name:** CRIS Golf Program
- **Package name (applicationId):** `th.ac.cris.golf`
- **Web layer:** the same Next.js static export (`out/`), wrapped with Capacitor.

> Already scaffolded in the repo: `@capacitor/android`, `capacitor.config.ts`,
> `resources/icon.png` + `resources/splash.png`, and the SW is disabled inside the
> native shell. `android/` is git-ignored (you generate it with `cap add android`).

---

## Recommended path — Capacitor + Android Studio (local, Windows)

### Phase 0 — Accounts & tools (one-time)
1. **Google Play Developer account** — $25 one-time, with identity verification:
   [play.google.com/console/signup](https://play.google.com/console/signup).
2. **Android Studio** (Windows) — bundles the JDK + Android SDK:
   [developer.android.com/studio](https://developer.android.com/studio). Install,
   open once, and let it finish downloading the SDK.

### Phase 1 — Generate the native Android project (Windows terminal)
```
npm run build           # produces out/
npx cap add android     # creates android/ (works on Windows)
npm run cap:assets      # app icon + splash from resources/
npx cap sync android
npx cap open android    # opens the project in Android Studio
```
(After any web change, re-run `npm run cap:sync`.)

### Phase 2 — Build a signed App Bundle (Android Studio)
1. Menu: **Build → Generate Signed App Bundle / APK → Android App Bundle**.
2. **Create new keystore** (first time): pick a path, set passwords, fill the
   certificate fields. ⚠️ **Save the keystore file and passwords somewhere safe
   and backed up** — you need the same key for every future update.
   (Google **Play App Signing** is enabled by default when you create the app, so
   this is your *upload* key — but still: do not lose it.)
3. Build variant **release** → Finish. The `.aab` lands in
   `android/app/build/outputs/bundle/release/app-release.aab`.

### Phase 3 — Create the app + upload (Play Console, browser)
1. [Play Console](https://play.google.com/console) → **Create app**: name
   "CRIS Golf Program", language, **App** (not game), **Free**.
2. Complete the required setup tasks (privacy policy URL =
   `https://cris-golf-app.vercel.app/en/privacy`, **Data safety → no data
   collected** per §8, content rating questionnaire, target audience).
3. **Testing → Internal testing → Create release → Upload** `app-release.aab`.
4. **Testers** tab → create an email list of testers → **Save** → copy the
   **opt-in/join link** and share it with the school.
5. Testers open the link, accept, and install from Google Play.

> Each new upload needs a higher **versionCode** — bump it in
> `android/app/build.gradle` (`versionCode 2`, `3`, …) before rebuilding.

---

## Fastest alternative — PWABuilder (zero local install)

Because the app is already a live PWA on Vercel, you can skip Capacitor/Android
Studio entirely for Android:

1. Go to [pwabuilder.com](https://www.pwabuilder.com) and enter
   `https://cris-golf-app.vercel.app`.
2. Choose **Android (Google Play)** → it generates a **signed `.aab`** and a
   signing key for you (download and keep the key safe).
3. Upload that `.aab` in Play Console → Internal testing (Phase 3 above).

Trade-off: PWABuilder produces a **Trusted Web Activity** that loads the live
Vercel site (so it needs the site online; offline relies on the service worker),
whereas the Capacitor build bundles the assets locally. For an info app either is
fine — PWABuilder is quickest to a testing track; Capacitor matches the iOS build
and works offline natively.

---

## ⚠️ Verify on a real device (Capacitor build)

Same checks as iOS — see TESTFLIGHT.md:
1. Navigation through all 6 screens (client-side routing).
2. External links (CRIS enquiry form, `mailto:`, YouTube) open in the browser,
   not inside the app webview. If they load in-app, add `@capacitor/browser`.
3. Language switch, currency toggle, video play, offline behaviour.
4. Icon + splash show the CRIS Golf crest.

---

## Note on newer Play accounts

If you registered a **personal** Google Play account recently, Google may require
a closed-testing run (20 testers for 14 days) **before production**. This does
**not** apply to the **Internal testing** track — that's available immediately,
which is all you need to get the school testing now.

---

## CI option (later)

The iOS pipeline uses Codemagic because iOS needs a Mac. Android doesn't, so a
local build is simplest. If you later want CI for Android too, the cleanest setup
is to **commit the `android/` project** (un-ignore it) with a Gradle signing
config that reads keystore env vars, then add an `android-internal` workflow to
`codemagic.yaml`. Ask and I'll set that up.
