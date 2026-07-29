import {
  songValidationErrors,
  albumValidationErrors,
  producerValidationErrors,
} from "./validationErrors";
import {
  SongPageValidationErrorType,
  AlbumPageValidationErrorType,
  ProducerPageValidationErrorType,
} from "./enums";

export interface ValidationError<E> {
  fatal?: boolean;
  autoloadCategories?: boolean;
  fields: string[];
  i18nKey: string;
  type?: E;
}

export interface ValidationBundledErrors<E> {
  errors: ValidationError<E>[];
  autoloadCategories: boolean;
  fatal: boolean;
}

/**
 * Prepares an event handler to be passed onto the "Generate" button that
 * is fired on a submit-form event.
 *
 * @param ignoreErrors
 * @param formData
 * @param validate
 * @param generate
 * @param displayWarningsAndErrors
 * @returns
 */
export function formSubmitHandler<T, E>({
  ignoreErrors,
  formData,
  validate,
  generate,
  displayWarningsAndErrors,
}: {
  /**
   * Set to `true` to ignore errors and generate the page. Validation will not be performed.
   */
  ignoreErrors: boolean;
  formData: T;
  /**
   * Callback function that will be called to validate the form input.
   *
   * @param formData
   * @returns
   */
  validate: (formData: T) => ValidationBundledErrors<E>;
  /**
   * Callback function that will be called to generate the page output.
   * The component manages the data that is handled by this function,
   * and how the output will be handled.
   *
   * @returns
   */
  generate: () => void;
  /**
   *
   *
   * @param errorMessageKeys
   * @param warningMessageKeys
   * @param autoloadCategories
   * @returns
   */
  displayWarningsAndErrors: (
    errorMessageKeys: string[],
    warningMessageKeys: string[],
    autoloadCategories: boolean,
  ) => void;
}): (e: Event) => void {
  function _onFormSubmit(e: Event) {
    e.preventDefault();
    const { errors, autoloadCategories, fatal } = ignoreErrors
      ? { errors: [], autoloadCategories: false, fatal: false }
      : validate(formData);
    if (!fatal) {
      generate();
      return;
    }

    const fieldsToUpdate = new Set<string>();
    const errorMessageKeys = [];
    const warningMessageKeys = [];

    for (const { fields, i18nKey, fatal = false } of errors) {
      for (const field of fields) {
        fieldsToUpdate.add(field);
      }
      if (fatal) {
        errorMessageKeys.push(i18nKey);
      } else {
        warningMessageKeys.push(i18nKey);
      }
    }

    for (const field of fieldsToUpdate) {
      document.getElementById(field)?.classList.add("input-error", "text-error");
    }
    displayWarningsAndErrors(errorMessageKeys, warningMessageKeys, autoloadCategories);
  }
  return _onFormSubmit;
}

/**
 * Utility function for resetting all state on a form.
 *
 * @param warnings
 */
export function formResetHandler(resetWarnings: () => void) {
  function _onFormReset(e: Event) {
    const form: HTMLFormElement = e.currentTarget as unknown as HTMLFormElement;

    // Clear elements with error styling
    const clearCssClass = (cssSelector: string) => {
      const nodes = form.querySelectorAll(`.${cssSelector}`);
      for (const n of nodes) {
        n.classList.remove(cssSelector);
      }
    };
    clearCssClass("text-error");
    clearCssClass("input-error");

    resetWarnings();
  }
  return _onFormReset;
}

export function getErrorForSongValidation(
  val: SongPageValidationErrorType,
): ValidationError<SongPageValidationErrorType> {
  return { ...songValidationErrors[val], type: val };
}

export function getErrorForAlbumValidation(
  val: AlbumPageValidationErrorType,
): ValidationError<AlbumPageValidationErrorType> {
  return { ...albumValidationErrors[val], type: val };
}

export function getErrorForProducerValidation(
  val: ProducerPageValidationErrorType,
): ValidationError<ProducerPageValidationErrorType> {
  return { ...producerValidationErrors[val], type: val };
}