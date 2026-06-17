# CRIS Golf Program — Code Style & Structure Guide

A practical guide for keeping the app's code **clean, consistent, and easy to read**. It's written for this specific project: a read-only, four-language information PWA (then wrapped natively) built with a React/Next.js static-export stack, Tailwind CSS, and an i18n library.

The single most important rule: **write code for the next person to read, not just for the computer to run.** When in doubt, choose the clearer option even if it's longer.

---

## 1. Guiding principles

1. **Clarity over cleverness.** A longer, obvious line beats a short, clever one.
2. **Names should explain themselves.** A reader should understand a variable from its name alone, without hunting for where it's defined.
3. **One job per thing.** Each file, component, and function should do one understandable thing.
4. **No magic values.** URLs, languages, and fixed strings live in named config, never scattered as literals.
5. **Separate content from code.** Text the user sees lives in translation/content files, not hard-coded in components.
6. **Consistency beats personal preference.** Follow the patterns here even if you'd personally do it differently.

---

## 2. Naming — the core rule

**Use full, descriptive names. Never use abbreviations, single letters, or numbered names that a reader has to decode.**

The only acceptable short names are the universal loop/throwaway conventions used briefly: `i` for an index in a short loop, and `map`/`filter` callback parameters when the meaning is obvious (and even then, prefer a real name).

### 2.1 Variables and constants

| ❌ Hard to understand | ✅ Clear |
|---|---|
| `lang`, `l`, `lng` | `currentLanguage`, `selectedLanguage` |
| `url`, `link1`, `aUrl` | `admissionsEnquiryUrl` |
| `data`, `arr`, `items2` | `tuitionFeeItems`, `galleryPhotos` |
| `pl`, `levels` | `programLevels` |
| `qa`, `list` | `faqEntries` |
| `cfg`, `LINKS2` | `externalLinks`, `EXTERNAL_LINKS` |
| `tmp`, `x`, `val` | `formattedFeeAmount` |
| `img`, `pic` | `programPhoto`, `coverImage` |

- **Collections are plural:** `programLevels`, `faqEntries`, `supportedLanguages`. A single item is singular: `programLevel`, `faqEntry`.
- **Constants that never change** use `UPPER_SNAKE_CASE`: `EXTERNAL_LINKS`, `SUPPORTED_LANGUAGES`, `DEFAULT_LANGUAGE`.
- **Everything else** uses `camelCase`: `selectedLanguage`, `isMenuOpen`.

### 2.2 Booleans — start with a question word

Booleans read as a yes/no question: prefix with `is`, `has`, `should`, or `can`.

```ts
const isLanguageMenuOpen = true;
const hasIntroVideo = program.videoUrl !== null;
const shouldShowHandoffNotice = true;
const canInstallApp = true;
```

Avoid bare nouns (`menu`, `video`, `notice`) or vague flags (`flag`, `check`, `done`).

### 2.3 Functions — verb + what it does

Functions *do* something, so they start with a verb and say what they return or change.

| ❌ | ✅ |
|---|---|
| `fee()`, `t2()` | `formatFeeAmount()`, `getTranslatedText()` |
| `doIt()`, `handle()` | `openAdmissionsEnquiry()` |
| `data()` | `loadGalleryPhotos()` |

- **Event handlers** are named `handleSomething` where defined, and passed to props named `onSomething`:

```tsx
function handleLanguageSelect(language: Language) { /* ... */ }

<LanguageSwitcher onLanguageSelect={handleLanguageSelect} />
```

### 2.4 Components, files, and types

- **Components** use `PascalCase` and a noun describing what they are: `LanguageSwitcher`, `ProgramCard`, `TuitionFeeTable`, `HandoffNotice`. Not `LangSw`, `Comp1`.
- **Component file name matches the component:** `LanguageSwitcher.tsx` exports `LanguageSwitcher`.
- **Utility files** use `camelCase`: `formatFeeAmount.ts`.
- **Types and interfaces** use `PascalCase` and describe the shape: `ProgramLevel`, `FaqEntry`, `TuitionFeeItem`, `Language`. Component prop types are the component name plus `Props`: `LanguageSwitcherProps`.

---

## 3. Project structure

A predictable folder layout so anyone can guess where a thing lives. (Adjust exact paths to the chosen framework version at scaffold time, but keep the intent.)

```
/app or /src
  /app                      # routes (one folder per screen)
    /[locale]               # language-aware routing: /en, /ko, /zh, /th
      /admissions
      /tuition
      /gallery
      /faq
      layout.tsx
      page.tsx              # Home / Entry screen
  /components
    /ui                     # small reusable pieces: Button, Card, Section
    /layout                 # Header, Footer, LanguageSwitcher
    /screens                # composite blocks specific to one screen
  /content                  # static content, separated per language
    /en  /ko  /zh  /th
  /messages                 # i18n dictionaries (en.json, ko.json, zh.json, th.json)
  /config
    links.ts                # the single source of external URLs
    languages.ts            # supported languages + default
  /lib                      # pure helper functions (no UI)
  /types                    # shared TypeScript types
  /public                   # icons, splash, manifest, static images
```

**Rules:**
- A component used in only one screen lives near that screen; a component used everywhere lives in `/components/ui` or `/components/layout`.
- No business logic inside route files — they compose components and pass data.
- Keep files reasonably small. If a component file passes ~150 lines, look for a piece to extract.

---

## 4. Configuration — one source of truth

All external URLs and fixed choices live in `/config`, never as inline strings in components. This is what makes the planned "swap the admissions link when the real form launches" a **one-line change**.

```ts
// config/links.ts
export const EXTERNAL_LINKS = {
  // Swap this single value when the real online application form launches.
  admissionsEnquiry: "https://golf.cris.ac.th/contact",
  requestInfoEmail: "mailto:admission@cris.ac.th",
  phoneNumber: "tel:+6653600900",
} as const;
```

```ts
// config/languages.ts
export const SUPPORTED_LANGUAGES = ["en", "ko", "zh", "th"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = "en";
```

If you ever type a URL or a fixed string twice, it belongs in config instead.

---

## 5. Internationalization — no hard-coded user text

**Every word the user reads comes from a translation file.** No exceptions, including button labels, error messages, and alt text.

- **Translation keys are descriptive and namespaced by screen:**

```jsonc
// messages/en.json
{
  "admissions": {
    "title": "Admissions",
    "enquireButton": "Contact Admissions",
    "handoffNotice": "You're leaving the CRIS Golf Program app..."
  },
  "tuition": {
    "title": "Tuition & Fees",
    "contactPrompt": "Contact admissions to arrange payment."
  }
}
```

- Use `admissions.enquireButton`, not `btn1` or `msg5`.
- Keep the same key structure across all four files (`en`, `ko`, `zh`, `th`) so a missing translation is obvious.
- If a translation is missing, fall back to English rather than showing a raw key.
- The four files must stay in sync — same keys, different values.

---

## 6. Content data — typed and separated

Longer or list-shaped content (program levels, FAQ, tuition figures, gallery) is data, not markup. Store it as typed structures, separate from the components that display it.

```ts
// types/program.ts
export interface ProgramLevel {
  id: "junior" | "intermediate" | "advanced";
  gradeRange: string;       // e.g. "Grades 4–5"
  hasBoarding: boolean;
}

// types/tuition.ts
export interface TuitionFeeItem {
  labelKey: string;         // i18n key, not the literal label
  amountInBaht: number;
  isOnceOff: boolean;
}
```

The Tuition screen then maps over `tuitionFeeItems` and formats amounts with a single helper (`formatFeeAmount`) — no hard-coded numbers in JSX.

---

## 7. Components

- **One component per file.** The default export's name matches the file name.
- **Type every prop** with an explicit `Props` interface. No untyped props, no `any`.
- **Keep components focused.** A component either arranges layout *or* renders one clear piece — not both a big data fetch and a big render.
- **Prefer composition over flags.** Two small components beat one component with a `variant="big" | "small" | "weird"` switch, unless the variants are genuinely the same thing.

```tsx
interface ProgramCardProps {
  programLevel: ProgramLevel;
  onSelect: (programId: ProgramLevel["id"]) => void;
}

export function ProgramCard({ programLevel, onSelect }: ProgramCardProps) {
  return (
    <button onClick={() => onSelect(programLevel.id)}>
      {/* label comes from i18n, not hard-coded */}
    </button>
  );
}
```

---

## 8. TypeScript

- **Turn on `strict` mode** and keep it on.
- **Never use `any`.** If a type is genuinely unknown, use `unknown` and narrow it.
- **Let inference work** for obvious local values, but **write explicit return types** for exported functions and components so the contract is clear.
- **Model the domain with types**, not loose strings: `Language`, `ProgramLevel`, `FaqEntry`. A `Language` union prevents typos like `"kr"` instead of `"ko"`.

---

## 9. Styling (Tailwind CSS)

- **Mobile-first.** Design the small-screen layout first, then add larger breakpoints. This is a phone app before anything else.
- **Use theme tokens for brand colours** (the CRIS navy/gold) defined once in the Tailwind config — never paste raw hex values repeatedly in markup.
- **Extract repetition into a component, not a wall of duplicated classes.** If three buttons share twenty classes, make a `Button`.
- **Avoid arbitrary one-off values** (`mt-[13px]`) unless there's a real reason; stick to the spacing scale.
- Keep class lists readable; group by purpose (layout → spacing → colour → state) and let the formatter handle ordering.

*(Exact design tokens — colours, fonts, spacing — are set when the UI is scaffolded; this section is about how to apply them consistently.)*

---

## 10. External links & the hand-off

There is exactly one true external hand-off (the admissions enquiry) plus an email link.

- Open external pages in the **visible in-app/system browser**, never a hidden webview, so the user clearly sees they've left the app.
- Always show the **hand-off notice** (from i18n) before sending the user to CRIS's site, because that site collects personal data and this app does not.
- Route every external open through one small helper so the behaviour (and the notice) is identical everywhere:

```ts
// lib/openExternalLink.ts — single place that handles all outbound links
export async function openExternalLink(url: string): Promise<void> { /* ... */ }
```

---

## 11. Accessibility (a public school app — get this right)

- Use **semantic HTML**: a real `<button>` for actions, `<a>` for navigation, headings in order.
- Every image needs **descriptive alt text** pulled from i18n (gallery photos especially).
- Set the page **`lang` attribute** to match the active language so screen readers pronounce correctly.
- Ensure visible **focus states** and adequate colour contrast.

---

## 12. Comments & documentation

- Comment **why**, not **what**. The code already says what it does; explain the reasoning that isn't obvious.
- Good comment: `// Swap this when the real application form launches.`
- Pointless comment: `// set language to english` above `selectedLanguage = "en"`.
- Add a short JSDoc block above exported helpers and shared types.
- A brief `README.md` explains how to run, build, deploy to Vercel, and (later) wrap with the native shell.

---

## 13. Formatting & tooling

- **Prettier** for formatting and **ESLint** for catching problems — both run automatically; never hand-format.
- **TypeScript strict** must pass with no errors before committing.
- Use **absolute imports** (`@/components/...`) instead of long relative chains (`../../../`).
- Order imports: external packages first, then internal modules, then styles.

---

## 14. Git hygiene

- **Small, focused commits** — one logical change each.
- **Descriptive messages** in the imperative: `Add language switcher to header`, not `stuff`, `fix`, `update`.
- Keep the main branch always working; build features on branches.

---

## 15. Quick checklist before opening a pull request

- [ ] Every name reads clearly on its own — no abbreviations or numbered names.
- [ ] No user-facing text hard-coded — it's all in the four translation files, keys in sync.
- [ ] No URLs or fixed strings duplicated — they live in `/config`.
- [ ] Components are small and single-purpose; props are typed; no `any`.
- [ ] Images have alt text; buttons and links use the right element.
- [ ] External links go through the one helper and show the hand-off notice.
- [ ] Prettier, ESLint, and TypeScript all pass.
- [ ] Commit messages describe the change clearly.