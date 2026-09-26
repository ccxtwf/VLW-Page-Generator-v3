import { type Locator } from "@playwright/test";

export * from "./handsontable";
export * from "./fill-handsontable";

export function getSnapshotsDir(browser: string) {
  return `__tests__/browsertests/snapshots/${browser}`;
}

/**
 * Get the texts of each list item listed in the given validation alert element
 *
 * @param locator
 * @returns
 */
export async function getValidationItems(locator: Locator) {
  const elements = await locator.locator("ul > li").all();
  const texts = await Promise.all(elements.map((el) => el.innerText()));
  return texts;
}