import Producer from "../models/Producer.svelte";
import ExternalLinkForProducerPage from "../models/children/ExternalLinkForProducerPage.svelte";
import ProducerDiscographySongItem from "../models/children/ProducerDiscographySongItem.svelte";
import ProducerDiscographyAlbumItem from "../models/children/ProducerDiscographyAlbumItem.svelte";

import {
  VdbArtistType,
  VdbWebLinkCategory,
  type FetchedVdbArtistEntity,
} from "../../schemas/vocadb.d";
import type { FetchedMwDiscography, FetchedMwDiscographyAlbum } from "../../schemas/vlw-mw.d";

import { processExternalLinkFromVocaDb } from "../utils/urlUtils";
import { getVdbPageId } from "../utils/vdbUtils";
import RegexUtils from "../utils/regexUtils";

import { VOCADB_ENTRYPOINT, VOCALOID_LYRICS_WIKI_API_ENTRYPOINT } from "../../config";
import { LANGUAGES, RECOGNIZED_LINKS } from "../../constants";
import {
  ExternalWebServiceError,
  GotZeroPagesInResponseError,
  VLWInvalidUrlError,
  VocaDBInvalidUrlError,
} from "./exceptions";

/**
 * Generate {{links}} template.
 *
 * @param links
 * @returns
 */
export function getUnofficialProdLinks(links: ExternalLinkForProducerPage[]): string {
  const detectedDomains: Record<string, string> = {};
  const _getId =
    (rx: RegExp) =>
    (key: string, link: ExternalLinkForProducerPage): boolean => {
      const m = rx.exec(link.url);
      if (m === null) {
        return false;
      }
      detectedDomains[key] = m[1];
      return true;
    };
  const rxCommonLinks: Record<string, (key: string, link: ExternalLinkForProducerPage) => boolean> =
    {
      MIKUWIKI: _getId(RegexUtils.rxHmWiki),
      UTAUDB: _getId(RegexUtils.rxUtau),
      NICOPEDIA: _getId(RegexUtils.rxNicopedia),
      NICOTAG: _getId(RegexUtils.rxNicotag),
      MGP: _getId(RegexUtils.rxMgp),
      VOCADB: (key: string, link: ExternalLinkForProducerPage) => {
        const v = getVdbPageId(link.url, "Ar");
        if (v) {
          detectedDomains[key] = v;
          return true;
        }
        return false;
      },
    };

  let wikitextForUndetectedDomains: string = "";
  for (let link of links) {
    let domainIsDetected = false;
    for (let [key, fn] of Object.entries(rxCommonLinks)) {
      domainIsDetected = fn(key, link);
      break;
    }
    if (!domainIsDetected) {
      wikitextForUndetectedDomains += `* ${link.getWikitext()}\n`;
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

/**
 *
 * @param formData
 * @returns
 */
export function generatePage(formData: Producer): string {
  const {
    prodCategory,
    splitAlbum,
    prodAliases,
    roles,
    affiliations,
    labels,
    languages,
    engines,
    description,
  } = formData;

  const songs = formData.songs.filter(({ page }) => page);
  const albums = formData.albums.filter(({ page }) => page);
  const extLinks = formData.extLinks.filter(({ url }) => url);

  let extLinksSegment: string = "";
  let categories: string[] = ["Producers"];

  let officialLinks: string = extLinks
    .filter((link) => link.isOfficial && !link.isMedia)
    .map((link) => `* ${link.description}: [${link.url} ]\n`)
    .join("");
  let mediaLinks: string = extLinks
    .filter((link) => link.isOfficial && link.isMedia)
    .map((link) => `* ${link.getWikitext()}\n`)
    .join("");
  let unofficialLinks: string = getUnofficialProdLinks(extLinks.filter((link) => !link.isOfficial));

  extLinksSegment += `==External links==\n`;
  extLinksSegment += officialLinks === "" ? "" : officialLinks + "\n";
  extLinksSegment += mediaLinks === "" ? "" : `===Media===\n${mediaLinks}\n`;
  extLinksSegment += unofficialLinks === "" ? "" : `===Unofficial===\n${unofficialLinks}`;

  for (const [role, isChecked] of Object.entries(roles)) {
    if (isChecked) {
      categories.push(`${role.replace(/^\w/, (firstLetter) => firstLetter.toUpperCase())}s`);
    }
  }
  for (let { value } of languages) {
    let lang: string = LANGUAGES[value]?.name || "";
    categories.push(`${lang} original producers`);
  }
  for (let engine of engines) {
    categories.push(`Producers using ${engine}`);
  }

  let albumListSegment = "";
  if (albums.length > 0) {
    if (splitAlbum) {
      const originalAlbums = [];
      const compilationAlbums = [];
      for (const album of albums) {
        if (album.isCompilation) {
          compilationAlbums.push(album);
        } else {
          originalAlbums.push(album);
        }
      }
      albumListSegment = "==Discography==\n";
      if (originalAlbums.length > 0) {
        albumListSegment +=
          `{| class="sortable producer-table"\n${""}|- class="vcolor-default"\n${""}! {{awt head}}\n` +
          originalAlbums.map((album) => `|-\n| ${album.getWikitext()}\n`).join("") +
          "|}\n";
      }
      if (originalAlbums.length > 0 && compilationAlbums.length > 0) {
        albumListSegment += "\n";
      }
      if (compilationAlbums.length > 0) {
        albumListSegment +=
          `===Compilations===\n{| class="sortable producer-table"\n${""}|- class="vcolor-default"\n${""}! {{awt head}}\n` +
          compilationAlbums.map((album) => `|-\n| ${album.getWikitext()}\n`).join("") +
          "|}\n";
      }
    } else {
      albumListSegment =
        `==Discography==\n${""}{| class="sortable producer-table"\n${""}|- class="vcolor-default"\n${""}! {{awt head}}\n` +
        albums.map((album) => `|-\n| ${album.getWikitext()}\n`).join("") +
        "|}\n";
    }
  }

  return `
<div class="producer-links">
[[File:<PRODUCER PROFILE PICTURE IMAGE FILE>|250px|center]]
==Producer categories==
{{ProdLinks|${prodCategory}}}
${labels === "" ? "" : `==Labels==\n${labels}\n`}${
    affiliations === "" ? "" : `==Affiliations==\n${affiliations}\n`
  }
${extLinksSegment}</div>

${description}

==Works==${prodAliases === "" ? "" : `\n{{pwt alias|${prodAliases}}}`}
{| class="sortable producer-table"
|- class="vcolor-default"
! {{pwt head}}
${songs.map((song) => `|-\n| ${song.getWikitext()}\n`).join("")}|}

${albumListSegment}
${categories.map((cat) => `[[Category:${cat}]]`).join("\n")}`.trim();
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
    Producer,
    | "prodCategory"
    | "prodAliases"
    | "labels"
    | "affiliations"
    | "description"
    | "languages"
    | "engines"
    | "roles"
    | "splitAlbum"
    | "extLinks"
  >
> {
  const vdbPageId = getVdbPageId(url, "Ar");
  if (!vdbPageId) {
    throw new VocaDBInvalidUrlError();
  }

  let vdbUrl = `${VOCADB_ENTRYPOINT}api/artists/${vdbPageId}`;
  let params = new URLSearchParams({
    fields: "AdditionalNames,MainPicture,Description,ArtistLinks,WebLinks",
    lang: "English",
    origin: import.meta.env.VITE_REFER_FROM_ORIGIN,
  });
  let res = await fetch(`${vdbUrl}?${params.toString()}`);
  if (!res.ok) {
    throw new ExternalWebServiceError();
  }
  const json: FetchedVdbArtistEntity = await res.json();

  const prodCategory = json.name || "";
  const description = `'''${prodCategory}''' is a vocal synth producer.`;
  const labels: string[] = [];
  const affiliations: string[] = [];

  let imageSrc: string | null = json.mainPicture?.urlOriginal || null;

  const extLinks: ExternalLinkForProducerPage[] = [];

  for (let artistLink of json.artistLinks || []) {
    if (artistLink.artist.artistType === VdbArtistType.label) {
      labels.push(artistLink.artist.name || "");
    } else {
      affiliations.push(artistLink.artist.name || "");
    }
  }

  extLinks.push(
    new ExternalLinkForProducerPage({
      url: `${VOCADB_ENTRYPOINT}Ar/${vdbPageId}`,
      description: "VocaDB",
      isOfficial: false,
      isInactive: false,
      isMedia: false,
    }),
  );
  for (let link of json.webLinks || []) {
    const url = processExternalLinkFromVocaDb(link.url || "");
    let description = link.description || "";
    if (description === "MikuWiki") {
      description = "Hatsune Miku Wiki";
    }
    const isOfficial =
      link.category === VdbWebLinkCategory.official ||
      link.category === VdbWebLinkCategory.commercial;
    const isMedia =
      isOfficial && !!RECOGNIZED_LINKS.filter((el) => el.isMedia).find((el) => el.re.exec(url));
    const isInactive = link.disabled;
    extLinks.push(
      new ExternalLinkForProducerPage({ url, description, isOfficial, isMedia, isInactive }),
    );
  }

  const formData = {
    prodCategory,
    splitAlbum: false,
    prodAliases: "",
    affiliations: affiliations.join("\n"),
    labels: labels.join("\n"),
    languages: [],
    engines: [],
    description,
    roles: {
      composer: false,
      lyricist: false,
      tuner: false,
      illustrator: false,
      animator: false,
      arranger: false,
      instrumentalist: false,
      mixer: false,
      masterer: false,
    },
    extLinks,
    // imageSrc,
  };
  return formData;
}

/**
 *
 * @param prodcat
 * @returns
 */
export async function fetchDiscographyFromVlw(prodcat: string): Promise<{
  songs: ProducerDiscographySongItem[];
  albums: ProducerDiscographyAlbumItem[];
  recommendToSplitAlbum: boolean;
}> {
  if (prodcat.trim() === "") {
    throw new VLWInvalidUrlError();
  }
  let subcats: Set<string> = new Set();
  let songs: Map<string, string> = new Map();
  let albums: { title: string; isCompilation: boolean }[] = [];

  let cmcontinue: string | null = null;

  // Get pages in main category
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    list: "categorymembers",
    cmtitle: `Category:${prodcat}_songs_list`,
    cmprop: "title|sortkeyprefix",
    cmlimit: "500",
    cmtype: "page|subcat",
    cmsort: "sortkey",
    cmdir: "ascending",
    origin: "*",
  });
  while (true) {
    if (cmcontinue) {
      params.set("cmcontinue", cmcontinue);
    }
    let res = await fetch(`${VOCALOID_LYRICS_WIKI_API_ENTRYPOINT}?${params.toString()}`);
    if (!res.ok) {
      throw new ExternalWebServiceError(`Got error response ${res.status}: ${res.statusText}`);
    }
    const json: FetchedMwDiscography = await res.json();

    if (json.error) {
      throw new ExternalWebServiceError(`Failed fetch: ${json.error.info}`);
    }

    for (let page of json.query.categorymembers) {
      let title: string;
      try {
        title = decodeURI(page.title);
      } catch {
        title = page.title;
      }
      let sortkey: string = (page.sortkeyprefix || "") === "" ? title : page.sortkeyprefix || "";
      if (page.ns === 0) {
        songs.set(sortkey, title);
      } else {
        subcats.add(title);
      }
    }

    if (!json.continue) {
      break;
    }
    cmcontinue = json.continue.cmcontinue;
  }

  if (songs.size === 0 && subcats.size === 0) {
    throw new GotZeroPagesInResponseError();
  }

  const getPagesInSubcategory = async (
    subcat: string,
  ): Promise<{ title: string; sortkey: string }[]> => {
    const arr: { title: string; sortkey: string }[] = [];
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      list: "categorymembers",
      cmtitle: `Category:${subcat}`,
      cmprop: "title|sortkeyprefix",
      cmlimit: "500",
      cmtype: "page|subcat",
      cmsort: "sortkey",
      cmdir: "ascending",
      origin: "*",
    });
    while (true) {
      if (cmcontinue) {
        params.set("cmcontinue", cmcontinue);
      }
      let res = await fetch(`${VOCALOID_LYRICS_WIKI_API_ENTRYPOINT}?${params.toString()}`);
      if (!res.ok) {
        throw new ExternalWebServiceError(`Got error response ${res.status}: ${res.statusText}`);
      }
      let json: FetchedMwDiscography = await res.json();

      if (json.error) {
        throw new ExternalWebServiceError(`Failed fetch: ${json.error.info}`);
      }

      arr.push(
        ...json.query.categorymembers.map((el) => {
          let title: string;
          try {
            title = decodeURI(el.title);
          } catch {
            title = el.title;
          }
          let sortkey = (el.sortkeyprefix || "") === "" ? title : el.sortkeyprefix || "";
          return { title, sortkey };
        }),
      );

      if (!json.continue) {
        break;
      }
      cmcontinue = json.continue.cmcontinue;
    }
    return arr;
  };

  const getAlbumPagesInSubcategory = async (
    subcat: string,
  ): Promise<{ title: string; isCompilation: boolean }[]> => {
    const arr: { title: string; isCompilation: boolean }[] = [];
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      generator: "categorymembers",
      indexpageids: "true",
      gcmtitle: subcat,
      prop: "categories",
      gcmlimit: "500",
      cllimit: "500",
      clcategories: "Category:Compilation_albums",
      gcmnamespace: "0",
      gcmsort: "sortkey",
      gcmdir: "ascending",
      origin: "*",
    });
    while (true) {
      if (cmcontinue) {
        params.set("cmcontinue", cmcontinue);
      }
      let res = await fetch(`${VOCALOID_LYRICS_WIKI_API_ENTRYPOINT}?${params.toString()}`);
      if (!res.ok) {
        throw new ExternalWebServiceError(`Got error response ${res.status}: ${res.statusText}`);
      }
      let json: FetchedMwDiscographyAlbum = await res.json();

      if (json.error) {
        throw new ExternalWebServiceError(`Failed fetch: ${json.error.info}`);
      }

      for (let id of json.query.pageids) {
        const page = json.query.pages[id];
        let title: string;
        let isCompilation: boolean;
        try {
          title = decodeURI(page.title);
        } catch {
          title = page.title;
        }
        isCompilation = !!page.categories;
        arr.push({ title, isCompilation });
      }

      if (!json.continue) {
        break;
      }
      cmcontinue = json.continue.cmcontinue;
    }
    return arr;
  };

  let albumSubcat: string | null = [...subcats].find((el) => el.endsWith("/Albums")) || null;
  if (albumSubcat !== null) {
    subcats.delete(albumSubcat);
    albums = await getAlbumPagesInSubcategory(albumSubcat);
  }

  const arrFetched = await Promise.all([...subcats].map((subcat) => getPagesInSubcategory(subcat)));
  for (let arr of arrFetched) {
    for (let { sortkey, title } of arr) {
      songs.set(sortkey, title);
    }
  }

  let sortedSongs: string[][] = Array.from(songs);
  sortedSongs.sort((a, b) => {
    const v = a[0].toLowerCase();
    const w = b[0].toLowerCase();
    return v > w ? 1 : v < w ? -1 : 0;
  });

  const numCompilations = albums.reduce((numCompilations, album) => {
    return album.isCompilation ? numCompilations + 1 : numCompilations;
  }, 0);

  return {
    songs: sortedSongs.map(
      (el) => new ProducerDiscographySongItem({ page: el[1], additionalParameters: "" }),
    ),
    albums: albums.map(
      (el) =>
        new ProducerDiscographyAlbumItem({
          page: el.title,
          additionalParameters: "",
          isCompilation: el.isCompilation,
        }),
    ),
    recommendToSplitAlbum: numCompilations > 10,
  };
}
