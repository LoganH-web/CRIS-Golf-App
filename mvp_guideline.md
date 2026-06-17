# CRIS Golf Program — MVP Build Guideline (v3)

**Project:** Multilingual information app for the Chiang Rai International School (CRIS) Golf Program
**Sponsor:** Happy City (covering all costs)
**Reference site:** https://golf.cris.ac.th
**Approach:** PWA-first, **then** native app-store release (App Store + Play Store) as a confirmed Phase 2 — same codebase.

> **What changed in v3:** All three gates are now resolved (see §0). App-store presence is **confirmed required**, so Phase 2 is part of the build, not optional. The two CRIS hand-off URLs are confirmed — but both are lighter than their labels (the "application" link is an enquiry form; the "payment" link is a fees *information* page with no online checkout), so the in-app buttons are relabeled accordingly. App name is **CRIS Golf Program**.

---

## 0. GATES — all resolved ✅

The three decisions that determined build shape and effort are confirmed.

### ✅ Gate A — App-store presence: **REQUIRED**
The school wants the app published on both the **App Store and Play Store**. So this is PWA-first, then wrapped natively in **Phase 2** (§9). Implication for QR (Option A): the QR opens the *installed* app via deep links (iOS Universal Links / Android App Links), falling back to the store download page if not installed.

### ✅ Gate B — "Linked to CRIS": confirmed, with one content change
| In-app action | Destination | What it is / plan |
|---|---|---|
| Admissions enquiry | `https://golf.cris.ac.th/contact` | A **contact/enquiry form** (name, phone, email, message → "Send Request"). Not yet a full application form. **The school will build a real online application form later** → store this as a single config value so the URL (and the button label, "Enquire" → "Apply") swaps in one line when it's ready. |
| Tuition & fees | **In-app screen (no link-out)** | Golf fees **differ** from the general CRIS fee page, and the golf site has **no** tuition page — so don't link to `cris.ac.th/tuition-and-fees` (wrong figures). Instead show **golf-specific fee figures in a native in-app screen** (school provides the numbers) + a "Contact Admissions" button. No online payment exists anywhere. |

**Consequences baked into the build:**
- Admissions button = **"Contact Admissions / Enquire"** now; URL is config-driven for a one-line upgrade to the real "Apply" form later.
- Tuition becomes a **native content screen**, not a hand-off. **Needs the golf fee figures from the school** (table or PDF/image). Until provided, it ships with a clear placeholder + contact button.
- The enquiry form collects personal data **on CRIS's site** → the §8 hand-off disclosure applies.

### ✅ Gate C — Content confirmations
- App name = **CRIS Golf Program**
- Chinese = **Simplified (zh-Hans / zh-CN)**
- Content ownership: **the school** maintains content after launch (→ plan a light CMS in v2 so staff can self-update)
- Parental media consent: **confirmed** for child photos/videos
- QR intent = **Option A** (scan → open the app)

### Resolved follow-ups
- Golf fees **differ** from the general CRIS page → tuition is an in-app screen fed by school-provided golf figures (see Gate B).
- A real online application form **is coming later** → admissions URL is config-driven for a one-line swap.

---

## 1. App name

**Confirmed: `CRIS Golf Program`** — matches the existing site/brand and reads clearly in store listings.

| Field | Value |
|---|---|
| App / site name | **CRIS Golf Program** |
| Tagline | Chiang Rai International School – Golf Program |
| App ID (Phase 2) | `th.ac.cris.golf` |

---

## 2. What the MVP is (and is not)

A **read-only, multilingual information PWA**. It shows information and **hands off** to CRIS for anything involving forms or money. It never collects data or takes payment itself.

**In scope — 6 core screens:**
1. **Home / Entry** — branded landing, language picker, opened via QR (see §7).
2. **School Introduction** — the program + three grade levels (Junior 4–5, Intermediate 6–8, Advanced 9–12), photos, intro videos.
3. **Admissions** — process explained step-by-step + **"Contact Admissions / Enquire"** hand-off → `golf.cris.ac.th/contact` (enquiry form) + "Request Info" (email).
4. **Tuition & Fees** — a **native in-app screen** showing the golf-specific fee figures (school-provided) + a "Contact Admissions" button. Not a link-out (the general CRIS fee page has different numbers). **No in-app payment.**
5. **Gallery** — curated photos + embedded videos. Use **privacy-enhanced YouTube embeds (`youtube-nocookie.com`)**, not standard embeds — see §8 (standard embeds set tracking cookies, which would break the "no data collected" claim).
6. **Q&A / FAQ** — common questions and answers.

Plus a persistent **language switcher (EN / KO / ZH-Hans / TH)** and a **Contact** section.

**Out of scope for the MVP:**
- ❌ In-app payment
- ❌ Collecting names/emails/any personal data in the app
- ❌ User accounts / login
- ❌ Push notifications (possible later)
- ❌ User-uploaded content (gallery is curated by the school)

---

## 3. The "linked to CRIS" principle

> The app provides the **button and the guidance**. The actual form and payment happen on CRIS's own website. The app never stores or transmits applicant data.

| Action | What the app does |
|---|---|
| Contact Admissions / Enquire | Opens `golf.cris.ac.th/contact` (enquiry form) in the in-app browser. URL is config-driven → swaps to the real "Apply" form when the school launches it. |
| Request information | Opens email to `admission@cris.ac.th` |
| Tuition & Fees | Shown **inside the app** (golf figures from the school) + a "Contact Admissions" button. No external link, no payment step. |

This keeps the app free of data collection and payment — which keeps both store approval and child-privacy compliance simple. For the one true hand-off (the enquiry form), always open it in the **visible in-app/system browser**, not a silent embedded webview, so the hand-off is obvious to the user.

---

## 4. Architecture — PWA-first, native shell additive (both phases confirmed)

```
              ┌────────────────────────────────┐
              │  ONE static-export web codebase │
              │  (React + Tailwind + i18n)      │
              └───────────────┬────────────────┘
                              │  build → static HTML/CSS/JS
                              ▼
                    ┌─────────────────────┐
                    │  PWA on Vercel      │  ◀── THE MVP (Phase 1)
                    │  installable,       │
                    │  QR → URL           │
                    └──────────┬──────────┘
                               │  (Gate A = YES → confirmed)
                               ▼
                    wrap SAME build with a thin native shell
                          │                 │
                          ▼                 ▼
                       iOS app          Android app   ◀── Phase 2 (confirmed)
                    (App Store)        (Play Store)
```

**Key point:** Phase 1 ships on its own. Phase 2 reuses the identical codebase, so PWA-first costs nothing — and since stores are **confirmed required (Gate A)**, Phase 2 is part of the build, not a maybe.

**PWA notes worth verifying at build time:**
- Android install ("Add to Home Screen") is smooth; behaves close to a native app.
- iOS PWAs install via Safari's share sheet (manual step), have more limited push/storage behavior, and — critically — **cannot appear in the App Store**. Because Gate A requires App Store presence, the iOS store build is **only** reachable via the Phase 2 native wrapper; the iOS PWA is not a substitute. Re-verify current iOS PWA capabilities when building.

---

## 5. Tech stack (a reasonable default — not sacred; re-pin at implementation)

| Layer | Default choice | Notes |
|---|---|---|
| Framework | **Static-export web framework** | Next.js is a fine default; for a 6-screen read-only app a lighter option (Vite + React, or Astro) may be simpler. **Confirm framework + versions at build time.** |
| Language | TypeScript | |
| Styling | Tailwind CSS | mobile-first |
| Translations | i18n library (e.g. next-intl / react-i18next) | one JSON dictionary per language |
| PWA | web manifest + service worker | installability + basic offline |
| External links | in-app/system browser | makes the CRIS hand-off visible |
| Hosting | **Vercel** | free Hobby tier may suffice; Pro (~US$20/mo) for commercial use |
| Source control | GitHub | auto-deploy on push |
| (Phase 2 only) native wrapper | a thin shell (e.g. Capacitor) | wraps the same static build; QR scanner plugin only if Gate C needs in-app scanning |

> Version numbers (framework, wrapper) cited in earlier drafts should be **re-checked at implementation** — they move quickly.
> 🖥️ Phase 2 only: building the iOS app requires **Xcode on a Mac** (or a cloud-Mac/CI service). The PWA MVP needs none of this.

---

## 6. Multilingual support (EN / KO / ZH-Hans / TH) — mandatory

Build it in from day one.
- All visible text lives in dictionary files (`en`, `ko`, `zh`, `th`) — no hard-coded strings.
- Default to device language if it's one of the four, else English; always allow manual override.
- Chinese = **Simplified (zh-Hans / zh-CN)** — confirmed.
- FAQ/Q&A content needs all four translations — real translation work the school must supply.

---

## 7. QR-code entry — confirmed: Option A

The QR encodes the app's URL; scanning **opens the app**. Implementation differs by surface:
- **PWA / web:** the QR encodes the Vercel URL → opens in the browser, where the user can "Add to Home Screen." No scanner code.
- **Native (Phase 2):** add **deep links** (iOS Universal Links / Android App Links) so the QR opens the *installed* app, with a fallback to the store download page when it isn't installed.

An in-app QR *scanner* (for on-site check-in) was **not** requested — skip it. It can be added later if the school wants venue check-in.

---

## 8. Privacy & disclosure (required even with zero data collection)

Two things are needed regardless of PWA vs native:

1. **Published privacy policy URL.** Both app stores require one for listings; it's good practice for the PWA too. It states plainly that the app collects/stores no personal data and that applications/payments are handled by CRIS on CRIS's own website under CRIS's policy.
2. **In-app hand-off disclosure** at every external link, e.g.:
   > "You're leaving the CRIS Golf Program app and going to the CRIS website. Any information you enter there is collected by CRIS under their privacy policy — this app does not collect or store your data."

**To keep the "no data collection" claim true:** do **not** add third-party analytics, ad, or crash-reporting SDKs. **Embed gallery videos via `youtube-nocookie.com` (YouTube's privacy-enhanced mode), not the standard `youtube.com` embed** — the standard player sets tracking cookies and reports viewing data to Google the moment the page loads, which would silently make "no data collected" false. (Even nocookie embeds contact Google's servers on play; if the school wants a zero-third-party-contact guarantee, host the videos directly or use a click-to-load thumbnail that only loads the player on tap.) Answer Apple's "App Privacy" and Google's "Data safety" forms as **no data collected** — which is only honest if the above holds. Extra scrutiny applies because the students are minors; the hand-off disclosure matters most for parents. Note the admissions enquiry form *does* collect name/phone/email — but on CRIS's domain, not in the app, which is exactly why the hand-off must be explicit.

---

## 9. Build phases

### Phase 0 — Setup (½ day + lead-time items)
Gates resolved. Create the GitHub repo. Decide who owns the school's **Apple Developer (org)** and **Google Play** accounts.

> ⏱️ **Start the Apple D-U-N-S lookup on day one.** It's free but can take **several days to a few weeks**, and an Apple *organization* account can't be created without it. If left until Phase 2 it becomes the critical path and stalls the entire store release. Kick it off here, in parallel with all dev work.

### Phase 1 — PWA on Vercel (≈1.5–3 weeks)
1. Scaffold the chosen static-export framework (TypeScript + Tailwind).
2. Set up i18n with the four dictionaries (EN / KO / ZH-Hans / TH) + language switcher.
3. Build the 6 screens; drop in real content as it arrives.
4. Wire interactions:
   - Contact Admissions / Enquire → `golf.cris.ac.th/contact` in the in-app browser (URL in a single config file for easy swap to the future form), with the §8 disclosure.
   - Request Info → `mailto:admission@cris.ac.th`.
   - Tuition & Fees → native in-app screen from the school's golf figures + a "Contact Admissions" button (placeholder content until figures arrive).
5. Add web manifest + service worker (installable, basic offline) + app icon/splash.
6. Push to GitHub → Vercel → live PWA. Optionally map a subdomain (e.g. `app.cris.ac.th`).
7. Generate the QR code pointing at the URL.

**Get school sign-off on the live PWA before wrapping for the stores.**

### Phase 2 — Native store release (≈1–2 weeks incl. review) — confirmed required
1. Wrap the same static build in a thin native shell; test on real devices.
2. Add deep links (Universal Links / App Links) so the QR opens the installed app; app icon/splash. No camera permission needed (no in-app scanner).
3. Prepare store assets: icon, screenshots, descriptions (EN + ideally KO/ZH/TH), **privacy policy URL**, support URL.
4. Complete Apple "App Privacy" / Google "Data safety" forms (= no data collected).
5. Submit to TestFlight / Play internal testing, then production.

> ⚠️ **Store-review risk:** Apple Guideline 4.2 rejects apps that are "just a repackaged website." To pass, the app must render the intro/FAQ/gallery **inside** the app (not bounce straight to the website); only the enquiry/fees/email actions open externally. A polished multilingual experience clears this; a screen of links does not.
> Use a **school organization** developer account (Apple org accounts need a free **D-U-N-S** number — start early).

---

## 10. Content & assets checklist (collect early)

- ☑ App name confirmed (**CRIS Golf Program**) — still need icon + splash logo
- ☐ Intro copy for all 3 programs (mostly in the program sheets already)
- ☐ Intro **videos** (YouTube embeds easiest — use `youtube-nocookie.com`, see §8)
- ☐ Gallery **photos** (high-res, consent confirmed — minors)
- ☐ Admissions process steps in plain language (the enquiry form itself is on CRIS)
- ☐ **Golf-program fee figures** (table or PDF/image) — needed for the in-app Tuition screen; differ from general CRIS fees
- ☐ Real online application form URL — when the school builds it (swaps into the admissions config)
- ☐ FAQ questions & answers
- ☐ **All of the above translated** EN / KO / ZH-Hans / TH
- ☐ Contact details (on the site: +66 (0) 53 600-900, admin@cris.ac.th, address)
- ☐ Privacy policy text + hosted URL (§8)

---

## 11. Cost summary (for Happy City)

Both phases are now in scope (stores are required).

| Item | Cost |
|---|---|
| Apple Developer Program | US$99 / year |
| Google Play Developer | US$25 one-time |
| Mac / Xcode (for iOS build) | own Mac, or a cloud-Mac/CI build service |
| Vercel hosting | $0 (Hobby) – ~$20/mo (Pro for commercial use) |
| Domain/subdomain | $0 (school owns cris.ac.th) |
| D-U-N-S (Apple org account) | $0, one-time |

Main "cost" is development time. **PWA ≈ 1.5–3 weeks**, native store release adds **≈ 1–2 weeks** incl. review.

> ⚠️ **Engineering time and content-readiness are separate tracks — the second is the real schedule risk.** The 1.5–3 week PWA estimate assumes the §10 assets are ready. They mostly aren't yet: **golf fee figures, FAQ Q&A, intro copy/videos/photos, and — the long pole — all of it translated into EN / KO / ZH-Hans / TH** (real human translation work the school must supply). Treat content delivery as a parallel workstream that gates launch independently of code: the app can be feature-complete and still not shippable if translations haven't arrived. Recommend shipping with English + clear placeholders rather than blocking the whole launch on the last translation.

---

## 12. Status — quick reference

- **Gate A (store presence):** ✅ Required — Phase 2 confirmed.
- **Gate B (CRIS links):** ✅ Confirmed. Admissions → `golf.cris.ac.th/contact` (enquiry form); Tuition → **native in-app screen** (golf-specific figures from the school), **no link-out, no online payment** (the general `cris.ac.th/tuition-and-fees` page has different numbers — do not link it).
- **Gate C (content):** ✅ Name **CRIS Golf Program**; Chinese **Simplified**; school owns content; media consent confirmed; QR **Option A**.

**Now needed from the school (content, not decisions):**
1. **Golf-program fee figures** for the in-app Tuition screen (general CRIS fees don't apply).
2. The **online application form URL** once built — swaps into the admissions config; button changes "Enquire" → "Apply" then.

---

*MVP scope only. Sensible "v2" later: push notifications for news/events, a light CMS so school staff update gallery/FAQ themselves, on-site QR check-in, and live content updates.*