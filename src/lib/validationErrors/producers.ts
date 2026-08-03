import { ProducerPageValidationErrorType, type ValidationError } from "./types";

const validationErrors: Record<
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

export function getValidationError(
  val: ProducerPageValidationErrorType,
): ValidationError<ProducerPageValidationErrorType> {
  return { ...validationErrors[val], type: val };
}
