import { SongPageValidationErrorType, type ValidationError } from "./types";

const validationErrors: Record<
  SongPageValidationErrorType,
  ValidationError<SongPageValidationErrorType>
> = {
  [SongPageValidationErrorType.CONTENT_WARNING_HAS_NO_JUSTIFICATION]: {
    fatal: true,
    fields: ["cw-text", "content-warning"],
    i18nKey: "validation.song.cwHasNoJustification",
  },
  [SongPageValidationErrorType.GEN_AI_HAS_NO_USAGE_ATTRIBUTION]: {
    fatal: true,
    fields: ["gen-ai-usage", "gen-ai-warning"],
    i18nKey: "validation.song.genAiHasNoUsageAttribution",
  },
  [SongPageValidationErrorType.GEN_AI_HAS_NO_SOURCE]: {
    fatal: true,
    fields: ["gen-ai-source"],
    i18nKey: "validation.song.genAiHasNoSource",
  },
  [SongPageValidationErrorType.LANGUAGE_IS_NOT_SELECTED]: {
    fatal: true,
    fields: ["languages"],
    i18nKey: "validation.song.languageNotSelected",
  },
  [SongPageValidationErrorType.SONG_TITLE_IS_NOT_SET]: {
    fatal: true,
    fields: ["original-title"],
    i18nKey: "validation.song.noTitle",
  },
  [SongPageValidationErrorType.PUBLICATION_IS_NOT_SET]: {
    fatal: true,
    fields: ["upload-date"],
    i18nKey: "validation.song.noDate",
  },
  [SongPageValidationErrorType.BG_COLOR_IS_EMPTY]: {
    fatal: true,
    fields: ["infobox-bg-color", "infobox-bg-color-picker"],
    i18nKey: "validation.song.bgColorIsEmpty",
  },
  [SongPageValidationErrorType.FG_COLOR_IS_EMPTY]: {
    fatal: true,
    fields: ["infobox-fg-color", "infobox-fg-color-picker"],
    i18nKey: "validation.song.fgColorIsEmpty",
  },
  [SongPageValidationErrorType.BG_COLOR_IS_INVALID]: {
    fatal: true,
    fields: ["infobox-bg-color", "infobox-bg-color-picker"],
    i18nKey: "validation.song.bgColorIsInvalid",
  },
  [SongPageValidationErrorType.FG_COLOR_IS_INVALID]: {
    fatal: true,
    fields: ["infobox-fg-color", "infobox-fg-color-picker"],
    i18nKey: "validation.song.fgColorIsInvalid",
  },
  [SongPageValidationErrorType.NO_SINGER_IS_LISTED]: {
    fatal: true,
    fields: ["singers"],
    i18nKey: "validation.song.noSinger",
    autoloadCategories: true,
  },
  [SongPageValidationErrorType.NO_SINGER_IN_MARKUP]: {
    fatal: true,
    fields: ["singers"],
    i18nKey: "validation.song.noSingerInMarkup",
    autoloadCategories: true,
  },
  [SongPageValidationErrorType.NO_PRODUCER_IS_LISTED]: {
    fatal: true,
    fields: ["producers"],
    i18nKey: "validation.song.noProducer",
    autoloadCategories: true,
  },
  [SongPageValidationErrorType.NO_PRODUCER_IN_MARKUP]: {
    fields: ["producers"],
    i18nKey: "validation.song.noProducerInMarkup",
    autoloadCategories: true,
  },
  [SongPageValidationErrorType.NO_PLAY_LINK]: {
    fatal: true,
    fields: ["broadcast-links"],
    i18nKey: "validation.song.noPlayLink",
    autoloadCategories: true,
  },
  [SongPageValidationErrorType.NO_VIEW_COUNT]: {
    fields: ["broadcast-links"],
    i18nKey: "validation.song.noViewCount",
  },
  [SongPageValidationErrorType.BILIBILI_HAS_AVID]: {
    fields: ["broadcast-links"],
    i18nKey: "validation.song.bilibiliUsesAvid",
  },
  [SongPageValidationErrorType.ORIGINAL_LYRICS_ARE_EMPTY]: {
    fatal: true,
    fields: ["lyrics"],
    i18nKey: "validation.song.noOriginalLyrics",
  },
  [SongPageValidationErrorType.ROMANIZED_LYRICS_ARE_EMPTY]: {
    fatal: true,
    fields: ["lyrics"],
    i18nKey: "validation.song.noRomanizedLyrics",
  },
  [SongPageValidationErrorType.UNCREDITED_TRANSLATION]: {
    fields: ["lyrics"],
    i18nKey: "validation.song.uncreditedTranslation",
  },
};

export function getValidationError(
  val: SongPageValidationErrorType,
): ValidationError<SongPageValidationErrorType> {
  return { ...validationErrors[val], type: val };
}
