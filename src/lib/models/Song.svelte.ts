import type { BaseModel, PreprocessorMixin } from "./base";
import type { ISong } from "./schema";
import LyricRow from "./children/LyricsRow.svelte";
import PlayLink from "./children/PlayLink.svelte";
import ExternalLink from "./children/ExternalLink.svelte";

import { getValidationError } from "../validationErrors/songs";
import {
  SongPageValidationErrorType,
  type ValidationBundledErrors,
  type ValidationError,
} from "../validationErrors/types";

import { preprocessStringParams, validateColour } from "../utils/utils";
import { getLanguageMetadata } from "../utils/lyricsUtils";
import type { MultiSelectItem } from "../../schemas/form";
import { PV_SERVICE_ABBREVIATIONS, PV_SERVICE_PROVIDER } from "../../constants";
import { ENUM_AI_WARNING_TYPE, ENUM_CW_STATES } from "./enums";

export default class Song implements BaseModel, ISong {
  aiCwState: ENUM_AI_WARNING_TYPE = $state(ENUM_AI_WARNING_TYPE.none);
  aiWarningText1: string = $state("");
  aiWarningText2: string = $state("");
  cwState: ENUM_CW_STATES = $state(ENUM_CW_STATES.noWarnings);
  cwText: string = $state("");
  hasEpilepsyWarning: boolean = $state(false);
  languages: MultiSelectItem[] = $state([]);
  isoLangCode: string = $state("");
  origTitle: string = $state("");
  altChTitle: string = $state("");
  altChIsTraditional: boolean = $state(true);
  romTitle: string = $state("");
  engTitle: string = $state("");
  titleIsOfficiallyTranslated: boolean = $state(false);
  bgColour: string = $state("");
  fgColour: string = $state("");
  uploadDateRaw: string = $state("");
  isAlbumOnly: boolean = $state(false);
  isUnavailable: boolean = $state(false);
  singers: string = $state("");
  producers: string = $state("");
  description: string = $state("");
  translator: string = $state("");
  isOfficialTranslation: boolean = $state(false);
  categoriesRaw: string = $state("");

  lyrics: LyricRow[] = $state(
    Array(20)
      .fill(null)
      .map(() => new LyricRow()),
  );
  playLinks: PlayLink[] = $state(
    [
      PV_SERVICE_PROVIDER.niconico,
      PV_SERVICE_PROVIDER.youtube,
      PV_SERVICE_PROVIDER.bilibili,
      PV_SERVICE_PROVIDER.soundcloud,
      PV_SERVICE_PROVIDER.bandcamp,
    ].map((site) => new PlayLink({ site })),
  );
  extLinks: ExternalLink[] = $state(
    Array(5)
      .fill(null)
      .map(() => new ExternalLink()),
  );

  uploadDate?: Date | null = null;
  categories: string[] = [];

  constructor() {}

  preprocess(): void {
    preprocessStringParams(this, [
      "aiWarningText1",
      "aiWarningText2",
      "cwText",
      "isoLangCode",
      "origTitle",
      "altChTitle",
      "romTitle",
      "engTitle",
      "bgColour",
      "fgColour",
      "uploadDateRaw",
      "singers",
      "producers",
      "description",
      "translator",
      "categoriesRaw",
    ]);
    this.uploadDate = this.uploadDateRaw === "" ? null : new Date(this.uploadDateRaw);
    this.categories = this.categoriesRaw === "" ? [] : this.categoriesRaw.split("\n");

    for (const a of [this.lyrics, this.playLinks, this.extLinks] as PreprocessorMixin[][]) {
      a.forEach((e) => e.preprocess());
    }
  }

  validate(): ValidationBundledErrors<SongPageValidationErrorType> {
    const {
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
      lyrics,
      playLinks,
    } = this;

    const errors: ValidationError<SongPageValidationErrorType>[] = [];

    if (cwState !== ENUM_CW_STATES.noWarnings && cwText === "") {
      errors.push(
        getValidationError(SongPageValidationErrorType.CONTENT_WARNING_HAS_NO_JUSTIFICATION),
      );
    }
    if (aiCwState !== ENUM_AI_WARNING_TYPE.none && aiWarningText1 === "") {
      errors.push(getValidationError(SongPageValidationErrorType.GEN_AI_HAS_NO_USAGE_ATTRIBUTION));
    }
    if (aiCwState !== ENUM_AI_WARNING_TYPE.none && aiWarningText2 === "") {
      errors.push(getValidationError(SongPageValidationErrorType.GEN_AI_HAS_NO_SOURCE));
    }

    if (languages.length === 0) {
      errors.push(getValidationError(SongPageValidationErrorType.LANGUAGE_IS_NOT_SELECTED));
    }

    if (origTitle === "") {
      errors.push(getValidationError(SongPageValidationErrorType.SONG_TITLE_IS_NOT_SET));
    }

    if (!uploadDate || isNaN(uploadDate as unknown as number)) {
      errors.push(getValidationError(SongPageValidationErrorType.PUBLICATION_IS_NOT_SET));
    }

    if (bgColour === "") {
      errors.push(getValidationError(SongPageValidationErrorType.BG_COLOR_IS_EMPTY));
    }
    if (fgColour === "") {
      errors.push(getValidationError(SongPageValidationErrorType.FG_COLOR_IS_EMPTY));
    }
    if (!validateColour(bgColour)) {
      errors.push(getValidationError(SongPageValidationErrorType.BG_COLOR_IS_INVALID));
    }
    if (!validateColour(fgColour)) {
      errors.push(getValidationError(SongPageValidationErrorType.FG_COLOR_IS_INVALID));
    }

    if (singers === "") {
      errors.push(getValidationError(SongPageValidationErrorType.NO_SINGER_IS_LISTED));
    }
    if (
      singers.match(/\[\[[^\]]*\]\]/gm) === null &&
      singers.match(/\{\{[Ss]inger\|[^}]*\}\}/gm) === null
    ) {
      errors.push(getValidationError(SongPageValidationErrorType.NO_SINGER_IN_MARKUP));
    }
    if (producers === "") {
      errors.push(getValidationError(SongPageValidationErrorType.NO_PRODUCER_IS_LISTED));
    } else {
      if (producers.match(/\[\[[^\]]*\]\]/gm) === null) {
        errors.push(getValidationError(SongPageValidationErrorType.NO_PRODUCER_IN_MARKUP));
      }
    }

    if (!isUnavailable && !isAlbumOnly && playLinks.length === 0) {
      errors.push(getValidationError(SongPageValidationErrorType.NO_PLAY_LINK));
    }

    const forgotViewCounts = playLinks
      .filter(
        (link) => !link.isReprint && !link.isDeleted && PV_SERVICE_ABBREVIATIONS.has(link.site),
      )
      .some((link) => link.viewCount === "");
    if (forgotViewCounts) {
      errors.push(getValidationError(SongPageValidationErrorType.NO_VIEW_COUNT));
    }

    const hasAvid = playLinks.some(
      (link) => link.url.match(/^https?:\/\/www\.bilibili\.com\/video\/(av\d+)/) !== null,
    );
    if (hasAvid) {
      errors.push(getValidationError(SongPageValidationErrorType.BILIBILI_HAS_AVID));
    }

    const langMetadata = getLanguageMetadata(languages);

    const hasNoOriginalLyrics = lyrics.every((lyric) => lyric.original === "");
    if (hasNoOriginalLyrics) {
      errors.push(getValidationError(SongPageValidationErrorType.ORIGINAL_LYRICS_ARE_EMPTY));
    }

    const hasRomanization = lyrics.some((lyric) => !!lyric.romanized && lyric.romanized !== "");
    if (langMetadata.needsRomanization && !hasRomanization) {
      errors.push(getValidationError(SongPageValidationErrorType.ROMANIZED_LYRICS_ARE_EMPTY));
    }

    const hasEnglishTranslation =
      langMetadata.needsTranslation &&
      lyrics.some((lyric) => !!lyric.english && lyric.english !== "");
    if (hasEnglishTranslation && translator === "" && !isOfficialTranslation) {
      errors.push(getValidationError(SongPageValidationErrorType.UNCREDITED_TRANSLATION));
    }

    const autoloadCategories = errors.some(({ autoloadCategories }) => autoloadCategories);
    const fatal = errors.some(({ fatal }) => fatal);
    return { errors, autoloadCategories, fatal };
  }
}
