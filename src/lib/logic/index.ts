import type { BaseModel } from "../models/base";

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
export function formSubmitHandler<T extends BaseModel>({
  fetchLatestSnapshot,
  generate,
  displayWarningsAndErrors,
}: {
  /**
   * A callback function that will be called to get the last snapshot of
   * `ignoreErrors` and `formData`
   */
  fetchLatestSnapshot: () => [boolean, T];
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
  const _onFormSubmit = (e: Event) => {
    e.preventDefault();

    const [ignoreErrors, formData] = fetchLatestSnapshot();

    if (DEBUG) {
      console.log("ON SUBMIT FORM", ignoreErrors);
      console.table(formData);
    }

    formData.preprocess();
    const { errors, autoloadCategories, fatal } = formData.validate();

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
  };
  return _onFormSubmit;
}

/**
 * Utility function for resetting all state on a form.
 *
 * @param warnings
 */
export function formResetHandler(resetWarnings: () => void) {
  const _onFormReset = (e: Event) => {
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
  };
  return _onFormReset;
}
