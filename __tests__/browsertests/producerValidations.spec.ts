import { test, expect, type Page } from "@playwright/test";
import {
  getValidationItems,
  fillExternalLinksTableForProducerPage,
  getHandsontableInstance,
} from "./utils";

test.describe("Producer page generator tests", async () => {
  test.beforeEach(async ({ page }) => {
    const response = await page.goto("/#/producers");
    expect(response?.ok()).toBe(true);
    await page.waitForLoadState("networkidle");
  });

  function getFormLocator(page: Page) {
    return page.locator('form[name="producer-generator"]');
  }

  test("should output validation warnings when on empty state", async ({ page }) => {
    const form = getFormLocator(page);

    /* Click Generate Button */
    await form.getByRole("button", { name: "Generate" }).click();

    const fatalErrorsAlert = page.locator("#validation-errors");
    const warningsAlert = page.locator("#validation-warnings");
    const pageOutput = page.locator("#page-output");

    await expect(fatalErrorsAlert).toBeVisible();
    await expect(warningsAlert).not.toBeVisible();

    const fatalErrors = await getValidationItems(fatalErrorsAlert);

    const expectedFatalErrors = [
      "You must add the producer category page name for the producer. (This will be used as the parameter of {{ProdLinks}})",
      "You haven't chosen a language.",
      "You must specify at least one role for the producer, e.g. Do they compose their own songs? Are they an illustrator/PV maker for other producers?",
      'You must add a description for the producer. Even a short description, e.g. "[PRODUCER] is a VOCALOID producer.", will do.',
      "You must add at least one external link.",
      "No song page has been added.",
    ];
    for (const fe of expectedFatalErrors) {
      expect(fatalErrors).toContain(fe);
    }

    await expect(pageOutput).toHaveValue("");
  });

  test("should output validation warnings when no official external link is provided", async ({
    page,
  }) => {
    const form = getFormLocator(page);

    /* Fill ext links table */
    const externalLinksTable = getHandsontableInstance(form, "external-links");
    const data = [
      {
        i: {
          url: "https://vocadb.net/Ar/28",
          isOfficial: false,
          isMedia: false,
        },
        o: {
          desc: "VocaDB",
          url: /^https:\/\/vocadb\.net\/Ar\/28$/,
        },
      },
    ];
    await fillExternalLinksTableForProducerPage(externalLinksTable, data);

    /* Click Generate Button */
    await form.getByRole("button", { name: "Generate" }).click();

    const fatalErrorsAlert = page.locator("#validation-errors");
    const warningsAlert = page.locator("#validation-warnings");
    const pageOutput = page.locator("#page-output");

    await expect(fatalErrorsAlert).toBeVisible();
    await expect(warningsAlert).not.toBeVisible();

    let fatalErrors = await getValidationItems(fatalErrorsAlert);

    const errorMessage1 = "You must add at least one external link.";
    const errorMessage2 =
      "You must add at least one official external link, e.g. the producer's social media.";
    expect(fatalErrors).not.toContain(errorMessage1);
    expect(fatalErrors).toContain(errorMessage2);

    await expect(pageOutput).toHaveValue("");

    /* Add official external link */
    data.push({
      i: {
        url: "https://www.nicovideo.jp/mylist/11284855",
        isOfficial: true,
        isMedia: true,
      },
      o: {
        desc: "Niconico",
        url: /^https:\/\/www\.nicovideo\.jp\/mylist\/11284855$/,
      },
    });
    await fillExternalLinksTableForProducerPage(externalLinksTable, data);

    /* Click Generate Button */
    await form.getByRole("button", { name: "Generate" }).click();

    await expect(fatalErrorsAlert).toBeVisible();
    await expect(warningsAlert).not.toBeVisible();

    fatalErrors = await getValidationItems(fatalErrorsAlert);

    expect(fatalErrors).not.toContain(errorMessage1);
    expect(fatalErrors).not.toContain(errorMessage2);
  });
});