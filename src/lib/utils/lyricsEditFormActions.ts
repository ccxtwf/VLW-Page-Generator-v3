import { detonePinyin } from "./utils";

/**
 * Parse the lyrics from the given wikipage string.
 *
 * @param wikipageContents
 */
export function extractLyricsTablesFromWikipageSrc(wikipageContents: string): RegExpMatchArray[] {
  const rx =
    /(?<toggle>\{\{(?:[Tt]emplate:|)[Ll]yrics[ _]toggle[^}]+\}\})(?<moreNotifs>.*?)(?:\{\|\s*\{\{(?:[Tt]emplate:|)[Ll]yrics[ _]table[ _]class\}\}\s*\n\|-\s*class\s*=\s*["'][^\n]*\blyrics-table-header\b[^\n]*["']\s*\n!\s*\{\{(?:[Tt]emplate:|)[Ll]yrics[ _]header\}\})\s*\n(?<rows>.*?)\|\}\s*(?<translator>\{\{(?:[Tt]emplate:|)[Tt]ranslator\|[^}]*\}\}|)/gs;
  return Array.from(wikipageContents.matchAll(rx));
}

/**
 * Parse the lyrics from the supplied RegExpMatchArray object provided by `extractLyricsTablesFromWikipageSrc`.
 *
 * @param rxResults
 * @returns `[toggleText, lyrics, translator, isOfficialTranslation]`
 */
export function parseLyrics(rxResults: RegExpMatchArray): [string, string[][], string, boolean] {
  const toggleText = rxResults.groups!.toggle;
  const nColumns = Array.from(toggleText.matchAll(/\|/g)).length;

  let translator = "";
  if (rxResults.groups!.translator) {
    const m = rxResults.groups!.translator.match(
      /\{\{(?:[Tt]emplate:|)[Tt]ranslator\|([^|]+).*?\}\}/,
    );
    if (m) {
      translator = m[1];
    }
  }

  const isOfficialTranslation =
    rxResults.groups!.moreNotifs.match(/\{\{[Oo]fficialEnglishNotify[^}]*\}\}/) !== null;

  const lyrics: string[][] = [];
  const tblRows = rxResults.groups!.rows.matchAll(
    /\|- *(?<style>.*?)\n(?<cells>[^]*?)\n(?=\|-|$)/g,
  );
  for (const row of tblRows) {
    const ms = row.groups!.style.match(/style\s*=\s*["']\s*([^\n]*?)\s*;*\s*["']/);
    const customStyle = ms ? ms[1] + ";" : "";
    const cells = Array.from(row.groups!.cells.matchAll(/(?<=\n\||^\|).*?(?=\n\||$)/g));
    const a: string[] = [];
    for (const cell of cells) {
      let cellContents = (cell[0] || "").trim();
      if (cells.length === 1 && cellContents.match(/<br\s*\/?>/)) {
        a.push(...Array(nColumns).fill(""));
        break;
      }
      const msh = cellContents.match(
        /^\s*(\{\{(?:[Tt]emplate:|)[Ss]hared(?:\s*\|\s*(?<colspan>\d+)\s*|\s*)\}\}|colspan=\s*(?:["']|)\s*(?<colspan>\d+)\s*(?:["']|)[^\n]*?\|)\s*/,
      );
      if (msh) {
        let repeat = nColumns - a.length;
        if (msh.groups!.colspan) {
          repeat = Math.min(repeat, +msh.groups!.colspan);
        }
        cellContents = cellContents.replace(msh[0], "");
        a.push(...Array(repeat).fill(cellContents));
      } else {
        a.push(cellContents);
      }
      if (a.length >= nColumns) {
        break;
      }
    }
    lyrics.push([customStyle, ...a]);
  }
  return [toggleText, lyrics, translator, isOfficialTranslation];
}

/**
 * One of the actions that may be deployed on the Lyrics Editor form.
 *
 * @param lyrics
 * @returns
 */
export function consolidateCellInlineColourFormatting(lyrics: unknown[][]): string[][] {
  const rxCellInlineColourFormatting =
    /^\s*<[Ss][Pp][Aa][Nn]\s+style\s*=\s*["']\s*color\s*:\s*([a-zA-Z0-9#]+);?["']\s*>(.*)<\/\s*[Ss][Pp][Aa][Nn]\s*>\s*$/;
  const rxSpanTagHead = /<span(?:\s+[^>]+|)\s*>/i;
  return lyrics.map((lyric) => {
    let m = [];
    for (let i = 1; i < lyric.length; i++) {
      const l = ((lyric[i] as string) || "").trim();
      const rxResults = l.match(rxCellInlineColourFormatting);
      m.push({ rxResults, isEmpty: l === "" });
    }
    if (m.every((el) => el.isEmpty || !!el.rxResults)) {
      // Skip if the contents enclosed within the span tags in the original lyrics contain another span tag.
      if (!!m[0].rxResults && !m[0].rxResults[2].match(rxSpanTagHead)) {
        lyric[0] = `color:${m[0].rxResults[1]};`;
        for (let i = 1; i < lyric.length; i++) {
          if (m[i - 1].rxResults) {
            lyric[i] = m[i - 1].rxResults![2];
          }
        }
      }
    }
    return lyric as string[];
  });
}

/**
 * One of the actions that may be deployed on the Lyrics Editor form.
 *
 * @param lyrics
 * @returns
 */
export function decapitalizeRomanization(lyrics: unknown[][]): string[][] {
  return lyrics.map((lyric) => {
    lyric[2] = ((lyric[2] as string) || "").trim().replace(/^(?:["'`]*)\w/, (match: string) => {
      return match.toLowerCase();
    });
    lyric[2] = (lyric[2] as string).replace(
      /([.?!])\s*(["'`]*\s*)(\w)/g,
      (_, p: string, a: string, match: string) => {
        return `${p} ${a}${match.toLowerCase()}`;
      },
    );
    return lyric as string[];
  });
}

/**
 * One of the actions that may be deployed on the Lyrics Editor form.
 *
 * @param lyrics
 * @returns
 */
export function detonePinyinLyrics(lyrics: unknown[][]): string[][] {
  return lyrics.map((lyric) => {
    lyric[2] = detonePinyin(((lyric[2] as string) || "").trim(), true);
    return lyric as string[];
  });
}

/**
 * One of the actions that may be deployed on the Lyrics Editor form.
 *
 * @param lyrics
 * @returns
 */
export function standardizeHepburnRomanization(lyrics: unknown[][]): string[][] {
  return lyrics.map((lyric) => {
    lyric[2] = ((lyric[2] as string) || "")
      .trim()
      .replace(/(?=\b)(wo|he)(?<=\b)/gi, (match: string) => {
        switch (match) {
          case "wo":
            return "o";
          case "he":
            return "e";
          default:
            return "";
        }
      });
    lyric[2] = ((lyric[2] as string) || "").trim().replace(/dzu/gi, "zu");
    return lyric as string[];
  });
}