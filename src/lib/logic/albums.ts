import type { AlbumPageFormData, MultiSelectItem } from "../../schemas/form";

import { AlbumPageValidationErrorType } from "./enums";
import { getErrorForAlbumValidation } from ".";
import type { ValidationError, ValidationBundledErrors } from ".";

import {
  VdbAlbumType,
  VdbArtistCategory,
  VdbArtistRole,
  VdbPvService,
  VdbSongType,
  VdbWebLinkCategory,
  type FetchedVdbAlbumEntity,
} from "../../schemas/vocadb.d";

import {
  detonePinyin,
  preprocessStringParams,
  renderAsCommaSeparatedList,
  validateColour,
} from "../utils/utils";
import { getOtherMediaWikiPageName, processExternalLinkFromVocaDb } from "../utils/urlUtils";
import { convertPvService, getVdbPageId, getVocalistBasedOnVdbId } from "../utils/vdbUtils";

import { MONTHS, RECOGNIZED_LINKS, ALBUM_STREAMING_LINKS, SYNTH_ENGINES } from "../../constants";
import { VOCADB_ENTRYPOINT, VOCALOID_WIKI_ARTICLE_ENTRYPOINT } from "../../config";
import { ExternalWebServiceError } from "./exceptions";
import type { Synth } from "../../constants/types";

export function validate(
  formData: AlbumPageFormData,
): ValidationBundledErrors<AlbumPageValidationErrorType> {
  preprocessStringParams(formData, [
    "origTitle",
    "romTitle",
    "engTitle",
    "bgColour",
    "fgColour",
    "label",
    "description",
    "publishedYear",
    "publishedMonth",
    "publishedDay",
    "vdbAlbumId",
    "vocaWikiPage",
    "categoriesRaw",
  ]);
  formData.categories = formData.categoriesRaw === "" ? [] : formData.categoriesRaw.split("\n");

  let {
    origTitle,
    bgColour,
    fgColour,
    description,
    publishedYear,
    publishedMonth,
    publishedDay,
    engines,
    vdbAlbumId,
    categories,
  } = formData;

  const errors: ValidationError<AlbumPageValidationErrorType>[] = [];

  if (origTitle === "") {
    errors.push(getErrorForAlbumValidation(AlbumPageValidationErrorType.ALBUM_TITLE_IS_NOT_SET));
  }

  if (bgColour === "") {
    errors.push(getErrorForAlbumValidation(AlbumPageValidationErrorType.BG_COLOR_IS_EMPTY));
  }
  if (fgColour === "") {
    errors.push(getErrorForAlbumValidation(AlbumPageValidationErrorType.FG_COLOR_IS_EMPTY));
  }
  if (!validateColour(bgColour)) {
    errors.push(getErrorForAlbumValidation(AlbumPageValidationErrorType.BG_COLOR_IS_INVALID));
  }
  if (!validateColour(fgColour)) {
    errors.push(getErrorForAlbumValidation(AlbumPageValidationErrorType.FG_COLOR_IS_INVALID));
  }

  if (description === "") {
    errors.push(getErrorForAlbumValidation(AlbumPageValidationErrorType.DESCRIPTION_IS_NOT_SET));
  }

  if (publishedYear === "" && publishedMonth === "" && publishedDay === "") {
    errors.push(getErrorForAlbumValidation(AlbumPageValidationErrorType.PUB_DATE_IS_NOT_SET));
  } else if (publishedYear === "") {
    errors.push(getErrorForAlbumValidation(AlbumPageValidationErrorType.PUB_YEAR_IS_NOT_SET));
  } else if (publishedMonth === "" && publishedDay !== "") {
    errors.push(getErrorForAlbumValidation(AlbumPageValidationErrorType.PUB_MONTH_IS_NOT_SET));
  }
  if (publishedYear !== "" && publishedYear.length !== 4) {
    errors.push(getErrorForAlbumValidation(AlbumPageValidationErrorType.PUB_YEAR_IS_INVALID));
  }

  if (vdbAlbumId === "") {
    errors.push(getErrorForAlbumValidation(AlbumPageValidationErrorType.NO_VOCADB_LINK));
  }

  /*
  if (tracklist.every(track => track.pageTitle === '')) {
    errors.push(getErrorForAlbumValidation(AlbumPageValidationErrorType.NO_TRACK_IS_LISTED));
  } else {
    if (tracklist.some(track => track.trackNo === '')) {
      errors.push(getErrorForAlbumValidation(AlbumPageValidationErrorType.NO_TRACK_LIST_NUMBERING));
    }
    if (tracklist.some(track => track.discNo !== '' && isNaN(+track.discNo))) {
      errors.push(getErrorForAlbumValidation(AlbumPageValidationErrorType.DISC_NUMBER_IS_NOT_NUMERIC));
    }
    if (tracklist.some(track => track.trackNo !== '' && isNaN(+track.trackNo))) {
      errors.push(getErrorForAlbumValidation(AlbumPageValidationErrorType.TRACK_NUMBER_IS_NOT_NUMERIC));
    }
    if (tracklist.some(track => track.pageTitle === '')) {
      errors.push(getErrorForAlbumValidation(AlbumPageValidationErrorType.EMPTY_TRACK_NAME));
    }
    if (tracklist.some(track => track.singerCredit === '' && track.producerCredit === '')) {
      errors.push(getErrorForAlbumValidation(AlbumPageValidationErrorType.EMPTY_TRACK_CREDITS));
    }
  }

  if (officialStreamingLinks.length === 0) {
    errors.push(getErrorForAlbumValidation(AlbumPageValidationErrorType.OFFICIAL_LINK_IS_NOT_LISTED));
  } else {
    const invalidIds = officialStreamingLinks.filter(({ paramValue }) => {
      return paramValue === '';
    });
    if (invalidIds.length > 0) {
      for (let invalidId of invalidIds) {
        errors.push({
          fatal: true,
          fields: ['official-streaming'],
          i18nKey: `validation.album.invalidEmbedCode.${invalidId.paramKey}`,
          type: AlbumPageValidationErrorType.INVALID_EMBED_CODE,
        });
      }
    }
  }
  
  */

  if (engines.length === 0) {
    errors.push(
      getErrorForAlbumValidation(AlbumPageValidationErrorType.SYNTH_ENGINE_IS_NOT_LISTED),
    );
  }

  if (categories.length === 0) {
    errors.push(getErrorForAlbumValidation(AlbumPageValidationErrorType.NO_CATEGORIES));
  }

  const autoloadCategories = errors.some(({ autoloadCategories }) => autoloadCategories);
  const fatal = errors.some(({ fatal }) => fatal);
  return { errors, autoloadCategories, fatal };
}

export function generatePage(formData: AlbumPageFormData): string {
  let {
    origTitle,
    romTitle,
    engTitle,
    bgColour,
    fgColour,
    label,
    description,
    isCompilationAlbum,
    publishedYear,
    publishedMonth,
    publishedDay,
    vdbAlbumId,
    vocaWikiPage,
    categories,
  } = formData;

  let displayTitleTemplate: string = "";
  let dateSegment: string = "";
  let moreInfoLinksSegment: string = "";
  let trackListSegment: string = "";
  let streamingSegment: string = "";
  let officialLinksWikitext: string = "";
  let unofficialLinksWikitext: string = "";
  let extLinksSegment: string = "";
  let sortTemplateSegment: string = "";

  if (origTitle.match(/^[a-z]/) !== null) {
    displayTitleTemplate = "{{Lowercase}}";
  }
  if (origTitle.match(/_/g) !== null) {
    displayTitleTemplate = `{{DISPLAYTITLE:${origTitle}}}`;
  }

  if (publishedYear !== "" || publishedMonth !== "" || publishedDay !== "") {
    dateSegment = `{{DateAlbum|${publishedYear}|${publishedMonth}|${publishedDay}}}`;
  }

  /*
  trackListSegment = tracklist.map(track => (
    `|${
      track.discNo == '1' ? '' : track.discNo
    }tr${track.trackNo} = ${track.pageTitle}\n|${
      track.discNo == '1' ? '' : track.discNo
    }tr${track.trackNo}s = ${track.credits}`
  )).join('\n');
  streamingSegment = officialStreamingLinks.map(({ paramKey, paramValue }) => {
    return `|${paramKey} = ${paramValue}`;
  }).join('\n');

  const officialLinks = [];
  const unofficialLinks = [];
  const moreInfoLinks: IDictionary<string> = {};
  for (let extLink of extLinks) {
    if (extLink.isOfficial) {
      officialLinks.push(extLink);
    } else {
      unofficialLinks.push(extLink);
    }
    if (extLink.mapToAlbumInfoboxReadMoreParam !== null) {
      moreInfoLinks[extLink.mapToAlbumInfoboxReadMoreParam] = extLink.url;
    }
  }
  unofficialLinksWikitext = unofficialLinks
    .map(el => '* ' + el.getWikitext())
    .join('\n');
  officialLinksWikitext = officialLinks
    .map(el => '* ' + el.getWikitext())
    .join('\n');
  moreInfoLinksSegment = Object.entries(moreInfoLinks).map(([k, v]) => {
    return `|${k} = ${v}`;
  }).join("\n");
  if (unofficialLinksWikitext !== '' || officialLinksWikitext !== '') {
    extLinksSegment = '==External Links==\n';
    extLinksSegment += officialLinksWikitext;
    extLinksSegment += officialLinksWikitext === '' ? '' : '\n';
    extLinksSegment += unofficialLinksWikitext === '' ? '' : `===Unofficial===\n${unofficialLinksWikitext}\n\n`;
  }
  */

  if (romTitle !== origTitle && romTitle !== "") {
    sortTemplateSegment = "{{sort-album";
    const plcRom = detonePinyin(romTitle, false);
    if (plcRom.replace(/[ -~]/g, "") !== "") {
      sortTemplateSegment += `|${plcRom}}}\n`;
    } else {
      sortTemplateSegment += "}}\n";
    }
  }

  return `
${displayTitleTemplate}{{Album Infobox
|title = ${romTitle === "" ? origTitle : romTitle}${romTitle === "" ? "" : `\n|orgtitle = ${origTitle}`}${engTitle === "" ? "" : `\n|english = ${engTitle}`}
|label = ${label}
|desc = ${description}
|date = ${dateSegment}
|vdb = ${vdbAlbumId}
|vw = ${vocaWikiPage}${isCompilationAlbum ? "\n|compilation = 1" : ""}${moreInfoLinksSegment === "" ? "" : "\n" + moreInfoLinksSegment}

${streamingSegment === "" ? "" : streamingSegment + "\n\n"}|color = ${bgColour}; color:${fgColour}
${trackListSegment}
}}

${extLinksSegment}${sortTemplateSegment}${categories!
    .map((cat) => `[[Category:${cat}]]`)
    .join("\n")}`.trim();
}

function detectProducerOrSingerInMarkup(wikitext: string): string[] {
  const res: string[] = [];
  const arrMarkup = wikitext.matchAll(/\[\[(?<base>[^|\n\]]*)\|?(?<cap>(?<=\|)[^\]]*)?\]\]/g);
  for (let markup of arrMarkup) {
    let { base = "" } = markup.groups || {};
    base = base.trim();
    if (base === "") {
      continue;
    }
    // Producer category tag
    base = base.replace(/^:[Cc]ategory:(.*) songs list$/, "$1");
    res.push(base);
  }
  return res;
}

export function autoloadCategories({ description, engines }: AlbumPageFormData): string[] {
  const res: string[] = [];

  const producers: string[] = [];
  const singers: string[] = [];

  let markedUpProducersInDesc: Set<string> = new Set(detectProducerOrSingerInMarkup(description));
  let markedUpProducersInTracklist: Set<string> = new Set();
  let markedUpSingersInTracklist: Set<string> = new Set();
  // for (let track of tracklistData) {
  //   const detectedProducers = detectProducerOrSingerInMarkup(track[3]?.trim() || '');
  //   const detectedSingers = detectProducerOrSingerInMarkup(track[4]?.trim() || '');
  //   for (let prod of detectedProducers) {
  //     markedUpProducersInTracklist.add(prod);
  //   }
  //   for (let singer of detectedSingers) {
  //     markedUpSingersInTracklist.add(singer);
  //   }
  // }
  for (let prod of markedUpProducersInDesc) {
    if (markedUpProducersInTracklist.has(prod)) {
      markedUpProducersInTracklist.delete(prod);
    }
  }
  producers.push(...markedUpProducersInDesc);
  producers.push(...markedUpProducersInTracklist);
  singers.push(...markedUpSingersInTracklist);

  res.push(...engines.map(({ label }) => `Albums featuring ${label}`));
  res.push(...singers.map((singer) => `Albums featuring ${singer}`));
  res.push(...producers.map((producer) => `${producer} songs list/Albums`));

  return res;
}

export async function fetchDataFromVocaDb(url: string): Promise<AlbumPageFormData> {
  const vdbPageId = getVdbPageId(url, "Al");
  if (vdbPageId === null) {
    throw new Error("VocaDB page ID is empty or invalid!");
  }

  let vdbUrl = `${VOCADB_ENTRYPOINT}api/albums/${vdbPageId}`;
  let params = new URLSearchParams({
    fields: "MainPicture,Names,PVs,Artists,Tracks,WebLinks",
    songFields: "Artists",
    lang: "English",
    origin: import.meta.env.VITE_REFER_FROM_ORIGIN,
  });
  let res = await fetch(`${vdbUrl}?${params.toString()}`);
  if (!res.ok) {
    throw new ExternalWebServiceError();
  }
  const json: FetchedVdbAlbumEntity = await res.json();

  const origTitle = json.defaultName || "";
  const romTitle =
    (json.names || []).find(({ language }) => {
      return language === "Romaji";
    })?.value || "";
  const engTitle =
    (json.names || []).find(({ language }) => {
      return language === "English";
    })?.value || "";

  let imageSrc: string | null = json.mainPicture?.urlOriginal || null;

  const circles: string[] = [];
  const mainProducers: string[] = [];
  const labels: string[] = [];
  const engineIds: Set<number> = new Set();
  let strLabel: string = "";
  let strDescription: string = "";
  let isCompilationAlbum: boolean = false;
  let publishedYear: string = "";
  let publishedMonth: string = "";
  let publishedDay: string = "";
  let vocaWikiPage: string = "";

  for (let artist of json.artists || []) {
    if (artist.categories === VdbArtistCategory.vocalist) {
      continue;
    }
    switch (artist.categories) {
      case VdbArtistCategory.label:
        labels.push(artist.name || "");
        break;
      case VdbArtistCategory.circle:
        circles.push(artist.name || "");
        break;
      case VdbArtistCategory.producer:
        if (!artist.isSupport) {
          mainProducers.push(artist.name || "");
        }
        break;
      default:
        break;
    }
  }
  strLabel = labels.length === 0 ? "" : renderAsCommaSeparatedList(labels);
  if (json.discType === VdbAlbumType.compilation) {
    strDescription = `a compilation album${
      circles.length === 0 ? "" : ", by the circle " + renderAsCommaSeparatedList(circles)
    }`;
    isCompilationAlbum = true;
  } else if (mainProducers.length > 3) {
    strDescription = `an album by ${
      circles.length === 0 ? "several producers" : renderAsCommaSeparatedList(circles)
    }`;
  } else {
    strDescription = `an album by ${renderAsCommaSeparatedList(mainProducers)}`;
    if (circles.length > 0) {
      strDescription += `, under the circle ${renderAsCommaSeparatedList(circles)}`;
    }
  }

  if (json.releaseDate.isEmpty === false) {
    const { year, month, day } = json.releaseDate;
    publishedYear = `${year || ""}`;
    publishedMonth = month === null ? "" : MONTHS[month - 1];
    publishedDay = `${day || ""}`;
  }

  const trackList: (string | number)[][] = [];
  const extLinks: (string | boolean)[][] = [];
  const officialStreaming: string[][] = [];
  const vdbSingerIdsCache: Map<number, string> = new Map();
  const addedSingers: Set<string> = new Set();

  for (let track of json.tracks || []) {
    const { discNumber, trackNumber, song: { artists, defaultName: songTitle } = {} } = track;
    const songProducers: string[] = [];
    const songSingers: Set<string> = new Set();
    for (let artist of artists || []) {
      if (artist.isSupport) {
        continue;
      }
      if (artist.categories === VdbArtistCategory.vocalist) {
        const id = artist.artist?.id || null;
        if (id === null) {
          songSingers.add(artist?.name || "");
        } else if (vdbSingerIdsCache.has(id)) {
          songSingers.add(vdbSingerIdsCache.get(id) || "");
        } else {
          // Try searching for the vocalist in the SQLite db
          const r = await getVocalistBasedOnVdbId(id);
          if (r) {
            const { category, baseName, engine } = r;
            engineIds.add(engine);
            vdbSingerIdsCache.set(id, baseName);
            if (addedSingers.has(baseName)) {
              songSingers.add(baseName);
            } else {
              songSingers.add(`[[${category}]]`);
              addedSingers.add(baseName);
            }
          } else {
            songSingers.add(artist.artist?.name || "");
          }
        }
      } else {
        const roles = artist.effectiveRoles.split(", ");
        const isMainProducer = roles.some((role) => {
          const isDerivative = new Set<string>([
            VdbSongType.cover,
            VdbSongType.remix,
            VdbSongType.arrangement,
            VdbSongType.live,
          ]).has(track.song.songType);
          return (
            role === VdbArtistRole.default ||
            role === VdbArtistRole.composer ||
            (isDerivative && role === VdbArtistRole.arranger)
          );
        });
        if (isMainProducer) songProducers.push(artist?.name || "");
      }
    }
    trackList.push([
      discNumber,
      trackNumber,
      songTitle || "",
      renderAsCommaSeparatedList(songProducers),
      renderAsCommaSeparatedList(Array.from(songSingers.values())),
    ]);
  }
  const engines: MultiSelectItem[] = Array.from(engineIds.keys()).map((id) => {
    let e: Synth = SYNTH_ENGINES[id];
    if (e.id !== id) {
      // Fallback if there is a "jump" between synth IDs, which might
      // be caused if a synth engine is deleted from synths.db
      e = SYNTH_ENGINES.find((c) => c.id === id)!;
    }
    return {
      label: e.name,
      value: e.id,
    };
  });

  for (let link of json.pvs || []) {
    const url = processExternalLinkFromVocaDb(link.url || "");
    let description = convertPvService(link.service);
    description = "Album crossfade" + (description === null ? "" : ` - ${description}`);
    extLinks.push([url, description, true]);

    switch (link.service) {
      case VdbPvService.yt:
        officialStreaming.push(["YouTube Crossfade", url]);
        break;
      case VdbPvService.nnd:
        officialStreaming.push(["Niconico Crossfade", url]);
        break;
      case VdbPvService.sc:
        officialStreaming.push(["SoundCloud Crossfade", url]);
        break;
    }
  }
  for (let link of json.webLinks || []) {
    const url = processExternalLinkFromVocaDb(link.url || "");
    let description;
    const isOfficial =
      link.category === VdbWebLinkCategory.official ||
      link.category === VdbWebLinkCategory.commercial;
    const am =
      ALBUM_STREAMING_LINKS.find(({ regex }) => {
        return regex.exec(url) !== null;
      }) || null;
    const m =
      RECOGNIZED_LINKS.find(({ re }) => {
        return re.exec(url) !== null;
      }) || null;
    if (m === null) {
      description = description = link.description || "";
    } else {
      description = m?.site || "";
      if (m.site === "VOCALOID Wiki") {
        vocaWikiPage = getOtherMediaWikiPageName(url, VOCALOID_WIKI_ARTICLE_ENTRYPOINT) || "";
      }
      if (am !== null) {
        officialStreaming.push([am.name || "", url]);
      }
    }

    extLinks.push([url, description, isOfficial]);
  }

  const formData: AlbumPageFormData = {
    origTitle,
    romTitle,
    engTitle,
    bgColour: "",
    fgColour: "",
    label: strLabel,
    description: strDescription,
    isCompilationAlbum,
    publishedYear,
    publishedMonth,
    publishedDay,
    engines,
    vdbAlbumId: vdbPageId,
    vocaWikiPage,
    categoriesRaw: "",
    // imageSrc,
  };
  return formData;
}