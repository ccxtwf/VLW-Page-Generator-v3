import type { BaseModel, PreprocessorMixin } from "./base";
import type { IImageEmbed, IProducer } from "./schema";
import ProducerDiscographySongItem from "./children/ProducerDiscographySongItem.svelte";
import ProducerDiscographyAlbumItem from "./children/ProducerDiscographyAlbumItem.svelte";
import ExternalLinkForProducerPage from "./children/ExternalLinkForProducerPage.svelte";

import { getValidationError } from "../validationErrors/producers";
import {
  ProducerPageValidationErrorType,
  type ValidationBundledErrors,
  type ValidationError,
} from "../validationErrors/types";

import { preprocessStringParams } from "../utils/utils";
import type { MultiSelectItem } from "../../schemas/form";

export interface ProducerRoles {
  composer: boolean;
  lyricist: boolean;
  tuner: boolean;
  illustrator: boolean;
  animator: boolean;
  arranger: boolean;
  instrumentalist: boolean;
  mixer: boolean;
  masterer: boolean;
}

export default class Producer implements BaseModel<IProducer> {
  prodCategory: string = $state("");
  splitAlbum: boolean = $state(false);
  prodAliases: string = $state("");
  affiliations: string = $state("");
  labels: string = $state("");
  languages: MultiSelectItem[] = $state([]);
  engines: MultiSelectItem[] = $state([]);
  description: string = $state("");
  roles: ProducerRoles = $state({
    composer: false,
    lyricist: false,
    tuner: false,
    illustrator: false,
    animator: false,
    arranger: false,
    instrumentalist: false,
    mixer: false,
    masterer: false,
  });

  image: IImageEmbed | null = $state(null);

  songs: ProducerDiscographySongItem[] = $state([]);
  albums: ProducerDiscographyAlbumItem[] = $state([]);
  extLinks: ExternalLinkForProducerPage[] = $state([]);

  constructor(data: Partial<IProducer> = {}) {
    this.resetHotTables();
    Object.assign(this, data);
  }

  updateState(data: Partial<IProducer>): void {
    Object.assign(this, data);
  }

  resetHotTables(): void {
    this.songs = Array(5)
      .fill(null)
      .map(() => new ProducerDiscographySongItem());
    this.albums = Array(5)
      .fill(null)
      .map(() => new ProducerDiscographyAlbumItem());
    this.extLinks = Array(5)
      .fill(null)
      .map(() => new ExternalLinkForProducerPage());
  }

  preprocess(): void {
    preprocessStringParams(this, [
      "prodCategory",
      "prodAliases",
      "affiliations",
      "labels",
      "description",
    ]);
    this.splitAlbum = this.splitAlbum || false;
    this.languages = this.languages || [];
    this.engines = this.engines || [];
    const {
      composer = false,
      lyricist = false,
      tuner = false,
      illustrator = false,
      animator = false,
      arranger = false,
      instrumentalist = false,
      mixer = false,
      masterer = false,
    } = this.roles || {};
    this.roles = {
      composer,
      lyricist,
      tuner,
      illustrator,
      animator,
      arranger,
      instrumentalist,
      mixer,
      masterer,
    };
    this.songs = this.songs || [];
    this.albums = this.albums || [];
    this.extLinks = this.extLinks || [];

    for (const a of [this.songs, this.albums, this.extLinks] as PreprocessorMixin[][]) {
      a.forEach((e) => e.preprocess());
    }
  }

  validate(): ValidationBundledErrors<ProducerPageValidationErrorType> {
    let { prodCategory, roles, languages, description, extLinks, songs } = this;

    const errors: ValidationError<ProducerPageValidationErrorType>[] = [];

    if (prodCategory === "") {
      errors.push(getValidationError(ProducerPageValidationErrorType.NO_PRODUCER_CATEGORY));
    }

    if (languages.length === 0) {
      errors.push(getValidationError(ProducerPageValidationErrorType.LANGUAGE_IS_NOT_SELECTED));
    }

    if (Object.values(roles).every((el) => !el)) {
      errors.push(
        getValidationError(ProducerPageValidationErrorType.PRODUCER_ROLE_IS_NOT_SELECTED),
      );
    }

    if (description === "") {
      errors.push(getValidationError(ProducerPageValidationErrorType.DESCRIPTION_IS_NOT_SET));
    }

    if (extLinks.length === 0) {
      errors.push(getValidationError(ProducerPageValidationErrorType.EXTERNAL_LINK_IS_NOT_LISTED));
    } else {
      if (extLinks.every((link) => !link.isOfficial)) {
        errors.push(
          getValidationError(ProducerPageValidationErrorType.EXTERNAL_LINK_IS_NOT_OFFICIAL),
        );
      }
    }

    if (songs.length === 0) {
      errors.push(getValidationError(ProducerPageValidationErrorType.NO_SONG_PAGE));
    }

    const fatal = errors.some(({ fatal }) => fatal);
    return { errors, autoloadCategories: false, fatal };
  }
}
