import { test, expect, type Page } from "@playwright/test";
import { getValidationItems, fillTracklistTable, getHandsontableInstance } from "./utils";

test.describe("Album page generator tests", async () => {
  test.beforeEach(async ({ page }) => {
    const response = await page.goto("/#/albums");
    expect(response?.ok()).toBe(true);
    await page.waitForLoadState("networkidle");
  });

  function getFormLocator(page: Page) {
    return page.locator('form[name="album-generator"]');
  }

  test("should output validation warnings when on empty state", async ({ page }) => {
    const form = getFormLocator(page);

    /* Click Generate Button */
    await form.getByRole("button", { name: "Generate" }).click();

    const fatalErrorsAlert = page.locator("#validation-errors");
    const warningsAlert = page.locator("#validation-warnings");
    const pageOutput = page.locator("#page-output");

    await expect(fatalErrorsAlert).toBeVisible();
    await expect(warningsAlert).toBeVisible();

    const fatalErrors = await getValidationItems(fatalErrorsAlert);
    const warnings = await getValidationItems(warningsAlert);

    const expectedFatalErrors = [
      "You haven't entered an album name.",
      "You must add a short description about the album.",
      "You must add an album publication date.",
      "You must add at least one song to the tracklist.",
      'Please list at least one vocal synth engine, e.g. VOCALOID. Choose "Other/Unlisted" if not on the list.',
      "Did you forget to add categories?",
    ];
    for (const fe of expectedFatalErrors) {
      expect(fatalErrors).toContain(fe);
    }
    const expectedWarnings = [
      "It is recommended to add a link to the VocaDB album page if it exists.",
      "You should add at least one album crossfade or streaming (Spotify, YouTube Music, Bandcamp) link.",
    ];
    for (const w of expectedWarnings) {
      expect(warnings).toContain(w);
    }

    await expect(pageOutput).toHaveValue("");
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

  test("should output validation warnings when invalid publication dates are set", async ({
    page,
  }) => {
    const form = getFormLocator(page);

    /* Assertions */
    await expect(form.getByPlaceholder("year")).toHaveValue("");
    await expect(form.locator("#published-month")).toHaveValue("");
    await expect(form.getByPlaceholder("day")).toHaveValue("");

    let fatalErrors: string[];
    const emptyStateErrorMessage = "You must add an album publication date.";
    const errorMessage1 = "Publication year is invalid.";
    const errorMessage2 = "You must specify the album publication year.";
    const errorMessage3 = "You must specify the album publication month.";

    const fatalErrorsAlert = page.locator("#validation-errors");
    const pageOutput = page.locator("#page-output");

    /* Empty state */
    {
      /* Click Generate Button */
      await form.getByRole("button", { name: "Generate" }).click();

      await expect(fatalErrorsAlert).toBeVisible();

      fatalErrors = await getValidationItems(fatalErrorsAlert);

      expect(fatalErrors).toContain(emptyStateErrorMessage);
      expect(fatalErrors).not.toContain(errorMessage1);
      expect(fatalErrors).not.toContain(errorMessage2);
      expect(fatalErrors).not.toContain(errorMessage3);
    }

    /* Invalid publication year */
    {
      /* Add invalid publication year */
      await form.getByPlaceholder("year").click();
      await form.getByPlaceholder("year").fill("201");

      await expect(pageOutput).toHaveValue("");

      /* Click Generate Button */
      await form.getByRole("button", { name: "Generate" }).click();

      await expect(fatalErrorsAlert).toBeVisible();

      fatalErrors = await getValidationItems(fatalErrorsAlert);

      expect(fatalErrors).not.toContain(emptyStateErrorMessage);
      expect(fatalErrors).toContain(errorMessage1);
      expect(fatalErrors).not.toContain(errorMessage2);
      expect(fatalErrors).not.toContain(errorMessage3);
    }

    /* Invalid publication day */
    {
      /* Set valid publication year */
      await form.getByPlaceholder("year").click();
      await form.getByPlaceholder("year").fill("2013");

      /* Add publication day but not month */
      await form.getByPlaceholder("day").click();
      await form.getByPlaceholder("day").fill("25");

      /* Click Generate Button */
      await form.getByRole("button", { name: "Generate" }).click();

      await expect(fatalErrorsAlert).toBeVisible();

      fatalErrors = await getValidationItems(fatalErrorsAlert);

      expect(fatalErrors).not.toContain(emptyStateErrorMessage);
      expect(fatalErrors).not.toContain(errorMessage1);
      expect(fatalErrors).not.toContain(errorMessage2);
      expect(fatalErrors).toContain(errorMessage3);

      await expect(pageOutput).toHaveValue("");
    }

    /* Valid date */
    {
      await form.getByPlaceholder("year").click();
      await form.getByPlaceholder("year").fill("2010");
      await form.locator("#published-month").selectOption("May");
      await form.getByPlaceholder("day").click();
      await form.getByPlaceholder("day").fill("25");

      /* Click Generate Button */
      await form.getByRole("button", { name: "Generate" }).click();

      await expect(fatalErrorsAlert).toBeVisible();

      fatalErrors = await getValidationItems(fatalErrorsAlert);

      expect(fatalErrors).not.toContain(emptyStateErrorMessage);
      expect(fatalErrors).not.toContain(errorMessage1);
      expect(fatalErrors).not.toContain(errorMessage2);
      expect(fatalErrors).not.toContain(errorMessage3);
    }
  });

  test("should output validation warnings when invalid tracklist data is set", async ({ page }) => {
    const form = getFormLocator(page);

    const tracklistTable = getHandsontableInstance(form, "tracklist");

    let fatalErrors: string[];
    const emptyStateErrorMessage = "You must add at least one song to the tracklist.";
    const errorMessage1 = "You must add the track listing number to all tracks.";
    const errorMessage2 = "The disc number must be numeric.";
    const errorMessage3 = "The track number must be numeric.";
    const errorMessage4 = "You must add a track name to all tracks.";
    const errorMessage5 =
      "You must add featured producers/singers to all tracks, or specify that the song is an instrumental if there are no singers.";

    const fatalErrorsAlert = page.locator("#validation-errors");
    const pageOutput = page.locator("#page-output");

    /* Empty state */
    {
      /* Click Generate Button */
      await form.getByRole("button", { name: "Generate" }).click();

      await expect(fatalErrorsAlert).toBeVisible();

      fatalErrors = await getValidationItems(fatalErrorsAlert);

      expect(fatalErrors).toContain(emptyStateErrorMessage);
      expect(fatalErrors).not.toContain(errorMessage1);
      expect(fatalErrors).not.toContain(errorMessage2);
      expect(fatalErrors).not.toContain(errorMessage3);
      expect(fatalErrors).not.toContain(errorMessage4);
      expect(fatalErrors).not.toContain(errorMessage5);
    }

    /* No track numbering */
    {
      await fillTracklistTable(tracklistTable, [
        {
          discNo: "",
          trackNo: "",
          pageTitle: "[[Page 1]]",
          producerCredit: "",
          singerCredit: "[[Hatsune Miku (VOCALOID)]]",
        },
        {
          discNo: "",
          trackNo: "",
          pageTitle: "[[Page 2]]",
          producerCredit: "",
          singerCredit: "Hatsune Miku",
        },
      ]);

      await expect(pageOutput).toHaveValue("");

      /* Click Generate Button */
      await form.getByRole("button", { name: "Generate" }).click();

      await expect(fatalErrorsAlert).toBeVisible();

      fatalErrors = await getValidationItems(fatalErrorsAlert);

      expect(fatalErrors).not.toContain(emptyStateErrorMessage);
      expect(fatalErrors).toContain(errorMessage1);
      expect(fatalErrors).not.toContain(errorMessage2);
      expect(fatalErrors).not.toContain(errorMessage3);
      expect(fatalErrors).not.toContain(errorMessage4);
      expect(fatalErrors).not.toContain(errorMessage5);
    }

    /* Invalid disc numbering */
    {
      await fillTracklistTable(tracklistTable, [
        {
          discNo: "A",
          trackNo: "1",
          pageTitle: "[[Page 1]]",
          producerCredit: "",
          singerCredit: "[[Hatsune Miku (VOCALOID)]]",
        },
        {
          discNo: "B",
          trackNo: "1",
          pageTitle: "[[Page 2]]",
          producerCredit: "",
          singerCredit: "Hatsune Miku",
        },
      ]);

      /* Click Generate Button */
      await form.getByRole("button", { name: "Generate" }).click();

      await expect(fatalErrorsAlert).toBeVisible();

      fatalErrors = await getValidationItems(fatalErrorsAlert);

      expect(fatalErrors).not.toContain(emptyStateErrorMessage);
      expect(fatalErrors).not.toContain(errorMessage1);
      expect(fatalErrors).toContain(errorMessage2);
      expect(fatalErrors).not.toContain(errorMessage3);
      expect(fatalErrors).not.toContain(errorMessage4);
      expect(fatalErrors).not.toContain(errorMessage5);

      await expect(pageOutput).toHaveValue("");
    }

    /* Invalid disc numbering */
    {
      await fillTracklistTable(tracklistTable, [
        {
          discNo: "1",
          trackNo: "A",
          pageTitle: "[[Page 1]]",
          producerCredit: "",
          singerCredit: "[[Hatsune Miku (VOCALOID)]]",
        },
        {
          discNo: "1",
          trackNo: "B",
          pageTitle: "[[Page 2]]",
          producerCredit: "",
          singerCredit: "Hatsune Miku",
        },
      ]);

      /* Click Generate Button */
      await form.getByRole("button", { name: "Generate" }).click();

      await expect(fatalErrorsAlert).toBeVisible();

      fatalErrors = await getValidationItems(fatalErrorsAlert);

      expect(fatalErrors).not.toContain(emptyStateErrorMessage);
      expect(fatalErrors).not.toContain(errorMessage1);
      expect(fatalErrors).not.toContain(errorMessage2);
      expect(fatalErrors).toContain(errorMessage3);
      expect(fatalErrors).not.toContain(errorMessage4);
      expect(fatalErrors).not.toContain(errorMessage5);

      await expect(pageOutput).toHaveValue("");
    }

    /* No track name */
    {
      await fillTracklistTable(tracklistTable, [
        {
          discNo: "1",
          trackNo: "1",
          pageTitle: " ",
          producerCredit: "",
          singerCredit: "[[Hatsune Miku (VOCALOID)]]",
        },
        {
          discNo: "1",
          trackNo: "2",
          pageTitle: "Page 2",
          producerCredit: "",
          singerCredit: "Hatsune Miku",
        },
      ]);

      /* Click Generate Button */
      await form.getByRole("button", { name: "Generate" }).click();

      await expect(fatalErrorsAlert).toBeVisible();

      fatalErrors = await getValidationItems(fatalErrorsAlert);

      expect(fatalErrors).not.toContain(emptyStateErrorMessage);
      expect(fatalErrors).not.toContain(errorMessage1);
      expect(fatalErrors).not.toContain(errorMessage2);
      expect(fatalErrors).not.toContain(errorMessage3);
      expect(fatalErrors).toContain(errorMessage4);
      expect(fatalErrors).not.toContain(errorMessage5);

      await expect(pageOutput).toHaveValue("");
    }

    /* No featured singer */
    {
      await fillTracklistTable(tracklistTable, [
        {
          discNo: "1",
          trackNo: "1",
          pageTitle: "[[Page 1]]",
          producerCredit: "",
          singerCredit: " ",
        },
        {
          discNo: "1",
          trackNo: "2",
          pageTitle: "[[Page 2]]",
          producerCredit: "",
          singerCredit: " ",
        },
      ]);

      /* Click Generate Button */
      await form.getByRole("button", { name: "Generate" }).click();

      await expect(fatalErrorsAlert).toBeVisible();

      fatalErrors = await getValidationItems(fatalErrorsAlert);

      expect(fatalErrors).not.toContain(emptyStateErrorMessage);
      expect(fatalErrors).not.toContain(errorMessage1);
      expect(fatalErrors).not.toContain(errorMessage2);
      expect(fatalErrors).not.toContain(errorMessage3);
      expect(fatalErrors).not.toContain(errorMessage4);
      expect(fatalErrors).toContain(errorMessage5);

      await expect(pageOutput).toHaveValue("");
    }

    /* Valid state */
    {
      await fillTracklistTable(tracklistTable, [
        {
          discNo: "1",
          trackNo: "1",
          pageTitle: "[[Page 1]]",
          producerCredit: "",
          singerCredit: "[[Hatsune Miku (VOCALOID)]]",
        },
        {
          discNo: "1",
          trackNo: "2",
          pageTitle: "[[Page 2]]",
          producerCredit: "",
          singerCredit: "Hatsune Miku",
        },
      ]);

      /* Click Generate Button */
      await form.getByRole("button", { name: "Generate" }).click();

      await expect(fatalErrorsAlert).toBeVisible();

      fatalErrors = await getValidationItems(fatalErrorsAlert);

      expect(fatalErrors).not.toContain(emptyStateErrorMessage);
      expect(fatalErrors).not.toContain(errorMessage1);
      expect(fatalErrors).not.toContain(errorMessage2);
      expect(fatalErrors).not.toContain(errorMessage3);
      expect(fatalErrors).not.toContain(errorMessage4);
      expect(fatalErrors).not.toContain(errorMessage5);
    }
  });

  test("should output validation warnings when invalid album streaming links are set", async ({
    page,
  }) => {
    const form = getFormLocator(page);

    const fatalErrorsAlert = page.locator("#validation-errors");
    const pageOutput = page.locator("#page-output");

    const data = [
      {
        label: "Niconico Crossfade",
        value: "invalid-url",
      },
      {
        label: "YouTube Crossfade",
        value: "invalid-url",
      },
      {
        label: "Spotify",
        value: "invalid-url",
      },
      {
        label: "YouTube Music Playlist",
        value: "invalid-url",
      },
      {
        label: "Bandamp Embed ID",
        value: "invalid-url",
      },
      {
        label: "SoundCloud Crossfade",
        value: "invalid-url",
      },
    ];
    const getExpectedError = (moreInfo: string) => {
      return `An invalid embed URL is supplied for the following services: ${moreInfo}`;
    };
    for (const { label, value } of data) {
      await form.getByRole("textbox", { name: label }).click();
      await form.getByRole("textbox", { name: label }).fill(value);

      /* Click Generate Button */
      await form.getByRole("button", { name: "Generate" }).click();

      await expect(pageOutput).toHaveValue("");

      await expect(fatalErrorsAlert).toBeVisible();
      const fatalErrors = await getValidationItems(fatalErrorsAlert);

      expect(fatalErrors).toContain(getExpectedError(label));

      // Clear for next input
      await form.getByRole("textbox", { name: label }).clear();
    }

    /* An error with multiple services */
    {
      await form.getByRole("textbox", { name: "Niconico Crossfade" }).click();
      await form.getByRole("textbox", { name: "Niconico Crossfade" }).fill("invalid-url");
      await form.getByRole("textbox", { name: "YouTube Crossfade" }).click();
      await form.getByRole("textbox", { name: "YouTube Crossfade" }).fill("invalid-url");

      /* Click Generate Button */
      await form.getByRole("button", { name: "Generate" }).click();

      await expect(pageOutput).toHaveValue("");

      await expect(fatalErrorsAlert).toBeVisible();
      const fatalErrors = await getValidationItems(fatalErrorsAlert);

      expect(fatalErrors).toContain(getExpectedError("Niconico Crossfade, YouTube Crossfade"));
    }
  });
});