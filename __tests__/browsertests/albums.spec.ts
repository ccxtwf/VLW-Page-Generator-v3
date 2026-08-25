import { test, expect, type Page } from "@playwright/test";
import {
  assertTableRowNumber,
  fillExternalLinksTable,
  fillTracklistTable,
  getHandsontableInstance,
  removeHandsontableRows,
} from "./utils";

test.describe("Album page generator tests", async () => {
  test.beforeEach(async ({ page }) => {
    const response = await page.goto("/#/albums");
    expect(response?.ok()).toBe(true);
    await page.waitForLoadState("networkidle");
  });

  function getFormLocator(page: Page) {
    return page.locator('form[name="album-generator"]');
  }

  test("Form should be mounted", async ({ page }) => {
    const form = getFormLocator(page);
    await expect(form).toBeVisible();
  });

  test("Handsontable tables should be loaded with initial data", async ({ page }) => {
    const form = getFormLocator(page);

    const handsontables = [
      { id: "tracklist", nrows: 12 },
      { id: "external-links", nrows: 5 },
    ];

    for (const { id, nrows } of handsontables) {
      await assertTableRowNumber(getHandsontableInstance(form, id), nrows);
    }
  });

  test("should output when on empty state", async ({ page }) => {
    const form = getFormLocator(page);

    await form.getByRole("checkbox", { name: "Ignore errors" }).click();
    await form.getByRole("button", { name: "Generate" }).click();

    const copyTitleButton = page.getByRole("button", { name: "Copy Title" });
    const pageOutput = page.locator("#page-output");

    await expect(copyTitleButton).toBeVisible();
    await expect(pageOutput).toBeVisible();

    await expect(copyTitleButton).toHaveText("[PAGE TITLE]");
    await expect(pageOutput).toHaveValue(`{{Album Infobox
|title = 
|label = 
|desc = 
|date = 
|vdb = 
|vw = 

|color = black; color:white

}}`);
  });

  test("should output a page - standard", async ({ page }) => {
    const form = getFormLocator(page);

    /* Titles */
    await form.getByRole("textbox", { name: "Original Title" }).click();
    await form.getByRole("textbox", { name: "Original Title" }).fill("アルバム");
    await form.getByRole("textbox", { name: "Transliterated Title" }).click();
    await form.getByRole("textbox", { name: "Transliterated Title" }).fill("Arubamu");

    /* Colours */
    await form.locator('#infobox-bg-color-picker input[type="color"]').fill("#474747");
    await form.locator('#infobox-fg-color-picker input[type="color"]').fill("#cccccc");

    /* General Information */
    await form.getByRole("textbox", { name: "Label" }).click();
    await form.getByRole("textbox", { name: "Label" }).fill("KarenT");
    await form.getByRole("textbox", { name: "Description" }).click();
    await form.getByRole("textbox", { name: "Description" }).fill("an album by [[John Doe]]");
    await expect(
      form.getByRole("checkbox", { name: "Is the album a compilation album?" }),
    ).not.toBeChecked();

    /* Publication dates */
    await form.getByPlaceholder("year").click();
    await form.getByPlaceholder("year").fill("2010");
    await form.locator("#published-month").selectOption("May");
    await form.getByPlaceholder("day").click();
    await form.getByPlaceholder("day").fill("25");

    /* Synth Engines */
    await form.getByRole("combobox", { name: "Used Synth Engines" }).click();
    await form.getByRole("option", { name: "VOCALOID" }).click();
    await page.keyboard.press("Escape");

    /* Tracklist */
    {
      const tracklistTable = getHandsontableInstance(form, "tracklist");
      const data = [
        {
          discNo: 1,
          trackNo: 1,
          pageTitle: "[[Page 1]]",
          producerCredit: "",
          singerCredit: "[[Hatsune Miku (VOCALOID)]]",
        },
        {
          discNo: 1,
          trackNo: 2,
          pageTitle: "[[Page 2]]",
          producerCredit: "",
          singerCredit: "[[Kagamine Rin (VOCALOID)]]",
        },
        {
          discNo: 2,
          trackNo: 1,
          pageTitle: "Page 1 - Instrumental",
          producerCredit: "[[John Doe]]",
          singerCredit: "Instrumental",
        },
        {
          discNo: 2,
          trackNo: 2,
          pageTitle: "Page 1 - Remix",
          producerCredit: "[[RMX]]",
          singerCredit: "Hatsune Miku",
        },
      ];
      await fillTracklistTable(tracklistTable, data);
      await removeHandsontableRows(page, tracklistTable, data.length);
    }

    /* VocaDB Page ID & VOCALOID Page */
    await form.getByRole("textbox", { name: "VocaDB Album Page ID" }).click();
    await form.getByRole("textbox", { name: "VocaDB Album Page ID" }).fill("1");
    await form.getByRole("textbox", { name: "VOCALOID Wiki Page" }).click();
    await form
      .getByRole("textbox", { name: "VOCALOID Wiki Page" })
      .fill("アルバム (Arubamu) (album)");

    /* Streaming links */
    await form.getByRole("textbox", { name: "Niconico Crossfade" }).click();
    await form
      .getByRole("textbox", { name: "Niconico Crossfade" })
      .fill("https://www.nicovideo.jp/watch/sm30228946");
    await form.getByRole("textbox", { name: "YouTube Crossfade" }).click();
    await form
      .getByRole("textbox", { name: "YouTube Crossfade" })
      .fill("https://www.youtube.com/watch?v=in90fSCxGKs");

    /* External Links */
    {
      const externalLinksTable = getHandsontableInstance(form, "external-links");
      const data = [
        {
          i: {
            url: "https://vocadb.net/Al/1",
            isOfficial: false,
          },
          o: {
            desc: "VocaDB",
            url: /^https:\/\/vocadb\.net\/Al\/1$/,
          },
        },
        {
          i: {
            url: "https://www.nicovideo.jp/watch/sm30228946",
            isOfficial: true,
          },
          o: {
            desc: "Niconico",
            url: /^https:\/\/www\.nicovideo\.jp\/watch\/sm30228946$/,
          },
        },
      ];
      await fillExternalLinksTable(externalLinksTable, data);
      await removeHandsontableRows(page, externalLinksTable, data.length);
    }

    await form.getByRole("button", { name: "Autoload" }).click();
    await expect(form.getByRole("textbox", { name: "Categories" })).toHaveValue(
      "Albums featuring VOCALOID\nAlbums featuring Hatsune Miku (VOCALOID)\nAlbums featuring Kagamine Rin (VOCALOID)\nJohn Doe songs list/Albums\nRMX songs list/Albums",
    );

    await form.getByRole("button", { name: "Generate" }).click();

    const fatalErrorsAlert = page.locator("#validation-errors");
    const warningsAlert = page.locator("#validation-warnings");
    await expect(fatalErrorsAlert).not.toBeVisible();
    await expect(warningsAlert).not.toBeVisible();

    const copyTitleButton = page.getByRole("button", { name: "Copy Title" });
    const pageOutput = page.locator("#page-output");

    await expect(copyTitleButton).toBeVisible();
    await expect(pageOutput).toBeVisible();
    await pageOutput.scrollIntoViewIfNeeded();

    await expect(copyTitleButton).toHaveText("アルバム (Arubamu) (album)");
    await expect(pageOutput).toHaveValue(`{{Album Infobox
|title = Arubamu
|orgtitle = アルバム
|label = KarenT
|desc = an album by [[John Doe]]
|date = {{DateAlbum|2010|May|25}}
|vdb = 1
|vw = アルバム (Arubamu) (album)

|nn-xfade = sm30228946
|yt-xfade = in90fSCxGKs

|color = #474747; color:#cccccc
|tr1 = [[Page 1]]
|tr1s = [[Hatsune Miku (VOCALOID)]]
|tr2 = [[Page 2]]
|tr2s = [[Kagamine Rin (VOCALOID)]]
|2tr1 = Page 1 - Instrumental
|2tr1s = [[John Doe]] ft. Instrumental
|2tr2 = Page 1 - Remix
|2tr2s = [[RMX]] ft. Hatsune Miku
}}

==External Links==
* [https://www.nicovideo.jp/watch/sm30228946 Niconico]
===Unofficial===
* {{VDB|Al/1}}

{{sort-album}}
[[Category:Albums featuring VOCALOID]]
[[Category:Albums featuring Hatsune Miku (VOCALOID)]]
[[Category:Albums featuring Kagamine Rin (VOCALOID)]]
[[Category:John Doe songs list/Albums]]
[[Category:RMX songs list/Albums]]`);
  });

  test("should output a page - English title", async ({ page }) => {
    const form = getFormLocator(page);

    /* Titles */
    await form.getByRole("textbox", { name: "Original Title" }).click();
    await form.getByRole("textbox", { name: "Original Title" }).fill("Arubamu");

    /* Colours */
    await form.locator('#infobox-bg-color-picker input[type="color"]').fill("#474747");
    await form.locator('#infobox-fg-color-picker input[type="color"]').fill("#cccccc");

    /* General Information */
    await form.getByRole("textbox", { name: "Label" }).click();
    await form.getByRole("textbox", { name: "Label" }).fill("KarenT");
    await form.getByRole("textbox", { name: "Description" }).click();
    await form.getByRole("textbox", { name: "Description" }).fill("an album by [[John Doe]]");
    await expect(
      form.getByRole("checkbox", { name: "Is the album a compilation album?" }),
    ).not.toBeChecked();

    /* Publication dates */
    await form.getByPlaceholder("year").click();
    await form.getByPlaceholder("year").fill("2010");
    await form.locator("#published-month").selectOption("May");
    await form.getByPlaceholder("day").click();
    await form.getByPlaceholder("day").fill("25");

    /* Synth Engines */
    await form.getByRole("combobox", { name: "Used Synth Engines" }).click();
    await form.getByRole("option", { name: "VOCALOID" }).click();
    await form.getByRole("option", { name: "UTAU" }).click();
    await page.keyboard.press("Escape");

    /* Tracklist */
    {
      const tracklistTable = getHandsontableInstance(form, "tracklist");
      const data = [
        {
          discNo: 1,
          trackNo: 1,
          pageTitle: "[[Page 1]]",
          producerCredit: "",
          singerCredit: "[[Hatsune Miku (VOCALOID)]]",
        },
        {
          discNo: 1,
          trackNo: 2,
          pageTitle: "[[Page 2]]",
          producerCredit: "",
          singerCredit: "[[Kasane Teto (UTAU)]]",
        },
        {
          discNo: 2,
          trackNo: 1,
          pageTitle: "Page 1 - Instrumental",
          producerCredit: "[[John Doe]]",
          singerCredit: "Instrumental",
        },
        {
          discNo: 2,
          trackNo: 2,
          pageTitle: "Page 1 - Remix",
          producerCredit: "[[RMX]]",
          singerCredit: "Hatsune Miku",
        },
      ];
      await fillTracklistTable(tracklistTable, data);
      await removeHandsontableRows(page, tracklistTable, data.length);
    }

    /* VocaDB Page ID & VOCALOID Page */
    await form.getByRole("textbox", { name: "VocaDB Album Page ID" }).click();
    await form.getByRole("textbox", { name: "VocaDB Album Page ID" }).fill("1");
    await form.getByRole("textbox", { name: "VOCALOID Wiki Page" }).click();
    await form
      .getByRole("textbox", { name: "VOCALOID Wiki Page" })
      .fill("アルバム (Arubamu) (album)");

    /* Streaming links */
    await form.getByRole("textbox", { name: "Niconico Crossfade" }).click();
    await form
      .getByRole("textbox", { name: "Niconico Crossfade" })
      .fill("https://www.nicovideo.jp/watch/sm30228946");
    await form.getByRole("textbox", { name: "YouTube Crossfade" }).click();
    await form
      .getByRole("textbox", { name: "YouTube Crossfade" })
      .fill("https://www.youtube.com/watch?v=in90fSCxGKs");

    /* External Links */
    {
      const externalLinksTable = getHandsontableInstance(form, "external-links");
      const data = [
        {
          i: {
            url: "https://vocadb.net/Al/1",
            isOfficial: false,
          },
          o: {
            desc: "VocaDB",
            url: /^https:\/\/vocadb\.net\/Al\/1$/,
          },
        },
        {
          i: {
            url: "https://www.nicovideo.jp/watch/sm30228946",
            isOfficial: true,
          },
          o: {
            desc: "Niconico",
            url: /^https:\/\/www\.nicovideo\.jp\/watch\/sm30228946$/,
          },
        },
      ];
      await fillExternalLinksTable(externalLinksTable, data);
      await removeHandsontableRows(page, externalLinksTable, data.length);
    }

    await form.getByRole("button", { name: "Autoload" }).click();
    await expect(form.getByRole("textbox", { name: "Categories" })).toHaveValue(
      "Albums featuring VOCALOID\nAlbums featuring UTAU\nAlbums featuring Hatsune Miku (VOCALOID)\nAlbums featuring Kasane Teto (UTAU)\nJohn Doe songs list/Albums\nRMX songs list/Albums",
    );

    await form.getByRole("button", { name: "Generate" }).click();

    const fatalErrorsAlert = page.locator("#validation-errors");
    const warningsAlert = page.locator("#validation-warnings");
    await expect(fatalErrorsAlert).not.toBeVisible();
    await expect(warningsAlert).not.toBeVisible();

    const copyTitleButton = page.getByRole("button", { name: "Copy Title" });
    const pageOutput = page.locator("#page-output");

    await expect(copyTitleButton).toBeVisible();
    await expect(pageOutput).toBeVisible();
    await pageOutput.scrollIntoViewIfNeeded();

    await expect(copyTitleButton).toHaveText("Arubamu (album)");
    await expect(pageOutput).toHaveValue(`{{Album Infobox
|title = Arubamu
|label = KarenT
|desc = an album by [[John Doe]]
|date = {{DateAlbum|2010|May|25}}
|vdb = 1
|vw = アルバム (Arubamu) (album)

|nn-xfade = sm30228946
|yt-xfade = in90fSCxGKs

|color = #474747; color:#cccccc
|tr1 = [[Page 1]]
|tr1s = [[Hatsune Miku (VOCALOID)]]
|tr2 = [[Page 2]]
|tr2s = [[Kasane Teto (UTAU)]]
|2tr1 = Page 1 - Instrumental
|2tr1s = [[John Doe]] ft. Instrumental
|2tr2 = Page 1 - Remix
|2tr2s = [[RMX]] ft. Hatsune Miku
}}

==External Links==
* [https://www.nicovideo.jp/watch/sm30228946 Niconico]
===Unofficial===
* {{VDB|Al/1}}

[[Category:Albums featuring VOCALOID]]
[[Category:Albums featuring UTAU]]
[[Category:Albums featuring Hatsune Miku (VOCALOID)]]
[[Category:Albums featuring Kasane Teto (UTAU)]]
[[Category:John Doe songs list/Albums]]
[[Category:RMX songs list/Albums]]`);
  });

  test("should output a page - Compilation album", async ({ page }) => {
    const form = getFormLocator(page);

    /* Titles */
    await form.getByRole("textbox", { name: "Original Title" }).click();
    await form.getByRole("textbox", { name: "Original Title" }).fill("アルバム");
    await form.getByRole("textbox", { name: "Transliterated Title" }).click();
    await form.getByRole("textbox", { name: "Transliterated Title" }).fill("Arubamu");

    /* Colours */
    await form.locator('#infobox-bg-color-picker input[type="color"]').fill("#474747");
    await form.locator('#infobox-fg-color-picker input[type="color"]').fill("#cccccc");

    /* General Information */
    await form.getByRole("textbox", { name: "Label" }).click();
    await form.getByRole("textbox", { name: "Label" }).fill("KarenT");
    await form.getByRole("textbox", { name: "Description" }).click();
    await form
      .getByRole("textbox", { name: "Description" })
      .fill("a compilation album by various producers");
    await form.getByRole("checkbox", { name: "Is the album a compilation album?" }).click();
    await expect(
      form.getByRole("checkbox", { name: "Is the album a compilation album?" }),
    ).toBeChecked();

    /* Publication dates */
    await form.getByPlaceholder("year").click();
    await form.getByPlaceholder("year").fill("2010");
    await form.locator("#published-month").selectOption("May");
    await form.getByPlaceholder("day").click();
    await form.getByPlaceholder("day").fill("25");

    /* Synth Engines */
    await form.getByRole("combobox", { name: "Used Synth Engines" }).click();
    await form.getByRole("option", { name: "VOCALOID" }).click();
    await page.keyboard.press("Escape");

    /* Tracklist */
    {
      const tracklistTable = getHandsontableInstance(form, "tracklist");
      const data = [
        {
          discNo: 1,
          trackNo: 1,
          pageTitle: "[[Page 1]]",
          producerCredit: "[[John Doe]]",
          singerCredit: "[[Hatsune Miku (VOCALOID)]]",
        },
        {
          discNo: 1,
          trackNo: 2,
          pageTitle: "[[Page 2]]",
          producerCredit: "[[Jack Doe]]",
          singerCredit: "[[Kagamine Rin (VOCALOID)]]",
        },
        {
          discNo: 2,
          trackNo: 1,
          pageTitle: "[[Page 3]]",
          producerCredit: "[[Jane Doe]]",
          singerCredit: "Kagamine Rin",
        },
        {
          discNo: 2,
          trackNo: 2,
          pageTitle: "[[Page 4]]",
          producerCredit: "[[Jill Doe]]",
          singerCredit: "Hatsune Miku",
        },
      ];
      await fillTracklistTable(tracklistTable, data);
      await removeHandsontableRows(page, tracklistTable, data.length);
    }

    /* Streaming links */
    await form.getByRole("textbox", { name: "Niconico Crossfade" }).click();
    await form
      .getByRole("textbox", { name: "Niconico Crossfade" })
      .fill("https://www.nicovideo.jp/watch/sm30228946");
    await form.getByRole("textbox", { name: "YouTube Crossfade" }).click();
    await form
      .getByRole("textbox", { name: "YouTube Crossfade" })
      .fill("https://www.youtube.com/watch?v=in90fSCxGKs");

    /* External Links */
    {
      const externalLinksTable = getHandsontableInstance(form, "external-links");
      const data = [
        {
          i: {
            url: "https://vocadb.net/Al/1",
            isOfficial: false,
          },
          o: {
            desc: "VocaDB",
            url: /^https:\/\/vocadb\.net\/Al\/1$/,
          },
        },
        {
          i: {
            url: "https://www.nicovideo.jp/watch/sm30228946",
            isOfficial: true,
          },
          o: {
            desc: "Niconico",
            url: /^https:\/\/www\.nicovideo\.jp\/watch\/sm30228946$/,
          },
        },
      ];
      await fillExternalLinksTable(externalLinksTable, data);
      await removeHandsontableRows(page, externalLinksTable, data.length);
    }

    await form.getByRole("button", { name: "Autoload" }).click();
    await expect(form.getByRole("textbox", { name: "Categories" })).toHaveValue(
      "Albums featuring VOCALOID\nAlbums featuring Hatsune Miku (VOCALOID)\nAlbums featuring Kagamine Rin (VOCALOID)\nJohn Doe songs list/Albums\nJack Doe songs list/Albums\nJane Doe songs list/Albums\nJill Doe songs list/Albums",
    );

    await form.getByRole("button", { name: "Generate" }).click();

    const fatalErrorsAlert = page.locator("#validation-errors");
    await expect(fatalErrorsAlert).not.toBeVisible();

    const copyTitleButton = page.getByRole("button", { name: "Copy Title" });
    const pageOutput = page.locator("#page-output");

    await expect(copyTitleButton).toBeVisible();
    await expect(pageOutput).toBeVisible();
    await pageOutput.scrollIntoViewIfNeeded();

    await expect(copyTitleButton).toHaveText("アルバム (Arubamu) (album)");
    await expect(pageOutput).toHaveValue(`{{Album Infobox
|title = Arubamu
|orgtitle = アルバム
|label = KarenT
|desc = a compilation album by various producers
|date = {{DateAlbum|2010|May|25}}
|vdb = 
|vw = 
|compilation = 1

|nn-xfade = sm30228946
|yt-xfade = in90fSCxGKs

|color = #474747; color:#cccccc
|tr1 = [[Page 1]]
|tr1s = [[John Doe]] ft. [[Hatsune Miku (VOCALOID)]]
|tr2 = [[Page 2]]
|tr2s = [[Jack Doe]] ft. [[Kagamine Rin (VOCALOID)]]
|2tr1 = [[Page 3]]
|2tr1s = [[Jane Doe]] ft. Kagamine Rin
|2tr2 = [[Page 4]]
|2tr2s = [[Jill Doe]] ft. Hatsune Miku
}}

==External Links==
* [https://www.nicovideo.jp/watch/sm30228946 Niconico]
===Unofficial===
* {{VDB|Al/1}}

{{sort-album}}
[[Category:Albums featuring VOCALOID]]
[[Category:Albums featuring Hatsune Miku (VOCALOID)]]
[[Category:Albums featuring Kagamine Rin (VOCALOID)]]
[[Category:John Doe songs list/Albums]]
[[Category:Jack Doe songs list/Albums]]
[[Category:Jane Doe songs list/Albums]]
[[Category:Jill Doe songs list/Albums]]`);
  });

  test("should support all broadcasting links", async ({ page }) => {
    const form = getFormLocator(page);

    /* Titles */
    await form.getByRole("textbox", { name: "Original Title" }).click();
    await form.getByRole("textbox", { name: "Original Title" }).fill("アルバム");
    await form.getByRole("textbox", { name: "Transliterated Title" }).click();
    await form.getByRole("textbox", { name: "Transliterated Title" }).fill("Arubamu");

    /* Colours */
    await form.locator('#infobox-bg-color-picker input[type="color"]').fill("#474747");
    await form.locator('#infobox-fg-color-picker input[type="color"]').fill("#cccccc");

    /* General Information */
    await form.getByRole("textbox", { name: "Label" }).click();
    await form.getByRole("textbox", { name: "Label" }).fill("KarenT");
    await form.getByRole("textbox", { name: "Description" }).click();
    await form
      .getByRole("textbox", { name: "Description" })
      .fill("a compilation album by various producers");
    await form.getByRole("checkbox", { name: "Is the album a compilation album?" }).click();
    await expect(
      form.getByRole("checkbox", { name: "Is the album a compilation album?" }),
    ).toBeChecked();

    /* Publication dates */
    await form.getByPlaceholder("year").click();
    await form.getByPlaceholder("year").fill("2010");
    await form.locator("#published-month").selectOption("May");
    await form.getByPlaceholder("day").click();
    await form.getByPlaceholder("day").fill("25");

    /* Synth Engines */
    await form.getByRole("combobox", { name: "Used Synth Engines" }).click();
    await form.getByRole("option", { name: "VOCALOID" }).click();
    await page.keyboard.press("Escape");

    /* Tracklist */
    {
      const tracklistTable = getHandsontableInstance(form, "tracklist");
      const data = [
        {
          discNo: 1,
          trackNo: 1,
          pageTitle: "[[Page 1]]",
          producerCredit: "[[John Doe]]",
          singerCredit: "[[Hatsune Miku (VOCALOID)]]",
        },
      ];
      await fillTracklistTable(tracklistTable, data);
      await removeHandsontableRows(page, tracklistTable, data.length);
    }

    /* Streaming links */
    {
      const data = [
        {
          label: "Niconico Crossfade",
          value: "https://www.nicovideo.jp/watch/sm30228946",
        },
        {
          label: "YouTube Crossfade",
          value: "https://www.youtube.com/watch?v=in90fSCxGKs",
        },
        {
          label: "Spotify",
          value: "https://open.spotify.com/album/0alAqCK9UfmE4o0cIpKDeo",
        },
        {
          label: "YouTube Music Playlist",
          value: "https://www.youtube.com/playlist?list=OLAK5uy_mlF1GayzzkIWAHcGFs-00ZBbZezi4c9A0",
        },
        {
          label: "Bandamp Embed ID",
          value: "1234567890",
        },
        {
          label: "SoundCloud Crossfade",
          value: "https://soundcloud.com/wanderful-opportunity/wan-opo-vol-08_crossfade",
        },
      ];
      for (const { label, value } of data) {
        await form.getByRole("textbox", { name: label }).click();
        await form.getByRole("textbox", { name: label }).fill(value);
      }
    }

    await form.getByRole("button", { name: "Autoload" }).click();
    await expect(form.getByRole("textbox", { name: "Categories" })).toHaveValue(
      "Albums featuring VOCALOID\nAlbums featuring Hatsune Miku (VOCALOID)\nJohn Doe songs list/Albums",
    );

    await form.getByRole("button", { name: "Generate" }).click();

    const fatalErrorsAlert = page.locator("#validation-errors");
    await expect(fatalErrorsAlert).not.toBeVisible();

    const copyTitleButton = page.getByRole("button", { name: "Copy Title" });
    const pageOutput = page.locator("#page-output");

    await expect(copyTitleButton).toBeVisible();
    await expect(pageOutput).toBeVisible();
    await pageOutput.scrollIntoViewIfNeeded();

    await expect(copyTitleButton).toHaveText("アルバム (Arubamu) (album)");
    await expect(pageOutput).toHaveValue(`{{Album Infobox
|title = Arubamu
|orgtitle = アルバム
|label = KarenT
|desc = a compilation album by various producers
|date = {{DateAlbum|2010|May|25}}
|vdb = 
|vw = 
|compilation = 1

|nn-xfade = sm30228946
|yt-xfade = in90fSCxGKs
|sp-embed = 0alAqCK9UfmE4o0cIpKDeo
|yt-playlist = OLAK5uy_mlF1GayzzkIWAHcGFs-00ZBbZezi4c9A0
|bc-embed = 1234567890
|sc-xfade = https://soundcloud.com/wanderful-opportunity/wan-opo-vol-08_crossfade

|color = #474747; color:#cccccc
|tr1 = [[Page 1]]
|tr1s = [[John Doe]] ft. [[Hatsune Miku (VOCALOID)]]
}}

{{sort-album}}
[[Category:Albums featuring VOCALOID]]
[[Category:Albums featuring Hatsune Miku (VOCALOID)]]
[[Category:John Doe songs list/Albums]]`);
  });
});