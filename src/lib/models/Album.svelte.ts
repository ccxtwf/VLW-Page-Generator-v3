import type { BaseModel, PreprocessorMixin } from "./base";
import type { IAlbum, IImageEmbed } from "./schema";
import AlbumBroadcastLink from "./children/AlbumBroadcastLink.svelte";
import AlbumTrackData from "./children/AlbumTrackData.svelte";
import ExternalLink from "./children/ExternalLink.svelte";

import { getValidationError } from "../validationErrors/albums";
import {
  AlbumPageValidationErrorType,
  type ValidationBundledErrors,
  type ValidationError,
} from "../validationErrors/types";

import { preprocessStringParams, validateColour } from "../utils/utils";
import type { MultiSelectItem } from "../../schemas/form";
import { ALBUM_STREAMING_LINKS } from "../../constants";

export default class Album implements BaseModel<IAlbum> {
  origTitle: string = $state("");
  romTitle: string = $state("");
  engTitle: string = $state("");
  bgColour: string = $state("black");
  fgColour: string = $state("white");
  label: string = $state("");
  description: string = $state("");
  isCompilationAlbum: boolean = $state(false);
  publishedYear: string = $state("");
  publishedMonth: string = $state("");
  publishedDay: string = $state("");
  engines: MultiSelectItem[] = $state([]);
  vdbAlbumId: string = $state("");
  vocaWikiPage: string = $state("");
  categoriesRaw: string = $state("");

  image: IImageEmbed | null = $state(null);

  tracklist: AlbumTrackData[] = $state([]);
  broadcastLinks: AlbumBroadcastLink[] = $state([]);
  extLinks: ExternalLink[] = $state([]);

  categories: string[] = [];

  constructor(data: Partial<IAlbum> = {}) {
    this.resetHotTables();
    Object.assign(this, data);
  }

  updateState(data: Partial<IAlbum>): void {
    Object.assign(this, data);
  }

  resetHotTables(): void {
    this.tracklist = Array(12)
      .fill(null)
      .map(() => new AlbumTrackData());
    this.broadcastLinks = ALBUM_STREAMING_LINKS.map(
      ({ name }, idx) => new AlbumBroadcastLink({ idx, site: name }),
    );
    this.extLinks = Array(5)
      .fill(null)
      .map(() => new ExternalLink());
  }

  preprocess(): void {
    preprocessStringParams(this, [
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
    this.engines = this.engines || [];
    this.tracklist = this.tracklist || [];
    this.broadcastLinks = this.broadcastLinks || [];
    this.extLinks = this.extLinks || [];

    this.categories = this.categoriesRaw === "" ? [] : this.categoriesRaw.split("\n");

    for (const a of [this.tracklist, this.broadcastLinks, this.extLinks] as PreprocessorMixin[][]) {
      a.forEach((e) => e.preprocess());
    }
  }

  validate(): ValidationBundledErrors<AlbumPageValidationErrorType> {
    const {
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
      tracklist,
      broadcastLinks,
    } = this;

    const errors: ValidationError<AlbumPageValidationErrorType>[] = [];

    if (origTitle === "") {
      errors.push(getValidationError(AlbumPageValidationErrorType.ALBUM_TITLE_IS_NOT_SET));
    }

    if (bgColour === "") {
      errors.push(getValidationError(AlbumPageValidationErrorType.BG_COLOR_IS_EMPTY));
    }
    if (fgColour === "") {
      errors.push(getValidationError(AlbumPageValidationErrorType.FG_COLOR_IS_EMPTY));
    }
    if (!validateColour(bgColour)) {
      errors.push(getValidationError(AlbumPageValidationErrorType.BG_COLOR_IS_INVALID));
    }
    if (!validateColour(fgColour)) {
      errors.push(getValidationError(AlbumPageValidationErrorType.FG_COLOR_IS_INVALID));
    }

    if (description === "") {
      errors.push(getValidationError(AlbumPageValidationErrorType.DESCRIPTION_IS_NOT_SET));
    }

    if (publishedYear === "" && publishedMonth === "" && publishedDay === "") {
      errors.push(getValidationError(AlbumPageValidationErrorType.PUB_DATE_IS_NOT_SET));
    } else if (publishedYear === "") {
      errors.push(getValidationError(AlbumPageValidationErrorType.PUB_YEAR_IS_NOT_SET));
    } else if (publishedMonth === "" && publishedDay !== "") {
      errors.push(getValidationError(AlbumPageValidationErrorType.PUB_MONTH_IS_NOT_SET));
    }
    if (publishedYear !== "" && publishedYear.length !== 4) {
      errors.push(getValidationError(AlbumPageValidationErrorType.PUB_YEAR_IS_INVALID));
    }

    if (vdbAlbumId === "") {
      errors.push(getValidationError(AlbumPageValidationErrorType.NO_VOCADB_LINK));
    }

    if (tracklist.every((track) => track.pageTitle === "")) {
      errors.push(getValidationError(AlbumPageValidationErrorType.NO_TRACK_IS_LISTED));
    } else {
      const tracklistValidationErrors = Array.from(
        new Set(tracklist.flatMap((t) => t.validate())).keys(),
      ).sort();
      for (const c of tracklistValidationErrors) {
        errors.push(getValidationError(c));
      }
    }

    if (broadcastLinks.length === 0) {
      errors.push(getValidationError(AlbumPageValidationErrorType.OFFICIAL_LINK_IS_NOT_LISTED));
    } else {
      const invalidIds = broadcastLinks.filter(({ __computed: { isValid } }) => !isValid);
      if (invalidIds.length > 0) {
        errors.push({
          fatal: true,
          fields: invalidIds.map(({ __computed: { paramKey } }) => paramKey!),
          i18nKey: `validation.album.invalidEmbedCode`,
          i18nParams: [invalidIds.map(({ site }) => site).join(", ")],
          type: AlbumPageValidationErrorType.INVALID_EMBED_CODE,
        });
      }
    }

    if (engines.length === 0) {
      errors.push(getValidationError(AlbumPageValidationErrorType.SYNTH_ENGINE_IS_NOT_LISTED));
    }

    if (categories?.length === 0) {
      errors.push(getValidationError(AlbumPageValidationErrorType.NO_CATEGORIES));
    }

    const autoloadCategories = errors.some(({ autoloadCategories }) => autoloadCategories);
    const fatal = errors.some(({ fatal }) => fatal);
    return { errors, autoloadCategories, fatal };
  }
}