/**
 * getDictionary — loads the JSON dictionary for the given locale.
 *
 * This is a synchronous import used at build time (for generateStaticParams
 * and layout metadata) and at runtime in server/client components.
 *
 * Because Next.js static export pre-renders every [locale] page,
 * each locale's dictionary is bundled at build time — no runtime fetch needed.
 */

import type { Dictionary, Locale } from "./types";
import en from "./dictionaries/en.json";
import ko from "./dictionaries/ko.json";
import zh from "./dictionaries/zh.json";
import th from "./dictionaries/th.json";

const dictionaries: Record<Locale, Dictionary> = {
  en: en as Dictionary,
  ko: ko as Dictionary,
  zh: zh as Dictionary,
  th: th as Dictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
