# App Store listing — CRIS Golf Program (prep sheet)

Everything below can be prepared **before** the Apple Developer account activates.
Paste these into App Store Connect once the app record exists. See TESTFLIGHT.md
for the build/upload steps.

---

## Core identity
| Field | Value |
|---|---|
| App name (≤30 chars) | **CRIS Golf Program** |
| Bundle ID | `th.ac.cris.golf` |
| Version | `1.0.0` (build number auto-set by CI) |
| Primary language | English (add KO / ZH / TH localizations) |
| Primary category | **Education** |
| Secondary category | **Sports** |
| Price | Free |
| Copyright | © 2026 Chiang Rai International School |

> Do **not** enroll in the **Kids Category** — it triggers much stricter rules.
> This is an information app aimed at parents/prospective families, rated 4+.

---

## Subtitle (≤30 chars) — pick one
- `Golf academy · Chiang Rai` (25)
- `Youth golf academy program` (26)
- `Chiang Rai golf academy` (23)

## Promotional text (≤170 chars, editable anytime without review)
> The official info app for the CRIS golf academy in Chiang Rai — program levels,
> fees, gallery, and admissions, in English, 한국어, 中文, and ไทย.

## Description (≤4000 chars)
```
CRIS Golf Program is the official information app for the golf academy at
Chiang Rai International School (CRIS). Explore the program, its three grade
levels, photos and videos, fees, and answers to common questions — all in one
place, in English, 한국어, 中文, and ไทย.

FEATURES
• Program overview and three levels — Junior (Grades 4–5), Intermediate
  (Grades 6–8), and Advanced (Grades 9–12)
• Program and coach introduction videos
• Photo gallery from training sessions and tournaments
• Annual tuition & fees, shown in your currency (USD, KRW, CNY, THB)
• Step-by-step admissions guide
• Frequently asked questions, fully translated
• Four languages with instant switching

The app is read-only: it presents information and links you to the school's
own website for enquiries. It does not collect or store any personal data.

Chiang Rai International School — "Dominus Dat Sapientiam."
```

## Keywords (≤100 chars, comma-separated, no spaces after commas)
```
golf,academy,Chiang Rai,CRIS,junior golf,school,Thailand,boarding,student,sports,training
```

## URLs
| Field | Value |
|---|---|
| Support URL (required) | `https://golf.cris.ac.th` |
| Marketing URL (optional) | `https://golf.cris.ac.th` |
| Privacy Policy URL (required) | `https://cris-golf-app.vercel.app/en/privacy` |

---

## App Privacy ("App Privacy" section)
- **Data collection: None.** Answer every category "No, we do not collect data."
- Honest because: the app stores/transmits no personal data; the admissions
  enquiry form lives on CRIS's own website (§8). Language choice is stored only
  in on-device `localStorage` (not collected/transmitted).

## Age rating questionnaire
- Answer **None / No** to every content category → results in **4+**.

## Export compliance (asked at upload)
- "Does your app use non-exempt encryption?" → **No** (only standard HTTPS/TLS,
  which is exempt). This avoids needing extra documentation.

## App Review information (notes to the reviewer)
```
This is a free, read-only information app for the golf academy at Chiang Rai
International School (a real school). No account or login is required.

All content (program info, gallery, FAQ, fees) renders inside the app. The only
outbound links are: the admissions enquiry form on the school's website
(golf.cris.ac.th), a mailto to the admissions office, and YouTube (privacy-
enhanced, no-cookie) videos that load only when the user taps play.

The app collects no personal data.
```
- **Sign-in required:** No · **Demo account:** Not needed.

---

## Screenshots (required)
Provide at least one set at an iPhone 6.9" or 6.7" size; up to 10 per size/localization.

| Device size | Portrait px | Example models |
|---|---|---|
| iPhone 6.9" | 1320 × 2868 | 16 Pro Max / 15 Pro Max |
| iPhone 6.7" | 1290 × 2796 | 15 Pro Max / 14 Pro Max |
| iPad 13" (only if iPad supported) | 2064 × 2752 | iPad Pro 13" |

Suggested 5 shots (one per key screen): **Home**, **About / levels**,
**Gallery**, **Tuition (currency toggle)**, **FAQ**.

> These can be generated from the live PWA at the exact device resolutions —
> ask and I'll produce them.

---

## Content to finalize before public submission (not needed for TestFlight)
- ☐ Confirm CNY / THB fee reference rates with the school (`config/fees.ts`).
- ☐ Professional KO / ZH / TH translations for the intro & admissions body text
  (currently English fallback on those screens).
- ☐ Localized App Store descriptions (KO / ZH / TH) if desired.
