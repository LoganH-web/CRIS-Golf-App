# CRIS Golf Program — Deployment & Handoff Reference

This file is the single reference for content swap-ins, subdomain setup, and
Phase 2 store-release steps. It is written for the school's IT team and
content maintainer.

---

## 1. Content swap-in checklist (§10)

All placeholder content has a known swap-in point. Replace each item below,
then run `npm run build` and push to GitHub (Vercel deploys automatically).

| Content item | Where to swap it in | Notes |
|---|---|---|
| **Golf program fee figures** | `i18n/dictionaries/{en,ko,zh,th}.json` → `tuition.rows[*].termFee` and `.annualFee` | Replace the "Contact Admissions" placeholder strings with actual figures (e.g. "35,000 THB"). Also update `tuition.placeholderHeading` / `.placeholderBody` / `.feesComingSoon` once real figures are in. |
| **YouTube video IDs** | `config/links.ts` → `introductionVideos[*].id` and `galleryVideos[*].id` | Replace `null` with the 11-character YouTube video ID (e.g. `"dQw4w9WgXcQ"`). Videos use `youtube-nocookie.com`; no other code change needed. |
| **Gallery photos** | `app/[locale]/gallery/page.tsx` — photo grid placeholder `<div>` elements | Replace the grey placeholder divs with `<img>` tags pointing to images in `public/images/` (create this folder). Ensure all photos have parental media consent. |
| **Real CRIS Golf logo** | `scripts/generate-icons.mjs` — replace the inline SVG source with the logo SVG, then run `node scripts/generate-icons.mjs` | Regenerates all four icon sizes in `public/icons/`. Commit the new PNGs. |
| **Online application form URL** | `config/links.ts` → `admissionsUrl` (change to new form URL) and `admissionsButtonPhase` (change `"enquire"` to `"apply"`) | The button label on the Admissions screen will automatically switch from "Enquire" to "Apply Now". No other code changes needed. |
| **Korean / Chinese / Thai translations** | `i18n/dictionaries/{ko,zh,th}.json` | Long-form body text (level card descriptions, admissions step descriptions, legal disclaimers) currently falls back to English. Supply professionally translated strings for these keys. The Dictionary type in `i18n/types.ts` enforces that all keys must be present in all four files. |
| **FAQ final Q&A** | `i18n/dictionaries/{en,ko,zh,th}.json` → `faq.items` array | Replace the 8 placeholder Q&A entries with final school-approved questions and answers in all four languages. |
| **Privacy policy translations** | `i18n/dictionaries/{ko,zh,th}.json` → `privacy.sections.*` | English is complete. Korean, Chinese, and Thai are translated. If the school wants legally reviewed translations, replace the body text in those files. |

---

## 2. Custom subdomain — app.cris.ac.th (optional, §9 step 6)

The app currently deploys at `https://cris-golf-app.vercel.app`. Setting up
`app.cris.ac.th` requires two steps — one in Vercel, one in DNS. Both are
controlled by the school, not the developer.

### Step A — Add the domain in Vercel (5 minutes)

1. Log in to [vercel.com](https://vercel.com) → open the `CRIS-Golf-App` project.
2. Go to **Settings → Domains**.
3. Click **Add Domain** and enter `app.cris.ac.th`.
4. Vercel will show you a DNS record to create (either a CNAME or an A record).
   Copy it — you will need it in Step B.

### Step B — Create the DNS record (your school's IT team / DNS provider)

Create a **CNAME record** in the DNS zone for `cris.ac.th`:

```
Name   : app
Type   : CNAME
Value  : cname.vercel-dns.com.   (or whatever Vercel showed you in Step A)
TTL    : 3600 (or your provider's default)
```

DNS propagation can take a few minutes to 48 hours.

### Step C — Update the canonical URL and regenerate the QR code

Once the domain resolves, update two places:

1. In `config/links.ts`, change:
   ```ts
   export const canonicalSiteUrl = "https://cris-golf-app.vercel.app";
   ```
   to:
   ```ts
   export const canonicalSiteUrl = "https://app.cris.ac.th";
   ```

2. In `scripts/generate-qr.mjs`, change the `ENCODED_URL` constant to match:
   ```js
   const ENCODED_URL = "https://app.cris.ac.th";
   ```

3. Regenerate the QR code:
   ```
   node scripts/generate-qr.mjs
   ```
   New files are written to `public/qr/`. Commit them and push.

4. Reprint and redistribute all QR code materials (brochures, posters, etc.).

---

## 3. Privacy policy URL for Phase 2 store listings

Both Apple App Store and Google Play require a privacy policy URL.

**Use this URL in both store listings:**
```
https://cris-golf-app.vercel.app/en/privacy
```

If the custom subdomain is set up, update to:
```
https://app.cris.ac.th/en/privacy
```

The privacy policy page is an in-app route that works offline (it is
precached by the service worker). It states plainly that the app collects
no personal data.

---

## 4. Phase 2 store release checklist (high-level)

Refer to mvp_guideline.md §9 Phase 2 for full details.

- [ ] School Apple Developer *organization* account set up (needs D-U-N-S number — start early, takes days–weeks)
- [ ] Google Play Developer account ($25 one-time fee)
- [ ] Wrap static build with Capacitor (thin native shell)
- [ ] Add iOS Universal Links + Android App Links so QR opens the installed app
- [ ] Prepare store assets: icon (1024×1024), screenshots (6.7" iPhone + Android), descriptions in EN and optionally KO/ZH/TH
- [ ] Privacy policy URL: `https://cris-golf-app.vercel.app/en/privacy` (or custom subdomain once live)
- [ ] Support URL: `https://golf.cris.ac.th/contact` (or `mailto:admin@cris.ac.th`)
- [ ] Complete Apple "App Privacy" form → select "No data collected"
- [ ] Complete Google "Data safety" form → select no data collected, no data shared
- [ ] Submit to TestFlight / Play internal testing, get school sign-off, then release

---

## 5. Build and deploy

```bash
# Install dependencies (first time / after npm install)
npm install

# Build the static export
npm run build
# Output is in out/ — Vercel reads this automatically on push.

# Regenerate icons (after swapping the real logo)
node scripts/generate-icons.mjs

# Regenerate QR code (after changing the canonical URL)
node scripts/generate-qr.mjs
```

Push to `main` on GitHub → Vercel deploys automatically.

---

## 6. School sign-off checklist (before public launch)

- [ ] All six screens reviewed and approved by the school
- [ ] Fee figures confirmed and updated in the dictionaries
- [ ] Real YouTube video IDs added (or videos confirmed as "coming soon")
- [ ] Real gallery photos added with parental consent confirmed
- [ ] Real application form URL confirmed (or "enquiry mode" accepted for launch)
- [ ] Final FAQ Q&A approved
- [ ] Professional KO/ZH/TH translations reviewed and approved
- [ ] Privacy policy page reviewed
- [ ] Lighthouse PWA audit run on a real Android device (aim: score ≥ 90)
- [ ] Install tested on Android ("Add to Home Screen") and iOS (Safari share sheet)
- [ ] Offline mode tested: disconnect network, open a previously-visited screen
- [ ] QR code scanned and confirmed to open the app correctly
