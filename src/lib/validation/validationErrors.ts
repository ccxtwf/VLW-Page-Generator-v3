import {
  SongPageValidationErrorType,
  AlbumPageValidationErrorType,
  ProducerPageValidationErrorType,
} from "./enums";

import type { ValidationError } from ".";

export const songValidationErrors: Record<
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

export const albumValidationErrors: Record<
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

export const producerValidationErrors: Record<
  ProducerPageValidationErrorType,
  ValidationError<ProducerPageValidationErrorType>
> = {
  [ProducerPageValidationErrorType.NO_PRODUCER_CATEGORY]: {
    fatal: true,
    fields: ["producer-category"],
    i18nKey: "validation.producer.noProdCat",
  },
  [ProducerPageValidationErrorType.LANGUAGE_IS_NOT_SELECTED]: {
    fatal: true,
    fields: ["languages"],
    i18nKey: "validation.producer.languageNotSelected",
  },
  [ProducerPageValidationErrorType.PRODUCER_ROLE_IS_NOT_SELECTED]: {
    fatal: true,
    fields: ["producer-roles"],
    i18nKey: "validation.producer.prodRoleNotSelected",
  },
  [ProducerPageValidationErrorType.DESCRIPTION_IS_NOT_SET]: {
    fatal: true,
    fields: ["description"],
    i18nKey: "validation.producer.descriptionNotSet",
  },
  [ProducerPageValidationErrorType.EXTERNAL_LINK_IS_NOT_LISTED]: {
    fatal: true,
    fields: ["external-links"],
    i18nKey: "validation.producer.extLinkNotListed",
  },
  [ProducerPageValidationErrorType.EXTERNAL_LINK_IS_NOT_OFFICIAL]: {
    fatal: true,
    fields: ["external-links"],
    i18nKey: "validation.producer.extLinkNotOfficial",
  },
  [ProducerPageValidationErrorType.NO_SONG_PAGE]: {
    fatal: true,
    fields: ["discography-songs"],
    i18nKey: "validation.producer.noSongPage",
  },
};