import Album from "../models/Album.svelte";
import AlbumTrackData from "../models/children/AlbumTrackData.svelte";
import AlbumBroadcastLink from "../models/children/AlbumBroadcastLink.svelte";
import ExternalLink from "../models/children/ExternalLink.svelte";

import {
  VdbAlbumType,
  VdbArtistCategory,
  VdbArtistRole,
  VdbPvService,
  VdbSongType,
  VdbWebLinkCategory,
  type FetchedVdbAlbumEntity,
} from "../../schemas/vocadb.d";

import { detonePinyin, renderAsCommaSeparatedList } from "../utils/utils";
import { getOtherMediaWikiPageName, processExternalLinkFromVocaDb } from "../utils/urlUtils";
import { convertPvService, getVdbPageId, getVocalistBasedOnVdbId } from "../utils/vdbUtils";

import { VOCADB_ENTRYPOINT, VOCALOID_WIKI_ARTICLE_ENTRYPOINT } from "../../config";
import { MONTHS, RECOGNIZED_LINKS, ALBUM_STREAMING_LINKS, SYNTH_ENGINES } from "../../constants";
import { ExternalWebServiceError } from "./exceptions";

import type { Synth } from "../../constants/types";
import type { MultiSelectItem } from "../../schemas/form";
import type { IImageEmbed } from "../models/schema";
import { ENUM_IMAGE_EMBED_SOURCE_TYPE } from "../models/enums";

/**
 *
 * @param formData
 * @returns
 */
export function generatePage(formData: Album): string {
  const {
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

  const tracklist = formData.tracklist.filter(({ pageTitle }) => pageTitle);
  const broadcastLinks = formData.broadcastLinks.filter(({ url }) => url);
  const extLinks = formData.extLinks.filter(({ url }) => url);

  let displayTitleTemplate: string = "";
  let dateSegment: string = "";
  let moreInfoLinksSegment: string = "";
  let trackListSegment: string = "";
  let streamingSegment: string = "";
  let officialLinksWikitext: string = "";
  let unofficialLinksWikitext: string = "";
  let extLinksSegment: string = "";
  let sortTemplateSegment: string = "";

  if (origTitle.match(/_/g)) {
    displayTitleTemplate = `{{DISPLAYTITLE:${origTitle}}}`;
  } else if (origTitle.match(/^[a-z]/)) {
    displayTitleTemplate = "{{Lowercase}}";
  }

  if (publishedYear !== "" || publishedMonth !== "" || publishedDay !== "") {
    dateSegment = `{{DateAlbum|${publishedYear}|${publishedMonth}|${publishedDay}}}`;
  }

  trackListSegment = tracklist.map((track) => track.getWikitext()).join("\n");
  streamingSegment = broadcastLinks
    .filter(({ url, __computed: { isValid } }) => url && isValid)
    .map(({ __computed: { paramKey, embedid } }) => {
      return `|${paramKey} = ${embedid}`;
    })
    .join("\n");

  const officialLinks = [];
  const unofficialLinks = [];
  const moreInfoLinks: Record<string, string> = {};
  const mapToAlbumInfoboxReadMoreParams = RECOGNIZED_LINKS.filter(
    ({ mapToAlbumInfoboxReadMoreParam }) => mapToAlbumInfoboxReadMoreParam,
  );
  for (const extLink of extLinks) {
    if (extLink.isOfficial) {
      officialLinks.push(extLink);
    } else {
      unofficialLinks.push(extLink);
    }
    const mo = mapToAlbumInfoboxReadMoreParams.find(({ re }) => re.test(extLink.url));
    if (mo) {
      moreInfoLinks[mo.mapToAlbumInfoboxReadMoreParam!] = extLink.url;
    }
  }
  unofficialLinksWikitext = unofficialLinks.map((el) => "* " + el.getWikitext()).join("\n");
  officialLinksWikitext = officialLinks.map((el) => "* " + el.getWikitext()).join("\n");
  moreInfoLinksSegment = Object.entries(moreInfoLinks)
    .map(([k, v]) => {
      return `|${k} = ${v}`;
    })
    .join("\n");
  if (unofficialLinksWikitext !== "" || officialLinksWikitext !== "") {
    extLinksSegment = "==External Links==\n";
    extLinksSegment += officialLinksWikitext;
    extLinksSegment += officialLinksWikitext === "" ? "" : "\n";
    extLinksSegment +=
      unofficialLinksWikitext === "" ? "" : `===Unofficial===\n${unofficialLinksWikitext}\n\n`;
  }

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

/**
 *
 * @param wikitext
 * @returns
 */
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

/**
 *
 * @param album
 * @returns
 */
export function autoloadCategories({ tracklist, description, engines }: Album): string[] {
  const res: string[] = [];

  const producers: string[] = [];
  const singers: string[] = [];

  let markedUpProducersInDesc: Set<string> = new Set(detectProducerOrSingerInMarkup(description));
  let markedUpProducersInTracklist: Set<string> = new Set();
  let markedUpSingersInTracklist: Set<string> = new Set();
  for (const { producerCredit, singerCredit } of tracklist) {
    const detectedProducers = detectProducerOrSingerInMarkup(producerCredit?.trim() || "");
    const detectedSingers = detectProducerOrSingerInMarkup(singerCredit?.trim() || "");
    for (let prod of detectedProducers) {
      markedUpProducersInTracklist.add(prod);
    }
    for (let singer of detectedSingers) {
      markedUpSingersInTracklist.add(singer);
    }
  }
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

/**
 *
 * @param url
 * @returns
 */
export async function fetchDataFromVocaDb(
  url: string,
): Promise<
  Pick<
    Album,
    | "origTitle"
    | "romTitle"
    | "engTitle"
    | "description"
    | "label"
    | "engines"
    | "isCompilationAlbum"
    | "publishedYear"
    | "publishedMonth"
    | "publishedDay"
    | "categoriesRaw"
    | "tracklist"
    | "broadcastLinks"
    | "extLinks"
    | "vocaWikiPage"
    | "vdbAlbumId"
    | "image"
  >
> {
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

  let image: IImageEmbed | null = null;
  if (json.mainPicture?.urlOriginal) {
    image = {
      type: ENUM_IMAGE_EMBED_SOURCE_TYPE.vdb,
      src: json.mainPicture?.urlOriginal,
      alt: "Album cover image on VocaDB",
    };
  }

  const circles: string[] = [];
  const mainProducers: string[] = [];
  const labels: string[] = [];
  const engineIds: Set<number> = new Set();
  let strDescription: string = "";
  let isCompilationAlbum: boolean = false;
  let publishedYear: string = "";
  let publishedMonth: string = "";
  let publishedDay: string = "";
  let vocaWikiPage: string = "";

  /**
   * General description
   */
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

  /**
   * Publication date
   */
  if (json.releaseDate.isEmpty === false) {
    const { year, month, day } = json.releaseDate;
    publishedYear = `${year || ""}`;
    publishedMonth = month === null ? "" : MONTHS[month - 1];
    publishedDay = `${day || ""}`;
  }

  const tracklist: AlbumTrackData[] = [];
  const extLinks: ExternalLink[] = [];
  const officialStreaming: AlbumBroadcastLink[] = ALBUM_STREAMING_LINKS.map(
    ({ name: site }, idx) => new AlbumBroadcastLink({ idx, site, url: "" }),
  );
  const vdbSingerIdsCache: Map<number, string> = new Map();
  const addedSingers: Set<string> = new Set();

  /**
   * Add track data
   */
  for (let track of json.tracks || []) {
    const {
      discNumber: discNo,
      trackNumber: trackNo,
      song: { artists, defaultName: songTitle } = {},
    } = track;
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
        if (isMainProducer) {
          songProducers.push(artist?.name || "");
        }
      }
    }
    tracklist.push(
      new AlbumTrackData({
        discNo,
        trackNo,
        pageTitle: songTitle || "",
        producerCredit: renderAsCommaSeparatedList(songProducers),
        singerCredit: renderAsCommaSeparatedList(Array.from(songSingers.values())),
      }),
    );
  }

  /**
   * Specify engines
   */
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

  /**
   * Helper
   */
  const addVdbPvToStreaming = (service: string, url: string) => {
    let vSite: string | undefined = undefined;
    switch (service) {
      case VdbPvService.yt:
        vSite = "YouTube Crossfade";
        break;
      case VdbPvService.nnd:
        vSite = "Niconico Crossfade";
        break;
      case VdbPvService.sc:
        vSite = "SoundCloud Crossfade";
        break;
    }
    if (vSite) {
      let o = officialStreaming.find(({ site }) => site === vSite)!;
      if (!o.url) {
        o.url = url;
      }
    }
  };

  /**
   * Helper
   */
  const addVdbExtLinkToStreaming = (url: string) => {
    let idx = ALBUM_STREAMING_LINKS.findIndex(({ regex }) => {
      return regex.exec(url) !== null;
    });
    if (idx < 0) {
      return;
    }
    const o = officialStreaming[idx];
    if (!o.url) {
      o.url = url;
    }
    return;
  };

  for (let link of json.pvs || []) {
    /**
     * Always add all crossfades listed on VocaDB as an external link
     */
    const url = processExternalLinkFromVocaDb(link.url || "");
    let description = convertPvService(link.service);
    description = "Album crossfade" + (description === null ? "" : ` - ${description}`);
    extLinks.push(new ExternalLink({ url, description, isOfficial: true, isInactive: false }));

    /**
     * In contrast only add the crossfade as an official streaming link if not already
     * listed in the form
     */
    addVdbPvToStreaming(link.service, url);
  }

  for (let link of json.webLinks || []) {
    const url = processExternalLinkFromVocaDb(link.url || "");
    let description;

    const isOfficial =
      link.category === VdbWebLinkCategory.official ||
      link.category === VdbWebLinkCategory.commercial;

    /**
     * Add external link
     */
    const m =
      RECOGNIZED_LINKS.find(({ re }) => {
        return re.exec(url) !== null;
      }) || null;
    if (!m) {
      description = link.description || "";
    } else {
      description = m?.site || "";
      if (m.site === "VOCALOID Wiki") {
        vocaWikiPage = getOtherMediaWikiPageName(url, VOCALOID_WIKI_ARTICLE_ENTRYPOINT) || "";
      }
    }
    extLinks.push(new ExternalLink({ url, description, isOfficial, isInactive: false }));

    /**
     * Add as an official streaming link if a match is found
     */
    addVdbExtLinkToStreaming(url);
  }

  const formData = {
    origTitle,
    romTitle,
    engTitle,
    label: labels.length === 0 ? "" : renderAsCommaSeparatedList(labels),
    description: strDescription,
    isCompilationAlbum,
    publishedYear,
    publishedMonth,
    publishedDay,
    engines,
    vdbAlbumId: vdbPageId,
    vocaWikiPage,
    categoriesRaw: "",
    tracklist,
    broadcastLinks: officialStreaming,
    extLinks,
    image,
  };
  return formData;
}
