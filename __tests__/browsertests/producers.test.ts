import { test, expect, type Page } from "@playwright/test";
import {
  assertTableRowNumber,
  fillDiscographyTable,
  fillExternalLinksTableForProducerPage,
  getHandsontableInstance,
  removeHandsontableRows,
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

  test("Form should be mounted", async ({ page }) => {
    const form = getFormLocator(page);
    expect(form).toBeVisible();
  });

  test("Handsontable tables should be loaded with initial data", async ({ page }) => {
    const form = getFormLocator(page);

    const handsontables = [
      { id: "external-links", nrows: 5 },
      { id: "discography-songs", nrows: 5 },
      { id: "discography-albums", nrows: 5 },
    ];

    for (const { id, nrows } of handsontables) {
      await assertTableRowNumber(getHandsontableInstance(form, id), nrows);
    }
  });

  test("should output when on empty state", async ({ page }) => {
    const form = getFormLocator(page);

    await form.getByRole("checkbox", { name: "ignore errors" }).click();
    await form.getByRole("button", { name: "generate" }).click();

    const copyTitleButton = page.getByRole("button", { name: "Copy Title" });
    const pageOutput = page.locator("#page-output");

    await expect(copyTitleButton).toBeVisible();
    await expect(pageOutput).toBeVisible();

    await expect(copyTitleButton).toHaveText("[PAGE TITLE]");
    await expect(pageOutput).toHaveValue(`<div class="producer-links">
[[File:<PRODUCER PROFILE PICTURE IMAGE FILE>|250px|center]]
==Producer categories==
{{ProdLinks|}}

==External links==
===Unofficial===
{{links |p=yes
  |atmiku = 
  |atutau = 
  |nico   = 
  |vocadb = 
  |tag    = 
  |mgp    = 
}}
</div>



==Works==
{| class="sortable producer-table"
|- class="vcolor-default"
! {{pwt head}}
|}


[[Category:Producers]]`);
  });

  test("should output a page", async ({ page }) => {
    const form = getFormLocator(page);

    /* General information */
    await form.getByRole("textbox", { name: "Main producer category" }).click();
    await form.getByRole("textbox", { name: "Main producer category" }).fill("Hachi");
    await form.getByRole("textbox", { name: "Producer's other aliases" }).click();
    await form.getByRole("textbox", { name: "Producer's other aliases" }).fill("Kenshi Yonezu");
    await form.getByRole("textbox", { name: "Affiliations" }).click();
    await form.getByRole("textbox", { name: "Affiliations" }).fill("Circle 1\nCircle 2");
    await form.getByRole("textbox", { name: "Labels" }).click();
    await form
      .getByRole("textbox", { name: "Labels" })
      .fill("EXIT Tunes\nKarenT\nSony Music Japan");

    /* Languages */
    await form.getByRole("combobox", { name: "Languages" }).click();
    await form.getByRole("option", { name: "Japanese" }).click();
    await form.getByRole("option", { name: "English" }).click();
    await page.keyboard.press("Escape");

    /* Used synths */
    await form.getByRole("combobox", { name: "Uses the synthesizers" }).click();
    await form.getByRole("option", { name: "VOCALOID" }).click();
    await form.getByRole("option", { name: "UTAU" }).click();
    await page.keyboard.press("Escape");

    /* Typical roles */
    await page.getByRole("checkbox", { name: "Composer" }).check();
    await page.getByRole("checkbox", { name: "Lyricist" }).check();
    await page.getByRole("checkbox", { name: "Tuner" }).check();
    await page.getByRole("checkbox", { name: "Illustrator" }).check();
    await page.getByRole("checkbox", { name: "Animator" }).check();
    await page.getByRole("checkbox", { name: "Arranger" }).check();
    await page.getByRole("checkbox", { name: "Instrumentalist" }).check();
    await page.getByRole("checkbox", { name: "Mixer" }).check();
    await page.getByRole("checkbox", { name: "Masterer" }).check();

    /* Desc */
    await form.getByRole("textbox", { name: "Description" }).click();
    await form
      .getByRole("textbox", { name: "Description" })
      .fill(
        "'''Hachi''' is a prolific vocal synth producer. This is a simple piece of placeholder text.",
      );

    /* External Links */
    {
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
        {
          i: {
            url: "https://www.nicovideo.jp/mylist/11284855",
            isOfficial: false,
            isMedia: true,
          },
          o: {
            desc: "Niconico",
            url: /^https:\/\/www\.nicovideo\.jp\/mylist\/11284855$/,
          },
        },
        {
          i: {
            url: "https://w.atwiki.jp/hmiku/pages/4671.html",
            isOfficial: false,
            isMedia: false,
          },
          o: {
            desc: "Hatsune Miku Wiki",
            url: /^https:\/\/w\.atwiki\.jp\/hmiku\/pages\/4671\.html/,
          },
        },
        {
          i: {
            url: "https://piapro.jp/pinokiop",
            isOfficial: false,
            isMedia: true,
            isInactive: true,
          },
          o: {
            desc: "piapro",
            url: /^https:\/\/piapro\.jp\/pinokiop$/,
          },
        },
      ];
      await fillExternalLinksTableForProducerPage(externalLinksTable, data);
      await removeHandsontableRows(page, externalLinksTable, data.length);
    }

    /* Discography */
    {
      const songsTable = getHandsontableInstance(form, "discography-songs");
      const data = [
        { page: "Page 1", additionalParameters: "" },
        { page: "Page 1", additionalParameters: "ver=Remix" },
        { page: "Page 2", additionalParameters: "" },
      ];
      await fillDiscographyTable(songsTable, data, false);
    }
    {
      const albumsTable = getHandsontableInstance(form, "discography-albums");
      const data = [
        { page: "Album 1", additionalParameters: "", isCompilation: false },
        { page: "Album 1", additionalParameters: "kanji=abc", isCompilation: false },
        { page: "Album 2", additionalParameters: "", isCompilation: true },
      ];
      await fillDiscographyTable(albumsTable, data, true);
    }
    expect(form.getByRole("checkbox", { name: "Split album table in two" })).not.toBeChecked();

    await form.getByRole("checkbox", { name: "Ignore Errors" }).click();
    await form.getByRole("button", { name: "Generate" }).click();

    const copyTitleButton = page.getByRole("button", { name: "Copy Title" });
    const pageOutput = page.locator("#page-output");

    await expect(copyTitleButton).toBeVisible();
    await expect(pageOutput).toBeVisible();
    await pageOutput.scrollIntoViewIfNeeded();

    await expect(copyTitleButton).toHaveText("Hachi");
    await expect(pageOutput).toHaveValue(`<div class="producer-links">
[[File:<PRODUCER PROFILE PICTURE IMAGE FILE>|250px|center]]
==Producer categories==
{{ProdLinks|Hachi}}

==Labels==
* EXIT Tunes
* KarenT
* Sony Music Japan

==Affiliations==
* Circle 1
* Circle 2

==External links==
===Unofficial===
{{links |p=yes
  |atmiku = 4671
  |atutau = 
  |nico   = 
  |vocadb = 28
  |tag    = 
  |mgp    = 
}}
* [https://www.nicovideo.jp/mylist/11284855 Niconico]
* <s>[https://piapro.jp/pinokiop piapro]</s>
</div>

'''Hachi''' is a prolific vocal synth producer. This is a simple piece of placeholder text.

==Works==
{{pwt alias|Kenshi Yonezu}}
{| class="sortable producer-table"
|- class="vcolor-default"
! {{pwt head}}
|-
| {{pwt row|Page 1}}
|-
| {{pwt row|Page 1|ver=Remix}}
|-
| {{pwt row|Page 2}}
|}

==Discography==
{| class="sortable producer-table"
|- class="vcolor-default"
! {{awt head}}
|-
| {{awt row|Album 1}}
|-
| {{awt row|Album 1|kanji=abc}}
|-
| {{awt row|Album 2}}
|}

[[Category:Producers]]
[[Category:Composers]]
[[Category:Lyricists]]
[[Category:Tuners]]
[[Category:Illustrators]]
[[Category:Animators]]
[[Category:Arrangers]]
[[Category:Instrumentalists]]
[[Category:Mixers]]
[[Category:Masterers]]
[[Category:Japanese original producers]]
[[Category:English original producers]]
[[Category:Producers using VOCALOID]]
[[Category:Producers using UTAU]]`);
  });

  test("should output a page with split album discography sections", async ({ page }) => {
    const form = getFormLocator(page);

    /* General information */
    await form.getByRole("textbox", { name: "Main producer category" }).click();
    await form.getByRole("textbox", { name: "Main producer category" }).fill("Hachi");
    await form.getByRole("textbox", { name: "Producer's other aliases" }).click();
    await form.getByRole("textbox", { name: "Producer's other aliases" }).fill("Kenshi Yonezu");
    await form.getByRole("checkbox", { name: "Split album table in two" }).click();
    await form.getByRole("textbox", { name: "Affiliations" }).click();
    await form.getByRole("textbox", { name: "Affiliations" }).fill("Circle 1\nCircle 2");
    await form.getByRole("textbox", { name: "Labels" }).click();
    await form
      .getByRole("textbox", { name: "Labels" })
      .fill("EXIT Tunes\nKarenT\nSony Music Japan");

    /* Languages */
    await form.getByRole("combobox", { name: "Languages" }).click();
    await form.getByRole("option", { name: "Japanese" }).click();
    await form.getByRole("option", { name: "English" }).click();
    await page.keyboard.press("Escape");

    /* Used synths */
    await form.getByRole("combobox", { name: "Uses the synthesizers" }).click();
    await form.getByRole("option", { name: "VOCALOID" }).click();
    await form.getByRole("option", { name: "UTAU" }).click();
    await page.keyboard.press("Escape");

    /* Typical roles */
    await page.getByRole("checkbox", { name: "Composer" }).check();
    await page.getByRole("checkbox", { name: "Lyricist" }).check();
    await page.getByRole("checkbox", { name: "Tuner" }).check();
    await page.getByRole("checkbox", { name: "Illustrator" }).check();
    await page.getByRole("checkbox", { name: "Animator" }).check();
    await page.getByRole("checkbox", { name: "Arranger" }).check();
    await page.getByRole("checkbox", { name: "Instrumentalist" }).check();
    await page.getByRole("checkbox", { name: "Mixer" }).check();
    await page.getByRole("checkbox", { name: "Masterer" }).check();

    /* Desc */
    await form.getByRole("textbox", { name: "Description" }).click();
    await form
      .getByRole("textbox", { name: "Description" })
      .fill(
        "'''Hachi''' is a prolific vocal synth producer. This is a simple piece of placeholder text.",
      );

    /* External Links */
    {
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
        {
          i: {
            url: "https://www.nicovideo.jp/mylist/11284855",
            isOfficial: false,
            isMedia: true,
          },
          o: {
            desc: "Niconico",
            url: /^https:\/\/www\.nicovideo\.jp\/mylist\/11284855$/,
          },
        },
        {
          i: {
            url: "https://w.atwiki.jp/hmiku/pages/4671.html",
            isOfficial: false,
            isMedia: false,
          },
          o: {
            desc: "Hatsune Miku Wiki",
            url: /^https:\/\/w\.atwiki\.jp\/hmiku\/pages\/4671\.html/,
          },
        },
        {
          i: {
            url: "https://piapro.jp/pinokiop",
            isOfficial: false,
            isMedia: true,
            isInactive: true,
          },
          o: {
            desc: "piapro",
            url: /^https:\/\/piapro\.jp\/pinokiop$/,
          },
        },
      ];
      await fillExternalLinksTableForProducerPage(externalLinksTable, data);
      await removeHandsontableRows(page, externalLinksTable, data.length);
    }

    /* Discography */
    {
      const songsTable = getHandsontableInstance(form, "discography-songs");
      const data = [
        { page: "Page 1", additionalParameters: "" },
        { page: "Page 1", additionalParameters: "ver=Remix" },
        { page: "Page 2", additionalParameters: "" },
      ];
      await fillDiscographyTable(songsTable, data, false);
    }
    {
      const albumsTable = getHandsontableInstance(form, "discography-albums");
      const data = [
        { page: "Album 1", additionalParameters: "", isCompilation: false },
        { page: "Album 1", additionalParameters: "kanji=abc", isCompilation: false },
        { page: "Album 2", additionalParameters: "", isCompilation: true },
      ];
      await fillDiscographyTable(albumsTable, data, true);
    }
    expect(form.getByRole("checkbox", { name: "Split album table in two" })).toBeChecked();

    await form.getByRole("checkbox", { name: "Ignore Errors" }).click();
    await form.getByRole("button", { name: "Generate" }).click();

    const copyTitleButton = page.getByRole("button", { name: "Copy Title" });
    const pageOutput = page.locator("#page-output");

    await expect(copyTitleButton).toBeVisible();
    await expect(pageOutput).toBeVisible();
    await pageOutput.scrollIntoViewIfNeeded();

    await expect(copyTitleButton).toHaveText("Hachi");
    await expect(pageOutput).toHaveValue(`<div class="producer-links">
[[File:<PRODUCER PROFILE PICTURE IMAGE FILE>|250px|center]]
==Producer categories==
{{ProdLinks|Hachi}}

==Labels==
* EXIT Tunes
* KarenT
* Sony Music Japan

==Affiliations==
* Circle 1
* Circle 2

==External links==
===Unofficial===
{{links |p=yes
  |atmiku = 4671
  |atutau = 
  |nico   = 
  |vocadb = 28
  |tag    = 
  |mgp    = 
}}
* [https://www.nicovideo.jp/mylist/11284855 Niconico]
* <s>[https://piapro.jp/pinokiop piapro]</s>
</div>

'''Hachi''' is a prolific vocal synth producer. This is a simple piece of placeholder text.

==Works==
{{pwt alias|Kenshi Yonezu}}
{| class="sortable producer-table"
|- class="vcolor-default"
! {{pwt head}}
|-
| {{pwt row|Page 1}}
|-
| {{pwt row|Page 1|ver=Remix}}
|-
| {{pwt row|Page 2}}
|}

==Discography==
{| class="sortable producer-table"
|- class="vcolor-default"
! {{awt head}}
|-
| {{awt row|Album 1}}
|-
| {{awt row|Album 1|kanji=abc}}
|}

===Compilations===
{| class="sortable producer-table"
|- class="vcolor-default"
! {{awt head}}
|-
| {{awt row|Album 2}}
|}

[[Category:Producers]]
[[Category:Composers]]
[[Category:Lyricists]]
[[Category:Tuners]]
[[Category:Illustrators]]
[[Category:Animators]]
[[Category:Arrangers]]
[[Category:Instrumentalists]]
[[Category:Mixers]]
[[Category:Masterers]]
[[Category:Japanese original producers]]
[[Category:English original producers]]
[[Category:Producers using VOCALOID]]
[[Category:Producers using UTAU]]`);
  });
});
