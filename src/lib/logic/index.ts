import type { BaseModel } from "../models/base";
import { type ValidationBundledErrors } from "../validationErrors/types";

/**
 * Prepares an event handler to be passed onto the "Generate" button that
 * is fired on a submit-form event.
 *
 * @param resetWarnings
 * @param fetchLastSnapshot
 * @param validate
 * @param generate
 * @param displayWarningsAndErrors
 * @returns
 */
export function formSubmitHandler<T extends BaseModel<any>, E>({
  resetWarnings,
  fetchLatestSnapshot,
  validate,
  generate,
  displayWarningsAndErrors,
}: {
  /**
   * A callback function that will be called to reset the last form warnings.
   */
  resetWarnings: () => void;
  /**
   * A callback function that will be called to get the last snapshot of
   * `ignoreErrors` and `formData`.
   */
  fetchLatestSnapshot: () => [boolean, T];

  /**
   * A callback function that will be called to validate the given data,
   * and possibly block page generation if relevant options are set.
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
    errorMessageKeys: [string, string[] | null][],
    warningMessageKeys: [string, string[] | null][],
    autoloadCategories: boolean,
  ) => void;
}): (e: Event) => void {
  const _onFormSubmit = (e: Event) => {
    e.preventDefault();

    resetWarnings();

    const [ignoreErrors, formData] = fetchLatestSnapshot();

    if (DEBUG) {
      console.log("ON SUBMIT FORM", ignoreErrors);
      console.table(formData);
    }

    formData.preprocess();
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
    const errorMessageKeys: [string, string[] | null][] = [];
    const warningMessageKeys: [string, string[] | null][] = [];

    for (const { fields, i18nKey, i18nParams = null, fatal = false } of errors) {
      for (const field of fields) {
        fieldsToUpdate.add(field);
      }
      if (fatal) {
        errorMessageKeys.push([i18nKey, i18nParams]);
      } else {
        warningMessageKeys.push([i18nKey, i18nParams]);
      }
    }

    for (const field of fieldsToUpdate) {
      document.getElementById(field)?.classList.add("input-error", "text-error");
    }
    displayWarningsAndErrors(errorMessageKeys, warningMessageKeys, autoloadCategories);
  };
  return _onFormSubmit;
}

/**
 * Utility function for resetting the warnings on a form, but not the data
 *
 * @param form
 */
export function resetFormWarnings(form: HTMLFormElement) {
  const clearCssClass = (cssSelector: string) => {
    const nodes = form.querySelectorAll(`.${cssSelector}`);
    for (const n of nodes) {
      n.classList.remove(cssSelector);
    }
  };
  clearCssClass("text-error");
  clearCssClass("input-error");
}