import type { SongPageFormData } from "../../schemas/form";
import { ENUM_CW_STATES, ENUM_AI_WARNING_TYPE } from "../../schemas/enums";

import { SongPageValidationErrorType } from "./enums";
import { getErrorForSongValidation } from ".";
import type { ValidationError, ValidationBundledErrors } from ".";

import { detonePinyin, preprocessStringParams, validateColour } from "../utils/utils";
import { MONTHS } from "../../constants/months";

export function validate(
  formData: SongPageFormData,
): ValidationBundledErrors<SongPageValidationErrorType> {
  preprocessStringParams(formData, [
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
  formData.uploadDate = formData.uploadDateRaw === "" ? null : new Date(formData.uploadDateRaw);
  formData.categories = formData.categoriesRaw === "" ? [] : formData.categoriesRaw.split("\n");

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
  } = formData;

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

  if (!uploadDate || isNaN(uploadDate as unknown as number)) {
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

export function generatePage(formData: SongPageFormData): string {
  let {
    aiCwState,
    aiWarningText1,
    aiWarningText2,
    cwState,
    cwText,
    hasEpilepsyWarning,
    origTitle,
    altChTitle,
    altChIsTraditional,
    romTitle,
    engTitle,
    titleIsOfficiallyTranslated,
    bgColour,
    fgColour,
    uploadDate,
    singers,
    producers,
    description,
    languages,
    isoLangCode,
    isUnavailable,
    isAlbumOnly,
    translator,
    isOfficialTranslation,
    categories,
  } = formData;

  let displayTitleTemplate: string = "";
  let sortTemplate: string = "";
  let unavailableTemplate: string = "";
  let cwTemplates: string = "";
  let titlesSegment: string = "";
  let dateSegment: string = "";
  let lyricsSegment: string = "";
  let songLinksSegment: string = "";
  let viewCountsSegment: string = "";
  let languageSegment: string = languages.join(";");
  let officialLinksWikitext: string = "";
  let unofficialLinksWikitext: string = "";
  let extLinksSegment: string = "";

  /*
  if (needsRomanization && romTitle !== '') {
    let sortkey = detonePinyin(romTitle);
    sortTemplate = `{{sort|${trySortkey}}}`;
  }
  */

  cwTemplates = hasEpilepsyWarning ? "{{Epilepsy}}" : "";
  cwTemplates +=
    cwState === ENUM_CW_STATES.questionable
      ? `{{Questionable${cwText === "" ? "" : `|${cwText}`}}}`
      : cwState === ENUM_CW_STATES.explicit
        ? `{{Explicit${cwText === "" ? "" : `|${cwText}`}}}`
        : "";
  if (aiCwState !== ENUM_AI_WARNING_TYPE.none) {
    cwTemplates += `{{AIusage|${aiWarningText1}|${aiWarningText2}${aiCwState === ENUM_AI_WARNING_TYPE.suspected ? "|unverified=1" : ""}}}`;
  }

  // const hasOfficiallyAvailablePlayLinks = playLinks.some(link => link.isOfficiallyAvailable);
  if (isUnavailable) {
    unavailableTemplate = "{{Unavailable}}";
  }

  if (origTitle.match(/^[a-z]/) !== null) {
    displayTitleTemplate = "{{Lowercase}}";
  }
  if (origTitle.match(/[_#]/g) !== null) {
    displayTitleTemplate = `{{DISPLAYTITLE:${origTitle}${
      romTitle === "" ? "" : ` (${romTitle})`
    }}}`;
  }

  titlesSegment = `"'''${origTitle}'''"`;
  if (altChTitle !== "")
    titlesSegment += `<br />${altChIsTraditional ? "Traditional" : "Simplified"} Chinese: ${altChTitle}`;
  /*
  if (needsRomanization && romTitle !== '') {
    titlesSegment += `<br />${headersText[1]}: ${romTitle}`;
  }
  if (needsEnglishTranslation && engTitle !== '') {
    titlesSegment += `<br />${titleIsOfficiallyTranslated ? 'Official ' : ''}English: ${engTitle}`;
  }
  */

  if (uploadDate !== null) {
    dateSegment = `{{Date|${uploadDate!.getUTCFullYear()}|${
      MONTHS[uploadDate!.getUTCMonth()]
    }|${uploadDate!.getUTCDate()}}}`;
  }

  /*
  if (playLinks.length === 0) songLinksSegment = "N/A";
  else songLinksSegment = playLinks.map((playLink) => playLink.getWikitext()).join(" ");
  const viewCounts = playLinks
    .filter((playLink) => !playLink.isReprint && PV_SERVICE_ABBREVIATIONS.has(playLink.site))
    .map((playLink) => ({
      vc: playLink.getFormattedViewCount(),
      // @ts-ignore
      abbr: PV_SERVICE_ABBREVIATIONS.get(playLink.site),
    }));
  if (viewCounts.length > 1) {
    viewCountsSegment = viewCounts.map((el) => `${el.vc} (${el.abbr})`).join(", ");
  } else {
    viewCountsSegment = viewCounts.map((el) => el.vc).join(", ");
  }
  if (viewCountsSegment === "") viewCountsSegment = "N/A";

  lyricsSegment = generateLyricsTable(lyrics, {
    langOptions: { headersText, skipColumns },
    isoLangCode,
    translator,
    isOfficialTranslation,
    bgColour,
    fgColour,
  });

  unofficialLinksWikitext = extLinks
    .filter((link) => !link.isOfficial)
    .map((el) => "* " + el.getWikitext())
    .join("\n");
  officialLinksWikitext = extLinks
    .filter((link) => link.isOfficial)
    .map((el) => "* " + el.getWikitext())
    .join("\n");
  if (unofficialLinksWikitext !== "" || officialLinksWikitext !== "") {
    extLinksSegment = "==External Links==\n";
    extLinksSegment += officialLinksWikitext;
    extLinksSegment += officialLinksWikitext === "" ? "" : "\n";
    extLinksSegment +=
      unofficialLinksWikitext === "" ? "" : `===Unofficial===\n${unofficialLinksWikitext}\n\n`;
  }
  */

  return `${displayTitleTemplate}${sortTemplate}${unavailableTemplate}${cwTemplates}
{{Infobox Song
|songtitle = ${titlesSegment}
|color = ${bgColour}; color:${fgColour}
|original upload date = ${dateSegment}
|singer = ${singers}
|producer = ${producers}
|#views = ${viewCountsSegment}
|link = ${songLinksSegment}${isAlbumOnly ? "\n|album-only = 1" : ""}${description ? `\n|description = ${description}` : ""}
|language = ${languageSegment}
}}

==Lyrics==
${lyricsSegment}

${extLinksSegment}${categories!.map((cat) => `[[Category:${cat}]]`).join("\n")}`.trim();
}