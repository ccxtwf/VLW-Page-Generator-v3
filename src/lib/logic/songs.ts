import type { SongPageFormData } from "../../schemas/form";
import { ENUM_CW_STATES, ENUM_AI_WARNING_TYPE } from "../../schemas/enums";

import { SongPageValidationErrorType } from "./enums";
import { getErrorForSongValidation } from ".";
import type { ValidationError, ValidationBundledErrors } from ".";

import { preprocessStringParams, validateColour } from "../utils/utils";

export function validate(
  formData: SongPageFormData,
): ValidationBundledErrors<SongPageValidationErrorType> {
  let {
    aiCwState,
    aiWarningText1,
    aiWarningText2,
    cwState,
    cwText,
    origTitle,
    languages = [],
    bgColour,
    fgColour,
    uploadDate,
    singers,
    producers,
    isAlbumOnly = false,
    isUnavailable = false,
    translator,
    isOfficialTranslation = false,
  } = preprocessStringParams(formData, [
    "aiWarningText1",
    "aiWarningText2",
    "cwText",
    "origTitle",
    "bgColour",
    "fgColour",
    "uploadDate",
    "singers",
    "producers",
  ]);

  const errors: ValidationError<SongPageValidationErrorType>[] = [];

  if (cwState !== ENUM_CW_STATES.noWarnings && cwText === "") {
    errors.push(
      getErrorForSongValidation(SongPageValidationErrorType.CONTENT_WARNING_HAS_NO_JUSTIFICATION),
    );
  }
  if (aiCwState !== ENUM_AI_WARNING_TYPE.none && aiWarningText1 === "") {
    errors.push(
      getErrorForSongValidation(SongPageValidationErrorType.GEN_AI_HAS_NO_USAGE_ATTRIBUTION),
    );
  }
  if (aiCwState !== ENUM_AI_WARNING_TYPE.none && aiWarningText2 === "") {
    errors.push(getErrorForSongValidation(SongPageValidationErrorType.GEN_AI_HAS_NO_SOURCE));
  }

  if (languages.length === 0) {
    errors.push(getErrorForSongValidation(SongPageValidationErrorType.LANGUAGE_IS_NOT_SELECTED));
  }

  if (origTitle === "") {
    errors.push(getErrorForSongValidation(SongPageValidationErrorType.SONG_TITLE_IS_NOT_SET));
  }

  if (uploadDate === "" || isNaN(new Date(uploadDate) as unknown as number)) {
    errors.push(getErrorForSongValidation(SongPageValidationErrorType.PUBLICATION_IS_NOT_SET));
  }

  if (bgColour === "") {
    errors.push(getErrorForSongValidation(SongPageValidationErrorType.BG_COLOR_IS_EMPTY));
  }
  if (fgColour === "") {
    errors.push(getErrorForSongValidation(SongPageValidationErrorType.FG_COLOR_IS_EMPTY));
  }
  if (!validateColour(bgColour)) {
    errors.push(getErrorForSongValidation(SongPageValidationErrorType.BG_COLOR_IS_INVALID));
  }
  if (!validateColour(fgColour)) {
    errors.push(getErrorForSongValidation(SongPageValidationErrorType.FG_COLOR_IS_INVALID));
  }

  if (singers === "") {
    errors.push(getErrorForSongValidation(SongPageValidationErrorType.NO_SINGER_IS_LISTED));
  }
  if (
    singers.match(/\[\[[^\]]*\]\]/gm) === null &&
    singers.match(/\{\{[Ss]inger\|[^}]*\}\}/gm) === null
  ) {
    errors.push(getErrorForSongValidation(SongPageValidationErrorType.NO_SINGER_IN_MARKUP));
  }
  if (producers === "") {
    errors.push(getErrorForSongValidation(SongPageValidationErrorType.NO_PRODUCER_IS_LISTED));
  } else {
    if (producers.match(/\[\[[^\]]*\]\]/gm) === null) {
      errors.push(getErrorForSongValidation(SongPageValidationErrorType.NO_PRODUCER_IN_MARKUP));
    }
  }

  /*

  if (!isUnavailable && !isAlbumOnly && playLinks.length === 0) {
    errors.push(getErrorForSongValidation(SongPageValidationErrorType.NO_PLAY_LINK));
  }

  const forgotViewCounts = playLinks
    .filter((link) => link.isOfficiallyAvailable && PV_SERVICE_ABBREVIATIONS.has(link.site))
    .some((link) => link.viewCount === "");
  if (forgotViewCounts) {
    errors.push(getErrorForSongValidation(SongPageValidationErrorType.NO_VIEW_COUNT));
  }

  const hasAvid = playLinks.some(
    (link) => link.url.match(/^https?:\/\/www\.bilibili\.com\/video\/(av\d+)/) !== null,
  );
  if (hasAvid) {
    errors.push(getErrorForSongValidation(SongPageValidationErrorType.BILIBILI_HAS_AVID));
  }

  const hasNoOriginalLyrics = lyrics.every((lyric) => lyric.original === "");
  if (hasNoOriginalLyrics) {
    errors.push(getErrorForSongValidation(SongPageValidationErrorType.ORIGINAL_LYRICS_ARE_EMPTY));
  }

  const hasRomanization = lyrics.some((lyric) => !!lyric.romanized && lyric.romanized !== "");
  if (!skipColumns?.includes(2) && !hasRomanization) {
    errors.push(getErrorForSongValidation(SongPageValidationErrorType.ROMANIZED_LYRICS_ARE_EMPTY));
  }

  const hasEnglishTranslation =
    !skipColumns?.includes(3) && lyrics.some((lyric) => !!lyric.english && lyric.english !== "");
  if (hasEnglishTranslation && translator === "" && !isOfficialTranslation) {
    errors.push(getErrorForSongValidation(SongPageValidationErrorType.UNCREDITED_TRANSLATION));
  }

  */

  const autoloadCategories = errors.some(({ autoloadCategories }) => autoloadCategories);
  const fatal = errors.some(({ fatal }) => fatal);
  return { errors, autoloadCategories, fatal };
}