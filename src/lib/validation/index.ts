import type { SvelteComponent } from "svelte";
import { validate } from "./songs";
import type { ValidationBundledErrors } from "./validationErrors";

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
export function formSubmitHandler<T>({
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
  validate: (formData: T) => ValidationBundledErrors;
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
   * @param autoloadCategories
   * @returns
   */
  displayWarningsAndErrors: (errorMessageKeys: string[], autoloadCategories: boolean) => void;
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
    const fieldsToUpdate = errors.reduce((set: Set<string>, { fields }) => {
      for (const field of fields) {
        set.add(field);
      }
      return set;
    }, new Set<string>());
    const errorMessageKeys = errors.reduce((arr: string[], { i18nKey }) => {
      arr.push(i18nKey);
      return arr;
    }, []);

    for (const field of fieldsToUpdate) {
      document.getElementById(field)?.classList.add("input-error", "text-error");
    }
    displayWarningsAndErrors(errorMessageKeys, autoloadCategories);
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

export default {
  songs: { validate },
};