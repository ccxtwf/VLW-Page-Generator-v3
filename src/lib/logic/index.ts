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
 * @param fetchLastSnapshot
 * @param validate
 * @param generate
 * @param displayWarningsAndErrors
 * @returns
 */
export function formSubmitHandler<T, E>({
  fetchLatestSnapshot,
  validate,
  generate,
  displayWarningsAndErrors,
}: {
  /**
   * A callback function that will be called to get the last snapshot of
   * `ignoreErrors` and `formData`
   */
  fetchLatestSnapshot: () => [boolean, T];
  /**
   * Callback function that will be called to preprocess and to validate the
   * form input.
   *
   * When `skip` is set to `true`, no validation is done (only preprocessing)
   *
   * @param formData
   * @returns
   */
  validate: (formData: T) => ValidationBundledErrors<E>;
  /**
   * Callback function that will be called to generate the page output.
   * The component manages how this output will be handled.
   *
   * @returns
   */
  generate: (processedFormData: T) => void;
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

    const [ignoreErrors, formData] = fetchLatestSnapshot();

    if (DEBUG) {
      console.log("ON SUBMIT FORM", ignoreErrors);
      console.table(formData);
    }

    const { errors, autoloadCategories, fatal } = validate(formData);

    if (DEBUG) {
      console.log("ON PREPROCESSING", formData);
      console.log("ON VALIDATION", { errors, autoloadCategories, fatal });
      console.table(formData);
    }

    if (!fatal || ignoreErrors) {
      generate(formData);
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