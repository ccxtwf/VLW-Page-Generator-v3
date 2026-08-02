import type {
  ExternalLink,
  ProducerDiscographyItem,
  ProducerPageFormData,
} from "../../schemas/form";

import { ProducerPageValidationErrorType } from "./enums";
import { getErrorForProducerValidation } from ".";
import type { ValidationError, ValidationBundledErrors } from ".";

import {
  VdbArtistType,
  VdbWebLinkCategory,
  type FetchedVdbArtistEntity,
} from "../../schemas/vocadb.d";
import type { FetchedMwDiscography, FetchedMwDiscographyAlbum } from "../../schemas/vlw-mw";

import { preprocessStringParams } from "../utils/utils";
import { processExternalLinkFromVocaDb } from "../utils/urlUtils";
import { getVdbPageId } from "../utils/vdbUtils";

import { LANGUAGES, RECOGNIZED_LINKS } from "../../constants";
import { VOCADB_ENTRYPOINT, VOCALOID_LYRICS_WIKI_API_ENTRYPOINT } from "../../config";
import {
  ExternalWebServiceError,
  GotZeroPagesInResponseError,
  VLWInvalidUrlError,
  VocaDBInvalidUrlError,
} from "./exceptions";
import {
  getDiscographyItemWikitext,
  getExternalLinkWikitext,
  getUnofficialProdLinks,
} from "../utils/genUtils";

export function validate(
  formData: ProducerPageFormData,
): ValidationBundledErrors<ProducerPageValidationErrorType> {
  preprocessStringParams(formData, [
    "prodCategory",
    "prodAliases",
    "affiliations",
    "labels",
    "description",
  ]);
  let { prodCategory, roles, languages, description, extLinks, songs }: ProducerPageFormData =
    formData;

  const errors: ValidationError<ProducerPageValidationErrorType>[] = [];

  if (prodCategory === "") {
    errors.push(
      getErrorForProducerValidation(ProducerPageValidationErrorType.NO_PRODUCER_CATEGORY),
    );
  }

  if (languages.length === 0) {
    errors.push(
      getErrorForProducerValidation(ProducerPageValidationErrorType.LANGUAGE_IS_NOT_SELECTED),
    );
  }

  if (Object.values(roles).every((el) => !el)) {
    errors.push(
      getErrorForProducerValidation(ProducerPageValidationErrorType.PRODUCER_ROLE_IS_NOT_SELECTED),
    );
  }

  if (description === "") {
    errors.push(
      getErrorForProducerValidation(ProducerPageValidationErrorType.DESCRIPTION_IS_NOT_SET),
    );
  }

  if (extLinks.length === 0) {
    errors.push(
      getErrorForProducerValidation(ProducerPageValidationErrorType.EXTERNAL_LINK_IS_NOT_LISTED),
    );
  } else {
    if (extLinks.every((link) => !link.isOfficial)) {
      errors.push(
        getErrorForProducerValidation(
          ProducerPageValidationErrorType.EXTERNAL_LINK_IS_NOT_OFFICIAL,
        ),
      );
    }
  }

  if (songs.length === 0) {
    errors.push(getErrorForProducerValidation(ProducerPageValidationErrorType.NO_SONG_PAGE));
  }

  const fatal = errors.some(({ fatal }) => fatal);
  return { errors, autoloadCategories: false, fatal };
}

export function generatePage(formData: ProducerPageFormData): string {
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
    extLinks,
    songs,
    albums,
  } = formData;

  let extLinksSegment: string = "";
  let categories: string[] = ["Producers"];

  let officialLinks: string = extLinks
    .filter((link) => link.isOfficial && !link.isMedia)
    .map((link) => `* ${link.description}: [${link.url} ]\n`)
    .join("");
  let mediaLinks: string = extLinks
    .filter((link) => link.isOfficial && link.isMedia)
    .map((link) => `* ${getExternalLinkWikitext(link)}\n`)
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
          originalAlbums
            .map((album) => `|-\n| ${getDiscographyItemWikitext(album, true)}\n`)
            .join("") +
          "|}\n";
      }
      if (originalAlbums.length > 0 && compilationAlbums.length > 0) {
        albumListSegment += "\n";
      }
      if (compilationAlbums.length > 0) {
        albumListSegment +=
          `===Compilations===\n{| class="sortable producer-table"\n${""}|- class="vcolor-default"\n${""}! {{awt head}}\n` +
          compilationAlbums
            .map((album) => `|-\n| ${getDiscographyItemWikitext(album, true)}\n`)
            .join("") +
          "|}\n";
      }
    } else {
      albumListSegment =
        `==Discography==\n${""}{| class="sortable producer-table"\n${""}|- class="vcolor-default"\n${""}! {{awt head}}\n` +
        albums.map((album) => `|-\n| ${getDiscographyItemWikitext(album, true)}\n`).join("") +
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
${songs.map((song) => `|-\n| ${getDiscographyItemWikitext(song)}\n`).join("")}|}

${albumListSegment}
${categories.map((cat) => `[[Category:${cat}]]`).join("\n")}`.trim();
}

export async function fetchDataFromVocaDb(
  url: string,
): Promise<Omit<ProducerPageFormData, "songs" | "albums">> {
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

  const extLinks: ExternalLink[] = [];

  for (let artistLink of json.artistLinks || []) {
    if (artistLink.artist.artistType === VdbArtistType.label) {
      labels.push(artistLink.artist.name || "");
    } else {
      affiliations.push(artistLink.artist.name || "");
    }
  }

  extLinks.push({
    url: `${VOCADB_ENTRYPOINT}Ar/${vdbPageId}`,
    description: "VocaDB",
    isOfficial: false,
    isMedia: false,
    isInactive: false,
  });
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
    extLinks.push({
      url,
      description,
      isOfficial,
      isMedia,
      isInactive,
    });
  }

  const formData: Omit<ProducerPageFormData, "songs" | "albums"> = {
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

export async function fetchDiscographyFromVlw(prodcat: string): Promise<{
  songs: ProducerDiscographyItem[];
  albums: ProducerDiscographyItem[];
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
    songs: sortedSongs.map((el) => ({ page: el[1], additionalParameters: "" })),
    albums: albums.map((el) => ({
      page: el.title,
      additionalParameters: "",
      isCompilation: el.isCompilation,
    })),
    recommendToSplitAlbum: numCompilations > 10,
  };
}