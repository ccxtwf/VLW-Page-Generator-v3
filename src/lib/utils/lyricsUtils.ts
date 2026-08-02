import { LANGUAGES, TRANSLATORS } from "../../constants";
import type { LyricRowData, MultiSelectItem } from "../../schemas/form";

/**
 *
 * @param languages
 * @returns
 */
export function getLanguageMetadata(languages: MultiSelectItem[]): {
  headers: string[];
  needsRomanization: boolean;
  needsTranslation: boolean;
  isChinese: boolean;
  isoLangCode: string | null;
} {
  let headers: string[] = [];
  let needsRomanization = false;
  let needsTranslation = true;
  let isChinese = false;
  let isoLangCode = null;

  if (languages.length === 0) {
    return {
      headers: ["Original", "Romanized", "English"],
      needsRomanization: true,
      needsTranslation: true,
      isChinese: false,
      isoLangCode: null,
    };
  }

  const ll = languages.map(({ value }) => LANGUAGES[value]);

  const originalLanguages = ll.length < 4 ? ll.map(({ name }) => name) : ["Original"];
  needsRomanization = ll.some(({ transliteration }) => !!transliteration);
  needsTranslation = ll.some(({ name }) => {
    return name !== "English" && name !== "Non-lexical lyrics";
  });
  isChinese = ll.some(({ isChinese }) => isChinese);
  isoLangCode = ll[0]?.iso || null;

  headers.push(originalLanguages.join("/"));

  if (needsRomanization) {
    const romanizationSystems = new Set<string>(
      ll.map(({ transliteration }) => transliteration).filter((el) => !!el) as Iterable<string>,
    );
    headers.push(
      (romanizationSystems.size < 4 ? Array.from(romanizationSystems.keys()) : ["Romanized"]).join(
        "/",
      ),
    );
  }

  if (needsTranslation) {
    headers.push("English");
  }

  return { headers, needsRomanization, needsTranslation, isChinese, isoLangCode };
}

/**
 *
 * @param headers
 * @param needsRomanization
 * @param showEnglishColumn
 * @param isoLangCode
 * @returns
 */
export function generateLyricsToggle(
  headers: string[],
  needsRomanization: boolean,
  showEnglishColumn: boolean,
  isoLangCode?: string,
) {
  const lookupOriginalColumnSemanticId: Record<string, string> = {
    Japanese: "jp",
    Mandarin: "cn",
    Korean: "kr",
    Cantonese: "yue",
    Spanish: "sp",
    Portuguese: "pt",
    Indonesian: "id",
    French: "fr",
    German: "de",
    Russian: "ru",
  };
  const lookupRomanizedColumnSemanticId: Record<string, string> = {
    Romanized: "rom",
    Romaji: "rom",
    Romaja: "rom",
    Pinyin: "py",
  };
  const skipCustomLangIsoCode: Record<string, string> = {
    Japanese: "ja",
    Mandarin: "zh-Hans",
    Korean: "ko",
    Cantonese: "zh-Hant",
    Spanish: "es",
    Portuguese: "pt",
    Indonesian: "id",
    French: "fr",
    German: "de",
    Russian: "ru",
  };

  let res = "{{lyrics toggle|";
  let idx = 0;
  res += `${lookupOriginalColumnSemanticId[headers[idx]] || "org"}:${headers[idx++]}`;
  if (needsRomanization) {
    res += `|${lookupRomanizedColumnSemanticId[headers[idx]] || "rom"}:${headers[idx++]}`;
  }
  if (showEnglishColumn) {
    res += `|eng:${headers[idx++]}`;
  }
  if (
    !(headers[0] in skipCustomLangIsoCode) ||
    (isoLangCode && skipCustomLangIsoCode[headers[0]] !== isoLangCode)
  ) {
    res += `|iso-lang=${isoLangCode}`;
  }
  res += "}}";
  return res;
}

export function generateLyricsTable(
  lyrics: LyricRowData[],
  {
    headers,
    needsRomanization,
    needsTranslation,
    isoLangCode,
    translator,
    isOfficialTranslation,
    bgColour,
    fgColour,
    createToggleElement = true,
  }: {
    headers: string[];
    needsRomanization: boolean;
    needsTranslation: boolean;
    isoLangCode?: string;
    translator?: string;
    isOfficialTranslation: boolean;
    bgColour?: string;
    fgColour?: string;
    createToggleElement?: boolean;
  },
): string {
  const outputAsWikiTable = needsRomanization || needsTranslation;
  const hasEnglishTranslation = lyrics.some((lyric) => !!lyric.english && lyric.english !== "");
  const showEnglishColumn = needsTranslation && hasEnglishTranslation;

  headers = headers.filter((header) => header !== "");

  let showNotes: boolean = false;
  let isTranslationNote: boolean | null = null;
  const rxRefTag = /<ref(?:[^>]*)>/;
  const rxSpanInlineColour =
    /<span\s+style\s*=\s*["'][^>]*color\s*:\s*([a-zA-Z0-9#]+)\s*[^>]*["']>.*?<\/span>/gm;
  let usedColours: Set<string> = new Set();
  for (let lyric of lyrics) {
    let detectedRowColour = lyric.customStyle.match(/color\s*:\s*([#0-9a-zA-Z]+);?/);
    if (detectedRowColour === null) {
      usedColours.add("");
    } else {
      usedColours.add(detectedRowColour[1]);
    }
    const detectedInlineColours = lyric.original.matchAll(rxSpanInlineColour);
    for (let [_, colour] of detectedInlineColours) {
      usedColours.add(colour);
    }
    if (lyric.original.match(rxRefTag) || (lyric?.romanized || "").match(rxRefTag)) {
      showNotes = true;
      isTranslationNote = isTranslationNote || false;
    } else if (hasEnglishTranslation && (lyric?.english || "").match(rxRefTag)) {
      showNotes = true;
      isTranslationNote = true;
    }
  }

  let res: string = "";

  if (createToggleElement && (needsRomanization || needsTranslation)) {
    // Lyrics toggle & column headers definition
    res += generateLyricsToggle(headers, needsRomanization, showEnglishColumn, isoLangCode);
    res += "\n";
  }

  if (outputAsWikiTable && hasEnglishTranslation && isOfficialTranslation) {
    res += "{{OfficialEnglishNotify}}\n";
  }

  // Translator license
  const referLicense = TRANSLATORS.find(({ name }) => name === translator);
  if (referLicense) {
    res += `{{TranslatorLicense|${referLicense.name}}}\n`;
  }

  // Singer coloured lines
  if (usedColours.size > 1) {
    let hasMultipleSingerLines = usedColours.has("");
    if (hasMultipleSingerLines) usedColours.delete("");
    let singerTabs = [...usedColours]
      .map((el) => `|<span style="color:${el};">Singer</span>\n`)
      .join("");
    if (hasMultipleSingerLines) singerTabs += "|All\n";
    res += `{| border="1" cellpadding="4" style="border-collapse:collapse; border:1px groove; line-height:1.5"\n!style="background-color:${bgColour}; color:${fgColour};"|Singer\n${
      singerTabs
    }|}\n`;
  }

  if (outputAsWikiTable) {
    // Generate as multi-column table
    res += `{| {{lyrics table class}}\n|- class="lyrics-table-header"\n! {{lyrics header}}\n`;
    res += lyrics.map((lyric) => lyric.getWikitext(showEnglishColumn)).join("");
    res += "|}";

    if (hasEnglishTranslation && (!isOfficialTranslation || translator !== "")) {
      res += `\n{{Translator|${translator === "" ? "Anonymous" : translator}}}`;
    }
  } else {
    // Generate as single-column div
    let prevLyrics: LyricRowData | null = null;
    const arrSpans: { contents: string; customStyle: string | null }[] = [];
    let curSpan: { contents: string; customStyle: string | null } = {
      contents: "",
      customStyle: null,
    };
    for (const lyric of lyrics) {
      // Skip line breaks
      if (lyric.original === "") {
        curSpan.contents += "\n";
        continue;
      }
      // Add to array of spans to take note of when a change in text colour is detected
      if (prevLyrics !== null && lyric.customStyle !== prevLyrics.customStyle) {
        arrSpans.push(curSpan);
        curSpan = { contents: "", customStyle: null };
      }
      if (lyric.customStyle !== "") curSpan.customStyle = lyric.customStyle;
      // Store current line
      curSpan.contents += lyric.original + "\n";
      // Save lyrics to be compared
      prevLyrics = lyric;
    }
    arrSpans.push(curSpan);
    console.log(arrSpans);

    res += `<poem>${arrSpans
      .map(({ contents, customStyle }) => {
        contents = contents.replace(/\n$/, "");
        if (customStyle !== null) {
          contents = `<span style="${customStyle}">${contents}</span>`;
        }
        return contents;
      })
      .join("\n")}</poem>`;
  }

  // Lyrics/Translation Notes
  if (showNotes) {
    res += `\n\n==${isTranslationNote ? "Translation " : ""}Notes==\n{{Reflist}}`;
  }
  return res;
}
