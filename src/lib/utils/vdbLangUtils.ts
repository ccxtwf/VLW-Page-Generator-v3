import type { MultiSelectItem } from "#src/schemas/form.js";
import { LANGUAGES } from "../../constants";

type ValidLanguage = (typeof LANGUAGES)[number]["name"];

// From https://github.com/VocaDB/vocadb/blob/main/VocaDbWeb/Scripts/Components/extendedUserLanguageCultures.ts
const __dictConvertCultureCodes: Record<string, ValidLanguage> = {
  en: "English",
  ang: "English",
  qpl: "English", //Pig Latin
  /// Arabic
  arq: "Arabic",
  ar: "Arabic",
  arz: "Arabic",
  arb: "Arabic",
  aec: "Arabic",
  /// European languages
  eu: "Basque",
  be: "Belarusian",
  bg: "Bulgarian",
  ca: "Catalan",
  hrv: "Croatian",
  cs: "Czech",
  da: "Danish",
  nl: "Dutch",
  et: "Estonian",
  fi: "Finnish",
  qfd: "Dutch",
  fr: "French",
  de: "German",
  el: "Greek",
  hu: "Hungarian",
  ga: "Irish",
  it: "Italian",
  no: "Norwegian",
  pl: "Polish",
  ro: "Romanian",
  ru: "Russian",
  gla: "Gaelic",
  sr: "Serbian",
  sk: "Slovak",
  es: "Spanish",
  pt: "Portuguese",
  qbp: "Portuguese",
  sv: "Swedish",
  tr: "Turkish",
  uk: "Ukrainian",
  cy: "Welsh",
  sah: "Yakut",
  yi: "Yiddish",
  la: "Latin",
  /// Americas
  chr: "Cherokee",
  /// Africas
  so: "Somali",
  /// Chinese
  zh: "Mandarin",
  cmn: "Mandarin",
  yue: "Cantonese",
  ltc: "Old-Middle Chinese",
  och: "Old-Middle Chinese",
  wuu: "Northern Wu",
  // gan: "Mandarin",
  // hnm: "Mandarin",
  // cdo: "Mandarin",
  // hak: "Mandarin",
  // hbl: "Mandarin",
  // cjy: "Mandarin",
  // cpx: "Mandarin",
  // nan: "Mandarin",
  // tws: "Mandarin",
  /// Misc Sino
  ja: "Japanese",
  ojp: "Japanese",
  ko: "Korean",
  okm: "Korean",
  /// Misc Asian
  ain: "Ainu",
  hi: "Hindi",
  id: "Indonesian",
  ms: "Malay",
  tl: "Filipino",
  th: "Thai",
  ur: "Urdu",
  vi: "Vietnamese",
  mn: "Mongolian",
  sun: "Sundanese",
  /// Conlang
  eo: "Esperanto",
  tok: "Toki Pona",
  qfl: "Conlang",
  zxx: "Nonlexical",
};

/**
 * Returns true if `b` is a language culture code that is covered under `a`, e.g.
 *  - `languageIsEqual('zh', 'zh') -> true`
 *  - `languageIsEqual('zh', 'zh-Hans') -> true`
 *  - `languageIsEqual('zh-Hans', 'zh') -> false`
 *  - `languageIsEqual('zh', 'ja') -> false`
 *  - `languageIsEqual('ar', 'arb') -> false`
 *
 * @param a
 * @param b
 */
function langCultureCodeIsEqual(a: string, b: string) {
  if (a === b) {
    return true;
  }
  return b.startsWith(a + "-");
}

export function convertVdbCultureCode(codes: string[]): [MultiSelectItem[], string] {
  const langOptions: MultiSelectItem[] = [];
  let isoLangCode: string | null = null;
  for (const code of codes) {
    const langName = __dictConvertCultureCodes[code] ?? null;
    if (!langName) {
      isoLangCode = isoLangCode ?? code;
      continue;
    }
    const f = LANGUAGES.findIndex(({ name }) => name === langName);
    if (!isoLangCode && (!LANGUAGES[f].iso || !langCultureCodeIsEqual(code, LANGUAGES[f].iso))) {
      isoLangCode = code;
    }
    langOptions.push({ label: langName, value: f });
  }
  return [langOptions, isoLangCode ?? ""];
}