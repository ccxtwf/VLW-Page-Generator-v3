import type { AlbumPageFormData } from "../../schemas/form";

import { AlbumPageValidationErrorType } from "./enums";
import { getErrorForAlbumValidation } from ".";
import type { ValidationError, ValidationBundledErrors } from ".";

import { detonePinyin, preprocessStringParams, validateColour } from "../utils/utils";

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