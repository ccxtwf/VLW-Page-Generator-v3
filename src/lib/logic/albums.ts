import type { AlbumPageFormData } from "../../schemas/form";

import { AlbumPageValidationErrorType } from "./enums";
import { getErrorForAlbumValidation } from ".";
import type { ValidationError, ValidationBundledErrors } from ".";

import { preprocessStringParams, validateColour } from "../utils/utils";

export function validate(
  formData: AlbumPageFormData,
): ValidationBundledErrors<AlbumPageValidationErrorType> {
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
    categoriesRaw,
  }: AlbumPageFormData = preprocessStringParams(formData, [
    "origTitle",
    "bgColour",
    "fgColour",
    "description",
    "publishedYear",
    "publishedMonth",
    "publishedDay",
    "vdbAlbumId",
    "categoriesRaw",
  ]);

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

  const categories = categoriesRaw.split("\n");
  if (categories.length === 0) {
    errors.push(getErrorForAlbumValidation(AlbumPageValidationErrorType.NO_CATEGORIES));
  }

  const autoloadCategories = errors.some(({ autoloadCategories }) => autoloadCategories);
  const fatal = errors.some(({ fatal }) => fatal);
  return { errors, autoloadCategories, fatal };
}