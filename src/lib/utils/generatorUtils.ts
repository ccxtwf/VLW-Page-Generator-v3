import { VOCADB_ENTRYPOINT, VOCALOID_LYRICS_WIKI_NAME } from "../../config";
import type {
  AlbumTrackData,
  ExternalLink,
  PlayLinkData,
  ProducerDiscographyItem,
} from "../../schemas/form";
import { escapeRegExp } from "./utils";

const rxVocadb = new RegExp(`^${escapeRegExp(VOCADB_ENTRYPOINT)}`);
const rxMiraheze = /^https?:\/\/(.*?).miraheze\.org\/wiki\/(.*)/;
const rxFandom = /^https?:\/\/(.*?).fandom\.com\/wiki\/(.*)/;
const rxHmWiki = /^https?:\/\/w\.atwiki\.jp\/hmiku\/pages\/(\d+)\.html$/;
const rxMgp = /^https?:\/\/zh\.moegirl\.org\.cn\/(.+)$/;

const RECOGNIZED_MH_INTERWIKI: Record<string, string> = {
  nndcompass: "nndcompass",
  projectsekai: "sekaipedia",
  bandori: "bandori",
};

const RECOGNIZED_FANDOM_INTERWIKI: Record<string, string> = {
  vocaloid: "vocaloid",
  synthv: "synthv",
  cevio: "cevio",
  deepvocal: "deepvocal",
  utau: "utau",
  utaite: "utaite",
  virtualyoutuber: "vtuber",
  odorite: "odorite",
  projectsekai: "proseka",
  bandori: "bandori",
};

/**
 *
 * @param extLink
 */
export function getExternalLinkWikitext(extLink: ExternalLink): string {
  let wikitext: string = "";
  const { url, description, isInactive } = extLink;

  const rm: [RegExp, RegExpExecArray | null][] = [
    rxVocadb,
    rxMiraheze,
    rxFandom,
    rxHmWiki,
    rxMgp,
  ].map((rx) => [rx, rx.exec(url)]);
  for (const [rx, m] of rm) {
    if (m === null) {
      continue;
    }
    if (rx === rxVocadb) {
      wikitext = `{{VDB|${m[1]}}}${description === "VocaDB" ? "" : " - " + description}`;
    }
    if (rx === rxMiraheze) {
      const [_, p1, p2] = m;
      if (p1 === VOCALOID_LYRICS_WIKI_NAME) {
        const isCategory = /^[Cc]at(?:egory|)/.test(p2);
        wikitext = `[[${isCategory ? ":" : ""}${p2}|${description}]]`;
      } else if (p1 in RECOGNIZED_MH_INTERWIKI) {
        wikitext = `{{${RECOGNIZED_MH_INTERWIKI[p1]}|${p2}|${description}}}`;
      } else {
        wikitext = `[[mh:${p1}:${p2}|${description}]]`;
      }
    }
    if (rx === rxFandom) {
      const [_, p1, p2] = m;
      if (p1 in RECOGNIZED_FANDOM_INTERWIKI) {
        wikitext = `{{${RECOGNIZED_FANDOM_INTERWIKI[p1]}|${p2}|${description}}}`;
      } else {
        wikitext = `{{FandomWiki|${p1}|${p2}|${description}}}`;
      }
    }
    if (rx === rxHmWiki) {
      wikitext = `{{HMWiki|${m[1]}}}`;
    }
    if (rx === rxMgp) {
      wikitext = `{{MGP|${decodeURIComponent(m[1])}|Moegirlpedia}}`;
    }
    break;
  }

  if (!wikitext) {
    wikitext = `[${url} ${description}]`;
  }
  if (isInactive) {
    wikitext = `<s>${wikitext}</s>`;
  }
  return wikitext;
}

/**
 *
 * @param playLink
 * @returns
 */
export function getPlayLinkWikitext(playLink: PlayLinkData): string {
  const { url, isAutogen, isReprint, isDeleted } = playLink;

  let res = `{{#|${url}`;
  if (isAutogen) {
    res += `|auto=y`;
  }
  const annotations: string[] = [];
  if (isReprint) {
    annotations.push("reprint");
  }
  if (isDeleted) {
    annotations.push("deleted");
  }
  if (annotations.length) {
    res += `|label=${annotations.join(", ")}`;
  }
  res += "}}";
  return res;
}

/**
 *
 * @param playLink
 * @returns
 */
export function getFormattedViewCount(playLink: PlayLinkData): string {
  const { viewCount } = playLink;
  let viewCountStr = viewCount.trim();
  viewCountStr = viewCountStr.replace(/[,.]\s?(?=\d{3})/g, "");
  viewCountStr = viewCountStr.replace(/\+/g, "");

  //Round down view count number if numeric
  if (viewCountStr !== "" && !isNaN(+viewCountStr)) {
    let viewCount = parseInt(viewCountStr);
    let div = 1;
    if (viewCount < 1000) {
      div = 10 ** Math.trunc(Math.log10(viewCount));
    } else {
      div = 10 ** (Math.trunc(Math.log10(viewCount)) - 1);
    }
    viewCount = Math.floor(viewCount / div) * div;
    return viewCount.toLocaleString("en-US") + "+";
  }

  //Show view count number as text if non-numeric
  return viewCount;
}

/**
 *
 * @param track
 * @returns
 */
export function getCredits(track: AlbumTrackData): string {
  let credits: string = track.singerCredit;
  if (track.producerCredit !== "") {
    credits = `${track.producerCredit} ft. ${credits}`;
  }
  return credits;
}

/**
 *
 * @param item
 * @param forAlbum
 * @returns
 */
export function getDiscographyItemWikitext(
  item: ProducerDiscographyItem,
  forAlbum: boolean = false,
): string {
  let { page, additionalParameters: params } = item;
  if (params !== "" && !params.startsWith("|")) {
    params = `|${params}`;
  }
  return `{{${forAlbum ? "awt" : "pwt"} row|${page}${params}}}`;
}

/**
 * Generate {{links}} template.
 *
 * @param links
 * @returns
 */
export function getUnofficialProdLinks(links: ExternalLink[]): string {
  const rxCommonLinks = {
    MIKUWIKI: rxHmWiki,
    UTAUDB: /^https?:\/\/w\.atwiki\.jp\/utauuuta\/pages\/(\d*)\.html/,
    NICOPEDIA: /^https?:\/\/dic\.nicovideo\.jp\/id\/(.*)$/,
    VOCADB: new RegExp(`^${escapeRegExp(VOCADB_ENTRYPOINT)}Ar\\/(\\d*)`),
    NICOTAG: /^https?:\/\/www\.nicovideo\.jp\/tag\/(.*)$/,
    MGP: rxMgp,
  };
  const detectedDomains: any = {};
  let wikitextForUndetectedDomains: string = "";
  for (let link of links) {
    let domainIsDetected: boolean = false;
    for (let [key, rx] of Object.entries(rxCommonLinks)) {
      const m = rx.exec(link.url);
      if (m === null) {
        continue;
      }
      detectedDomains[key] = m[1];
      domainIsDetected = true;
      break;
    }
    if (!domainIsDetected) {
      wikitextForUndetectedDomains += `* ${getExternalLinkWikitext(link)}\n`;
    }
  }
  let wikitextForDetectedDomains = `
{{links |p=yes
  |atmiku = ${detectedDomains.MIKUWIKI || ""}
  |atutau = ${detectedDomains.UTAUDB || ""}
  |nico   = ${detectedDomains.NICOPEDIA || ""}
  |vocadb = ${detectedDomains.VOCADB || ""}
  |tag    = ${detectedDomains.NICOTAG || ""}
  |mgp    = ${detectedDomains.MGP || ""}
}}`.trim();

  return `${wikitextForDetectedDomains}\n${wikitextForUndetectedDomains}`;
}