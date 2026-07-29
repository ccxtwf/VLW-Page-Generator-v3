import type { ProducerPageFormData } from "../../schemas/form";

import { ProducerPageValidationErrorType } from "./enums";
import { getErrorForProducerValidation } from ".";
import type { ValidationError, ValidationBundledErrors } from ".";

import { preprocessStringParams } from "../utils/utils";

export function validate(
  formData: ProducerPageFormData,
): ValidationBundledErrors<ProducerPageValidationErrorType> {
  let { prodCategory, roles, languages, description }: ProducerPageFormData =
    preprocessStringParams(formData, ["prodCategory", "description"]);

  const errors: ValidationError<ProducerPageValidationErrorType>[] = [];

  if (prodCategory === "") {
    errors.push(
      getErrorForProducerValidation(ProducerPageValidationErrorType.NO_PRODUCER_CATEGORY),
    );
  }

  if (languages.length === 0) {
    errors.push(
      getErrorForProducerValidation(ProducerPageValidationErrorType.LANGUAGE_IS_NOT_SELECTED),
    );
  }

  if (Object.values(roles).every((el) => !el)) {
    errors.push(
      getErrorForProducerValidation(ProducerPageValidationErrorType.PRODUCER_ROLE_IS_NOT_SELECTED),
    );
  }

  if (description === "") {
    errors.push(
      getErrorForProducerValidation(ProducerPageValidationErrorType.DESCRIPTION_IS_NOT_SET),
    );
  }

  /*
  if (extLinks.length === 0) {
    errors.push(getErrorForProducerValidation(ProducerPageValidationErrorType.EXTERNAL_LINK_IS_NOT_LISTED));
  } else {
    if (extLinks.every(link => !link.isOfficial)) {
      errors.push(getErrorForProducerValidation(ProducerPageValidationErrorType.EXTERNAL_LINK_IS_NOT_OFFICIAL));
    }
  }

  if (songList.length === 0) {
    errors.push(getErrorForProducerValidation(ProducerPageValidationErrorType.NO_SONG_PAGE));
  }
  */

  const fatal = errors.some(({ fatal }) => fatal);
  return { errors, autoloadCategories: false, fatal };
}