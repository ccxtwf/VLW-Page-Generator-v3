import { test, expect, type Page } from "@playwright/test";
import {
  getValidationItems,
  fillBroadcastLinksTable,
  fillLyricsTable,
  getHandsontableInstance,
} from "./utils";

test.describe("Song page generator tests", async () => {
  test.beforeEach(async ({ page }) => {
    const response = await page.goto("/#/songs");
    expect(response?.ok()).toBe(true);
    await page.waitForLoadState("networkidle");
  });

  function getFormLocator(page: Page) {
    return page.locator('form[name="song-generator"]');
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
      "You haven't chosen a language.",
      "You haven't entered a song title.",
      "You haven't entered the date of publication.",
      "You haven't listed any singers.",
      "You need to list at least one singer in markup, e.g. [[Hatsune Miku (VOCALOID)]].",
      "You haven't listed any producers. For well-known producers, it is recommended that the producer's name is listed in markup, e.g. [[wowaka]], before you generate the song page.",
      'No music videos or play links are detected. Please check the "Song is publically unavailable" if official releases are no longer available, or check the "Song is an album-only release" option if the song is released on albums only.',
      "Original lyrics column is empty.",
      "Romanized/transliterated lyrics column is empty.",
    ];
    for (const fe of expectedFatalErrors) {
      expect(fatalErrors).toContain(fe);
    }

    await expect(pageOutput).toHaveValue("");
  });

  test("should output validation warnings when a questionable CW is set without justification", async ({
    page,
  }) => {
    const form = getFormLocator(page);

    /* Content Warnings */
    await form.getByLabel("Content Warnings").selectOption("1");

    /* Click Generate Button */
    await form.getByRole("button", { name: "Generate" }).click();

    const fatalErrorsAlert = page.locator("#validation-errors");
    const pageOutput = page.locator("#page-output");

    await expect(fatalErrorsAlert).toBeVisible();

    const fatalErrors = await getValidationItems(fatalErrorsAlert);

    const errorMessage =
      "You must add a reason for wanting to add a content warning onto the page, e.g. violent content, sexual content, etc.";
    expect(fatalErrors).toContain(errorMessage);

    await expect(pageOutput).toHaveValue("");

    /* Add justification */
    await form.getByRole("textbox", { name: "violent/mature content" }).click();
    await form.getByRole("textbox", { name: "violent/mature content" }).fill("suicidal themes");

    /* Click Generate Button */
    await form.getByRole("button", { name: "Generate" }).click();

    const refreshedFatalErrors = await getValidationItems(fatalErrorsAlert);
    expect(refreshedFatalErrors).not.toContain(errorMessage);
  });

  test("should output validation warnings when invalid infobox colours are set", async ({
    page,
  }) => {
    const form = getFormLocator(page);

    /* Colours */
    await page.locator("#infobox-bg-color").fill("");
    await page.locator("#infobox-fg-color").fill("");

    /* Click Generate Button */
    await form.getByRole("button", { name: "Generate" }).click();

    const fatalErrorsAlert = page.locator("#validation-errors");
    const pageOutput = page.locator("#page-output");

    await expect(fatalErrorsAlert).toBeVisible();

    let fatalErrors = await getValidationItems(fatalErrorsAlert);

    const errorMessage1 = "Please add a background color.";
    const errorMessage2 = "Please add a foreground color.";
    const errorMessage3 = "The background color is invalid.";
    const errorMessage4 = "The foreground color is invalid.";
    expect(fatalErrors).toContain(errorMessage1);
    expect(fatalErrors).toContain(errorMessage2);
    expect(fatalErrors).not.toContain(errorMessage3);
    expect(fatalErrors).not.toContain(errorMessage4);

    await expect(pageOutput).toHaveValue("");

    /* Set invalid colours */
    await page.locator("#infobox-bg-color").fill("ccde12cdn");
    await page.locator("#infobox-fg-color").fill("12egzbbcx");

    /* Click Generate Button */
    await form.getByRole("button", { name: "Generate" }).click();

    fatalErrors = await getValidationItems(fatalErrorsAlert);
    expect(fatalErrors).not.toContain(errorMessage1);
    expect(fatalErrors).not.toContain(errorMessage2);
    expect(fatalErrors).toContain(errorMessage3);
    expect(fatalErrors).toContain(errorMessage4);

    /* Set valid colours */
    await page.locator("#infobox-bg-color").fill("black");
    await page.locator("#infobox-fg-color").fill("#cccccc");

    /* Click Generate Button */
    await form.getByRole("button", { name: "Generate" }).click();

    fatalErrors = await getValidationItems(fatalErrorsAlert);
    expect(fatalErrors).not.toContain(errorMessage1);
    expect(fatalErrors).not.toContain(errorMessage2);
    expect(fatalErrors).not.toContain(errorMessage3);
    expect(fatalErrors).not.toContain(errorMessage4);
  });

  test("should output validation warnings when a link is added without view count", async ({
    page,
  }) => {
    const form = getFormLocator(page);

    /* Broadcast links */

    const broadcastLinksTable = getHandsontableInstance(form, "broadcast-links");
    const data = [
      {
        i: {
          url: "https://youtu.be/12345678901",
          viewCount: "",
        },
        o: {
          site: /YouTube/,
          url: /^https:\/\/www\.youtube\.com\/watch\?v=12345678901$/,
        },
      },
    ];
    await fillBroadcastLinksTable(broadcastLinksTable, data);

    /* Click Generate Button */
    await form.getByRole("button", { name: "Generate" }).click();

    const warningsAlert = page.locator("#validation-warnings");

    await expect(warningsAlert).toBeVisible();

    const warnings = await getValidationItems(warningsAlert);

    const errorMessage = "Did you forget to add the view counts?";
    expect(warnings).toContain(errorMessage);

    /* Add view count */
    data[0].i.viewCount = "5,000+";
    await fillBroadcastLinksTable(broadcastLinksTable, data);

    /* Click Generate Button */
    await form.getByRole("button", { name: "Generate" }).click();

    const refreshedFatalErrors = await getValidationItems(warningsAlert);
    expect(refreshedFatalErrors).not.toContain(errorMessage);
  });

  test("should output validation warnings when lyrics are not set", async ({ page }) => {
    const form = getFormLocator(page);

    /* Language & ISO Code */
    await form.getByRole("combobox", { name: "Song Language" }).click();
    await form.getByRole("option", { name: "Japanese" }).click();
    await page.keyboard.press("Escape");
    await form.getByRole("textbox", { name: "Language ISO Code" }).click();
    await form.getByRole("textbox", { name: "Language ISO Code" }).fill("ja");

    /* Lyrics */
    const lyricsTable = getHandsontableInstance(form, "lyrics");
    const data = [{ original: "", romanized: "", english: "" }];
    await fillLyricsTable(lyricsTable, data);

    /* Click Generate Button */
    await form.getByRole("button", { name: "Generate" }).click();

    const fatalErrorsAlert = page.locator("#validation-errors");
    const warningsAlert = page.locator("#validation-warnings");
    const pageOutput = page.locator("#page-output");

    await expect(fatalErrorsAlert).toBeVisible();

    let fatalErrors = await getValidationItems(fatalErrorsAlert);
    let warnings = await getValidationItems(warningsAlert);

    const errorMessage1 = "Original lyrics column is empty.";
    const errorMessage2 = "Romanized/transliterated lyrics column is empty.";
    const errorMessage3 =
      "A translation exists, but the translator is uncredited. Is it made by an anonymous contributor?";
    expect(fatalErrors).toContain(errorMessage1);
    expect(fatalErrors).toContain(errorMessage2);
    expect(warnings).not.toContain(errorMessage3);

    await expect(pageOutput).toHaveValue("");

    /* Add original line */
    data[0].original = "あいうえお";
    await fillLyricsTable(lyricsTable, data);

    /* Click Generate Button */
    await form.getByRole("button", { name: "Generate" }).click();

    await expect(fatalErrorsAlert).toBeVisible();

    fatalErrors = await getValidationItems(fatalErrorsAlert);
    warnings = await getValidationItems(warningsAlert);

    expect(fatalErrors).not.toContain(errorMessage1);
    expect(fatalErrors).toContain(errorMessage2);
    expect(warnings).not.toContain(errorMessage3);

    await expect(pageOutput).toHaveValue("");

    /* Add romanized line */
    data[0].romanized = "aiueo";
    await fillLyricsTable(lyricsTable, data);

    /* Click Generate Button */
    await form.getByRole("button", { name: "Generate" }).click();

    await expect(fatalErrorsAlert).toBeVisible();

    fatalErrors = await getValidationItems(fatalErrorsAlert);
    warnings = await getValidationItems(warningsAlert);

    expect(fatalErrors).not.toContain(errorMessage1);
    expect(fatalErrors).not.toContain(errorMessage2);
    expect(warnings).not.toContain(errorMessage3);

    /* Add English line */
    data[0].english = "ABCD";
    await fillLyricsTable(lyricsTable, data);

    /* Click Generate Button */
    await form.getByRole("button", { name: "Generate" }).click();

    await expect(fatalErrorsAlert).toBeVisible();
    await expect(warningsAlert).toBeVisible();

    fatalErrors = await getValidationItems(fatalErrorsAlert);
    warnings = await getValidationItems(warningsAlert);

    expect(fatalErrors).not.toContain(errorMessage1);
    expect(fatalErrors).not.toContain(errorMessage2);
    expect(warnings).toContain(errorMessage3);

    /* Add translator */
    await form.getByRole("textbox", { name: "Translator" }).click();
    await form.getByRole("textbox", { name: "Translator" }).fill("John Doe");

    /* Click Generate Button */
    await form.getByRole("button", { name: "Generate" }).click();

    await expect(fatalErrorsAlert).toBeVisible();
    await expect(warningsAlert).not.toBeVisible();

    fatalErrors = await getValidationItems(fatalErrorsAlert);

    expect(fatalErrors).not.toContain(errorMessage1);
    expect(fatalErrors).not.toContain(errorMessage2);
  });
});