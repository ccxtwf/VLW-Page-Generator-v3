import { AlbumPageValidationErrorType, type ValidationError } from "./types";

const validationErrors: Record<
  AlbumPageValidationErrorType,
  ValidationError<AlbumPageValidationErrorType>
> = {
  [AlbumPageValidationErrorType.ALBUM_TITLE_IS_NOT_SET]: {
    fatal: true,
    fields: ["original-title"],
    i18nKey: "validation.album.albumTitleNotSet",
  },
  [AlbumPageValidationErrorType.BG_COLOR_IS_EMPTY]: {
    fatal: true,
    fields: ["infobox-bg-color", "infobox-bg-color-picker"],
    i18nKey: "validation.album.bgColorIsEmpty",
  },
  [AlbumPageValidationErrorType.FG_COLOR_IS_EMPTY]: {
    fatal: true,
    fields: ["infobox-fg-color", "infobox-fg-color-picker"],
    i18nKey: "validation.album.fgColorIsEmpty",
  },
  [AlbumPageValidationErrorType.BG_COLOR_IS_INVALID]: {
    fatal: true,
    fields: ["infobox-bg-color", "infobox-bg-color-picker"],
    i18nKey: "validation.album.bgColorIsInvalid",
  },
  [AlbumPageValidationErrorType.FG_COLOR_IS_INVALID]: {
    fatal: true,
    fields: ["infobox-fg-color", "infobox-fg-color-picker"],
    i18nKey: "validation.album.fgColorIsInvalid",
  },
  [AlbumPageValidationErrorType.DESCRIPTION_IS_NOT_SET]: {
    fatal: true,
    fields: ["description"],
    i18nKey: "validation.album.descriptionNotSet",
  },
  [AlbumPageValidationErrorType.PUB_DATE_IS_NOT_SET]: {
    fatal: true,
    fields: ["published-year", "published-month", "published-day"],
    i18nKey: "validation.album.pubDateNotSet",
  },
  [AlbumPageValidationErrorType.PUB_YEAR_IS_NOT_SET]: {
    fatal: true,
    fields: ["published-year"],
    i18nKey: "validation.album.pubYearNotSet",
  },
  [AlbumPageValidationErrorType.PUB_MONTH_IS_NOT_SET]: {
    fatal: true,
    fields: ["published-month"],
    i18nKey: "validation.album.pubMonthNotSet",
  },
  [AlbumPageValidationErrorType.PUB_YEAR_IS_INVALID]: {
    fatal: true,
    fields: ["published-year"],
    i18nKey: "validation.album.pubYearInvalid",
  },
  [AlbumPageValidationErrorType.NO_VOCADB_LINK]: {
    fields: ["vocadb-album-id"],
    i18nKey: "validation.album.noVocaDbLink",
  },
  [AlbumPageValidationErrorType.NO_TRACK_IS_LISTED]: {
    fatal: true,
    fields: ["tracklist"],
    i18nKey: "validation.album.noTrackListed",
  },
  [AlbumPageValidationErrorType.NO_TRACK_LIST_NUMBERING]: {
    fatal: true,
    fields: ["tracklist"],
    i18nKey: "validation.album.noTracklistNumbering",
  },
  [AlbumPageValidationErrorType.DISC_NUMBER_IS_NOT_NUMERIC]: {
    fatal: true,
    fields: ["tracklist"],
    i18nKey: "validation.album.discNumberIsNotNumeric",
  },
  [AlbumPageValidationErrorType.TRACK_NUMBER_IS_NOT_NUMERIC]: {
    fatal: true,
    fields: ["tracklist"],
    i18nKey: "validation.album.trackNumberIsNotNumeric",
  },
  [AlbumPageValidationErrorType.EMPTY_TRACK_NAME]: {
    fatal: true,
    fields: ["tracklist"],
    i18nKey: "validation.album.emptyTrackName",
  },
  [AlbumPageValidationErrorType.EMPTY_TRACK_CREDITS]: {
    fatal: true,
    fields: ["tracklist"],
    i18nKey: "validation.album.emptyTrackCredits",
  },
  [AlbumPageValidationErrorType.OFFICIAL_LINK_IS_NOT_LISTED]: {
    fields: ["official-links"],
    i18nKey: "validation.album.officialLinkNotListed",
  },
  [AlbumPageValidationErrorType.SYNTH_ENGINE_IS_NOT_LISTED]: {
    fatal: true,
    fields: ["synths"],
    i18nKey: "validation.album.synthEngineNotListed",
    autoloadCategories: true,
  },
  [AlbumPageValidationErrorType.NO_CATEGORIES]: {
    fatal: true,
    fields: ["categories"],
    i18nKey: "validation.album.noCategories",
    autoloadCategories: true,
  },
  [AlbumPageValidationErrorType.INVALID_EMBED_CODE]: {
    fatal: true,
    fields: ["official-links"],
    i18nKey: "validation.album.invalidEmbedCode",
  },
};

export function getValidationError(
  val: AlbumPageValidationErrorType,
): ValidationError<AlbumPageValidationErrorType> {
  return { ...validationErrors[val], type: val };
}
