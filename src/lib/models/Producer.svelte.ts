import type { BaseModel } from "./base";
import ProducerDiscographySongItem from "./children/ProducerDiscographySongItem";
import ProducerDiscographyAlbumItem from "./children/ProducerDiscographyAlbumItem";
import ExternalLinkForProducerPage from "./children/ExternalLinkForProducerPage";

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

export default class Producer implements BaseModel {
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
  songs: ProducerDiscographySongItem[] = $state(
    Array(5).fill(ProducerDiscographySongItem.createDefault()),
  );
  albums: ProducerDiscographyAlbumItem[] = $state(
    Array(5).fill(ProducerDiscographyAlbumItem.createDefault()),
  );
  extLinks: ExternalLinkForProducerPage[] = $state(
    Array(5).fill(ExternalLinkForProducerPage.createDefault()),
  );

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
    this.songs.forEach((m) => m.preprocess());
    this.albums.forEach((m) => m.preprocess());
    this.extLinks.forEach((m) => m.preprocess());
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
