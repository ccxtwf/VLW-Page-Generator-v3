import Song from "../models/Song.svelte";
import PlayLink from "../models/children/PlayLink.svelte";
import ExternalLink from "../models/children/ExternalLink.svelte";

import {
  VdbArtistCategory,
  VdbArtistRole,
  VdbPvService,
  VdbPvType,
  VdbSystemLanguage,
  VdbVocalSynthEngine,
  VdbWebLinkCategory,
  type FetchedVdbSongEntity,
} from "../../schemas/vocadb.d";

import { detonePinyin, parseDateAsUtc, renderAsCommaSeparatedList } from "../utils/utils";
import { processExternalLinkFromVocaDb } from "../utils/urlUtils";
import {
  convertArtistRole,
  convertPvService,
  getVdbPageId,
  getVocalistBasedOnVdbId,
} from "../utils/vdbUtils";
import { generateLyricsSegment, getLanguageMetadata } from "../utils/lyricsUtils";

import { VOCADB_ENTRYPOINT } from "../../config";
import { MONTHS, LANGUAGES, PV_SERVICE_ABBREVIATIONS } from "../../constants";
import { ExternalWebServiceError, VocaDBInvalidUrlError } from "./exceptions";

import type { MultiSelectItem } from "../../schemas/form";
import {
  ENUM_CW_STATES,
  ENUM_AI_WARNING_TYPE,
  ENUM_IMAGE_EMBED_SOURCE_TYPE,
} from "../models/enums";
import type { IImageEmbed } from "../models/schema";

/**
 *
 * @param formData
 * @returns
 */
export function generatePage(formData: Song): string {
  const {
    aiCwState,
    aiWarningText1,
    aiWarningText2,
    cwState,
    cwText,
    hasEpilepsyWarning,
    origTitle,
    altChTitle,
    altChIsTraditional,
    romTitle,
    engTitle,
    titleIsOfficiallyTranslated,
    bgColour,
    fgColour,
    uploadDate,
    singers,
    producers,
    description,
    languages,
    isoLangCode,
    isUnavailable,
    isAlbumOnly,
    translator,
    isOfficialTranslation,
    categories,
  } = formData;

  const lyrics = formData.lyrics;
  const playLinks = formData.playLinks.filter(({ url }) => url);
  const extLinks = formData.extLinks.filter(({ url }) => url);

  let displayTitleTemplate: string = "";
  let sortTemplate: string = "";
  let unavailableTemplate: string = "";
  let cwTemplates: string = "";
  let titlesSegment: string = "";
  let dateSegment: string = "";
  let lyricsSegment: string = "";
  let songLinksSegment: string = "";
  let viewCountsSegment: string = "";
  let languageSegment: string = languages.map(({ label }) => label).join(";");
  let officialLinksWikitext: string = "";
  let unofficialLinksWikitext: string = "";
  let extLinksSegment: string = "";

  const langMetadata = getLanguageMetadata(languages);

  if (langMetadata.needsRomanization && romTitle !== "") {
    let sortkey = detonePinyin(romTitle);
    sortTemplate = `{{sort|${sortkey}}}`;
  }

  cwTemplates = hasEpilepsyWarning ? "{{Epilepsy}}" : "";
  cwTemplates +=
    cwState === ENUM_CW_STATES.questionable
      ? `{{Questionable${cwText === "" ? "" : `|${cwText}`}}}`
      : cwState === ENUM_CW_STATES.explicit
        ? `{{Explicit${cwText === "" ? "" : `|${cwText}`}}}`
        : "";
  if (aiCwState !== ENUM_AI_WARNING_TYPE.none) {
    cwTemplates += `{{AIusage|${aiWarningText1}|${aiWarningText2}${aiCwState === ENUM_AI_WARNING_TYPE.suspected ? "|unverified=1" : ""}}}`;
  }

  // const hasOfficiallyAvailablePlayLinks = playLinks.some(link => link.isOfficiallyAvailable);
  if (isUnavailable) {
    unavailableTemplate = "{{Unavailable}}";
  }

  if (origTitle.match(/_/g)) {
    displayTitleTemplate = `{{DISPLAYTITLE:${origTitle}${
      romTitle === "" ? "" : ` (${romTitle})`
    }}}`;
  } else if (origTitle.match(/^[a-z]/)) {
    displayTitleTemplate = "{{Lowercase}}";
  }

  titlesSegment = `"'''${origTitle}'''"`;
  if (langMetadata.isChinese && altChTitle !== "") {
    titlesSegment += `<br />${altChIsTraditional ? "Traditional" : "Simplified"} Chinese: ${altChTitle}`;
  }
  if (langMetadata.needsRomanization && romTitle !== "") {
    titlesSegment += `<br />${langMetadata.headers[1]}: ${romTitle}`;
  }
  if (langMetadata.needsTranslation && engTitle !== "") {
    titlesSegment += `<br />${titleIsOfficiallyTranslated ? "Official " : ""}English: ${engTitle}`;
  }

  if (uploadDate !== null) {
    dateSegment = `{{Date|${uploadDate!.getUTCFullYear()}|${
      MONTHS[uploadDate!.getUTCMonth()]
    }|${uploadDate!.getUTCDate()}}}`;
  }

  if (playLinks.length === 0) {
    songLinksSegment = "N/A";
  } else {
    songLinksSegment = playLinks.map((playLink) => playLink.getPlayLinkWikitext()).join(" ");
  }
  const viewCounts = playLinks
    .filter((playLink) => !playLink.isReprint && PV_SERVICE_ABBREVIATIONS.has(playLink.site))
    .map((playLink) => ({
      vc: playLink.getFormattedViewCount(),
      abbr: PV_SERVICE_ABBREVIATIONS.get(playLink.site),
    }));
  if (viewCounts.length > 1) {
    viewCountsSegment = viewCounts.map((el) => `${el.vc} (${el.abbr})`).join(", ");
  } else {
    viewCountsSegment = viewCounts.map((el) => el.vc).join(", ");
  }
  if (viewCountsSegment === "") {
    viewCountsSegment = "N/A";
  }

  lyricsSegment = generateLyricsSegment(lyrics, {
    headers: langMetadata.headers,
    needsRomanization: langMetadata.needsRomanization,
    needsTranslation: langMetadata.needsTranslation,
    isoLangCode,
    translator,
    isOfficialTranslation,
    bgColour,
    fgColour,
    createToggleElement: true,
  });

  unofficialLinksWikitext = extLinks
    .filter((link) => !link.isOfficial)
    .map((el) => "* " + el.getWikitext())
    .join("\n");
  officialLinksWikitext = extLinks
    .filter((link) => link.isOfficial)
    .map((el) => "* " + el.getWikitext())
    .join("\n");
  if (unofficialLinksWikitext !== "" || officialLinksWikitext !== "") {
    extLinksSegment = "==External Links==\n";
    extLinksSegment += officialLinksWikitext;
    extLinksSegment += officialLinksWikitext === "" ? "" : "\n";
    extLinksSegment +=
      unofficialLinksWikitext === "" ? "" : `===Unofficial===\n${unofficialLinksWikitext}\n\n`;
  }

  return `${displayTitleTemplate}${sortTemplate}${unavailableTemplate}${cwTemplates}
{{Infobox Song
|songtitle = ${titlesSegment}
|color = ${bgColour}; color:${fgColour}
|original upload date = ${dateSegment}
|singer = ${singers}
|producer = ${producers}
|#views = ${viewCountsSegment}
|link = ${songLinksSegment}${isAlbumOnly ? "\n|album-only = 1" : ""}${description ? `\n|description = ${description}` : ""}
|language = ${languageSegment}
}}

==Lyrics==
${lyricsSegment}

${extLinksSegment}${categories!.map((cat) => `[[Category:${cat}]]`).join("\n")}`.trim();
}

/**
 *
 * @param param0
 * @returns
 */
export function autoloadCategories({ producers = "" }: Song): string[] {
  const res: string[] = [];

  const standardizeCategory = (base: string): string | null => {
    base = base.trim();
    if (base === "") {
      return null;
    }
    if (base.match(/^:[Cc]ategory:(?:.*) songs list/)) {
      base = base.replace(/^:[Cc]ategory:\s*/, "");
    } else {
      base = `${base} songs list`;
    }
    return base;
  };

  /**
   * Match for the following:
   *   - [[wowaka]] (music, lyrics)
   *   - [[Hachi|Kenshi Yonezu]] (music, lyrics)
   */
  const producersInMarkup = producers.matchAll(
    /\[\[(?<base>[^|\n\]]*)\|?(?<cap>(?<=\|)[^|\n\]]*)?\]\]\s*(?:\((?<role>.*)\)|)/g,
  );
  for (let producer of producersInMarkup) {
    let { base = "", role = "" } = producer.groups || {};

    // Infer base producer category
    const prodCategoryTag = standardizeCategory(base);
    if (!prodCategoryTag) {
      continue;
    }

    // Infer subcategories if any
    const splitRoles = role.toLowerCase().split(/\s*,\s*/g);
    let matchedSubtags: Set<string> = new Set();
    for (let role of splitRoles) {
      if (role === "" || role === "music" || role === "compose" || role === "composition") {
        matchedSubtags = new Set();
        matchedSubtags.add("");
        break;
      }
      switch (role) {
        case "lyrics":
          matchedSubtags.add("/Lyrics");
          break;
        case "tuning":
          matchedSubtags.add("/Tuning");
          break;
        case "arrange":
        case "arrangement":
          matchedSubtags.add("/Arrangement");
          break;
        case "illust":
        case "illustration":
        case "pv":
        case "movie":
        case "video":
        case "animation":
          matchedSubtags.add("/Visuals");
          break;
        case "mix":
        case "master":
        case "mastering":
        case "instruments":
        case "other":
          matchedSubtags.add("/Other");
          break;
        default:
          matchedSubtags.add("");
          break;
      }
    }
    if (matchedSubtags.has("")) {
      res.push(`${prodCategoryTag}`);
      matchedSubtags.delete("");
    }
    for (let subtag of matchedSubtags) {
      res.push(`${prodCategoryTag}${subtag}`);
    }
  }

  return res;
}

/**
 *
 * @param url
 * @returns
 */
export async function fetchDataFromVocaDb(
  url: string,
): Promise<
  Pick<
    Song,
    | "origTitle"
    | "romTitle"
    | "engTitle"
    | "playLinks"
    | "extLinks"
    | "singers"
    | "producers"
    | "uploadDateRaw"
    | "images"
  >
> {
  const vdbPageId = getVdbPageId(url, "S");
  if (!vdbPageId) {
    throw new VocaDBInvalidUrlError();
  }

  let vdbUrl = `${VOCADB_ENTRYPOINT}api/songs/${vdbPageId}`;
  let params = new URLSearchParams({
    fields: "Artists,Names,PVs,WebLinks,CultureCodes",
    lang: "English",
    origin: import.meta.env.VITE_REFER_FROM_ORIGIN,
  });
  let res = await fetch(`${vdbUrl}?${params.toString()}`);
  if (!res.ok) {
    throw new ExternalWebServiceError();
  }
  const json: FetchedVdbSongEntity = await res.json();

  const origTitle = json.defaultName || "";
  const romTitle =
    (json.names || []).find(({ language }) => {
      return language === VdbSystemLanguage.rom;
    })?.value || "";
  const engTitle =
    (json.names || []).find(({ language }) => {
      return language === VdbSystemLanguage.eng;
    })?.value || "";

  const uploadDateRaw = json.publishDate ? parseDateAsUtc(json.publishDate) : "";

  const languages: MultiSelectItem[] = [];
  for (const code of json.cultureCodes || []) {
    const f = LANGUAGES.findIndex((el) => el.code === code);
    if (f > -1) {
      languages.push({ label: LANGUAGES[f].name, value: f });
    }
  }

  const images: IImageEmbed[] = [];
  const mainSingers: string[] = [];
  const minorSingers: string[] = [];
  const circles: string[] = [];
  const producers: { name: string; role: string }[] = [];
  const playLinks: PlayLink[] = [];
  const extLinks: ExternalLink[] = [
    new ExternalLink({
      url: `${VOCADB_ENTRYPOINT}S/${vdbPageId}`,
      description: "VocaDB",
      isOfficial: false,
      isInactive: false,
    }),
  ];

  const orderRolePriority = [
    "music",
    "lyrics",
    "arrangement",
    "mix",
    "mastering",
    "tuning",
    "instruments",
    "illustration",
    "PV",
    "encoding",
    "vocalist",
    "chorus",
    "publisher",
    "other",
  ];

  for (let artist of json.artists || []) {
    let addName: string = artist.name || "";
    if (
      // Is singer
      artist.categories === VdbArtistCategory.vocalist
    ) {
      if (
        artist.artist &&
        (Object.values(VdbVocalSynthEngine) as string[]).includes(
          artist.artist?.artistType as string,
        )
      ) {
        // Try searching for the vocalist in the cache/SQLite db
        const r = await getVocalistBasedOnVdbId(artist.artist.id);
        if (r) {
          addName = `[[${r.category}]]`;
        }
      }
      if (artist.isSupport) {
        minorSingers.push(addName);
      } else {
        mainSingers.push(addName);
      }
    } else if (
      // Is circle
      artist.categories === VdbArtistCategory.circle ||
      artist.categories === VdbArtistCategory.label
    ) {
      circles.push(addName);
    } else {
      // Is producer
      let roles = artist.roles.split(", ");
      roles = roles.map((el) => convertArtistRole(el as VdbArtistRole) || "other");
      roles = [...new Set<string>(roles)];
      roles.sort((a, b) => {
        let aIdx = orderRolePriority.findIndex((val) => val === a);
        let bIdx = orderRolePriority.findIndex((val) => val === b);
        return aIdx - bIdx;
      });
      producers.push({ name: addName, role: roles.join(", ") });
    }
  }

  let producersString: string = "";
  if (circles.length > 0) {
    producersString += `'''${circles.join(", ")}''':\n`;
  }
  producersString += producers.map((el) => `${el.name} (${el.role})`).join("\n");

  let singersString: string = "";
  singersString += renderAsCommaSeparatedList(mainSingers);
  if (minorSingers.length > 0) {
    singersString += `\n<small>${renderAsCommaSeparatedList(minorSingers)}</small>`;
  }

  for (let pv of json.pvs || []) {
    const pvService = convertPvService(pv.service);
    const pvUrl = processExternalLinkFromVocaDb(pv.url || "");
    const isDeleted = pv.disabled;
    const isReprint = pv.pvType !== VdbPvType.original;
    if (pvService === null) {
      extLinks.push(
        new ExternalLink({
          url: pvUrl,
          description: pv.service,
          isOfficial: !isReprint,
          isInactive: pv.disabled,
        }),
      );
    } else {
      playLinks.push(
        new PlayLink({
          site: pvService,
          url: pvUrl,
          isReprint,
          isAutogen: false,
          isDeleted,
          viewCount: "",
        }),
      );
    }
    if (!isReprint) {
      switch (pv.service) {
        case VdbPvService.yt:
          images.push({
            type: ENUM_IMAGE_EMBED_SOURCE_TYPE.yt,
            src: `https://i.ytimg.com/vi/${pv.pvId}/maxresdefault.jpg`,
            alt: "YouTube thumbnail",
          });
          break;
        case VdbPvService.bb:
          // skip fetching thumbnail images for bilibili
          break;
        case VdbPvService.nnd:
          if (pv.thumbUrl && pv.thumbUrl !== "")
            images.push({
              type: ENUM_IMAGE_EMBED_SOURCE_TYPE.nn,
              src: pv.thumbUrl + ".L",
              alt: "Niconico thumbnail",
            });
          break;
        default:
          if (pv.thumbUrl && pv.thumbUrl !== "")
            images.push({
              type: null,
              src: pv.thumbUrl,
              alt: `${pv.service} thumbnail`,
            });
          break;
      }
    }
  }

  for (let link of json.webLinks || []) {
    const url = processExternalLinkFromVocaDb(link.url || "");
    let description = link.description || "";
    if (description === "MikuWiki") {
      description = "Hatsune Miku Wiki";
    }
    const isOfficial =
      link.category === VdbWebLinkCategory.official ||
      link.category === VdbWebLinkCategory.commercial;
    extLinks.push(new ExternalLink({ url, description, isOfficial, isInactive: link.disabled }));
  }

  const formData = {
    aiCwState: ENUM_AI_WARNING_TYPE.none,
    aiWarningText1: "",
    aiWarningText2: "",
    cwState: ENUM_CW_STATES.noWarnings,
    cwText: "",
    hasEpilepsyWarning: false,
    languages,
    isoLangCode: "",
    origTitle,
    altChTitle: "",
    altChIsTraditional: false,
    romTitle,
    engTitle,
    titleIsOfficiallyTranslated: false,
    uploadDateRaw: uploadDateRaw,
    isAlbumOnly: false,
    isUnavailable: false,
    singers: singersString,
    producers: producersString,
    description: "",
    translator: "",
    isOfficialTranslation: false,
    categoriesRaw: "",
    lyrics: [],
    playLinks,
    extLinks,
    images,
  };
  return formData;
}
