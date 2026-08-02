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

/**
 *
 * @param contents
 * @returns
 */
export function renderTableCellWikitext(contents?: string): string {
  return `|${(contents || "")
    .replace(/^-/, "<nowiki>-</nowiki>")
    .replace(/(?<!<nowiki>|~)(~{3,})(?!~|<\/nowiki>)/g, "<nowiki>$1</nowiki>")}\n`;
}

/**
 *
 * @param lyrics
 * @param param1
 * @returns
 */
export function renderLyricsRowWikitext(
  lyrics: LyricRowData,
  {
    needsRomanization,
    needsTranslation,
    hasTranslation,
    showEnglishColumn,
  }: {
    needsRomanization: boolean;
    needsTranslation: boolean;
    hasTranslation: boolean;
    showEnglishColumn: boolean;
  },
) {
  let {
    customStyle = "",
    original = "",
    romanized = "",
    english = "",
    additionalColumns = [],
  } = lyrics;
  // customStyle = customStyle.trim();
  // original = original.trim();
  // romanized = romanized.trim();
  // english = english.trim();

  let wikitext: string = `|-${customStyle === "" ? "" : ` style="${customStyle}"`}\n`;

  /**
   * Merge the cells if:
   *  - The lyrics are in need of romanization & translation (with no additional columns),
   *    and the original, romanized, and English translation share the same text
   *  - The lyrics are in need of romanization & translation (with no additional columns &
   *    no translation), and the original and romanized columns share the same text
   *  - The lyrics are in need of translation but not romanization (with no additional columns)
   *    and the original and English translation share the same text
   *  - When additional columns are supplied, all additional columns must share the same text
   *    as the original
   *
   * Do not merge the cells if:
   *  - The current row is a line break (shared <br />)
   *  - There is only one column available
   */
  const compareCells = [
    original,
    ...(needsRomanization ? [romanized] : []),
    ...(needsTranslation && hasTranslation ? [english] : []),
    ...additionalColumns,
  ];
  let isLineBreak = false;
  const areColumnsShared = compareCells.every((s) => s === original);
  if (areColumnsShared && original === "") {
    isLineBreak = true;
  }

  if (isLineBreak) {
    wikitext += "|<br />\n";
  } else if (areColumnsShared) {
    wikitext += `| {{shared}} ${original}\n`;
  } else {
    wikitext += renderTableCellWikitext(original);
    if (needsRomanization) {
      wikitext += renderTableCellWikitext(romanized);
    }
    if (showEnglishColumn || (needsTranslation && hasTranslation)) {
      wikitext += renderTableCellWikitext(english);
    }
    if (additionalColumns.length) {
      for (const additionalColumn of additionalColumns) {
        wikitext += renderTableCellWikitext(additionalColumn);
      }
    }
  }
  return wikitext;
}

/**
 * Generate the wikitext for the informational table showing who's singing which part
 *
 * @param usedColours
 * @param bgColour
 * @param fgColour
 * @returns
 */
export function generateSingerPartsElement(
  usedColours: Set<string>,
  bgColour: string,
  fgColour: string,
): string {
  let hasMultipleSingerLines = usedColours.has("");
  if (hasMultipleSingerLines) {
    usedColours.delete("");
  }
  let singerTabs = [...usedColours]
    .map((el) => `|<span style="color:${el};">Singer</span>\n`)
    .join("");
  if (hasMultipleSingerLines) {
    singerTabs += "|All\n";
  }
  return `{| border="1" cellpadding="4" style="border-collapse:collapse; border:1px groove; line-height:1.5"\n!style="background-color:${bgColour}; color:${fgColour};"|Singer\n${
    singerTabs
  }|}\n`;
}

/**
 * Create &lt;poem&gt; element
 *
 * @param lyrics
 * @returns
 */
export function generateLyricsPoemElement(lyrics: LyricRowData[]): string {
  let res: string = "";

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
    if (lyric.customStyle !== "") {
      curSpan.customStyle = lyric.customStyle;
    }
    // Store current line
    curSpan.contents += lyric.original + "\n";
    // Save lyrics to be compared
    prevLyrics = lyric;
  }
  arrSpans.push(curSpan);

  res += `<poem>${arrSpans
    .map(({ contents, customStyle }) => {
      contents = contents.replace(/\n$/, "");
      if (customStyle !== null) {
        contents = `<span style="${customStyle}">${contents}</span>`;
      }
      return contents;
    })
    .join("\n")}</poem>`;
  return res;
}

/**
 *
 * @param lyrics
 * @param options
 * @returns
 */
export function generateLyricsSegment(
  lyrics: LyricRowData[],
  {
    headers,
    needsRomanization,
    needsTranslation,
    isoLangCode,
    translator,
    isOfficialTranslation,
    bgColour = "black",
    fgColour = "white",
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
  const hasTranslation = lyrics.some((lyric) => !!lyric.english);
  const showEnglishColumn = needsTranslation && hasTranslation;

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
    } else if (hasTranslation && (lyric?.english || "").match(rxRefTag)) {
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

  if (outputAsWikiTable && hasTranslation && isOfficialTranslation) {
    res += "{{OfficialEnglishNotify}}\n";
  }

  // Translator license
  const referLicense = TRANSLATORS.find(({ name }) => name === translator);
  if (referLicense) {
    res += `{{TranslatorLicense|${referLicense.name}}}\n`;
  }

  // Singer coloured lines
  if (usedColours.size > 1) {
    res += generateSingerPartsElement(usedColours, bgColour, fgColour);
  }

  if (outputAsWikiTable) {
    // Generate as multi-column table
    res += `{| {{lyrics table class}}\n|- class="lyrics-table-header"\n! {{lyrics header}}\n`;
    res += lyrics
      .map((lyric) =>
        renderLyricsRowWikitext(lyric, {
          needsRomanization,
          needsTranslation,
          hasTranslation,
          showEnglishColumn,
        }),
      )
      .join("");
    res += "|}";

    if (hasTranslation && (!isOfficialTranslation || translator !== "")) {
      res += `\n{{Translator|${translator === "" ? "Anonymous" : translator}}}`;
    }
  } else {
    res += generateLyricsPoemElement(lyrics);
  }

  // Lyrics/Translation Notes
  if (showNotes) {
    res += `\n\n==${isTranslationNote ? "Translation " : ""}Notes==\n{{Reflist}}`;
  }
  return res;
}
