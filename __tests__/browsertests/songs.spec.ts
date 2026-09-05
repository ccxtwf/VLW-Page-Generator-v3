import { test, expect, type Page } from "@playwright/test";
import {
  assertTableColumnNumber,
  assertTableRowNumber,
  fillBroadcastLinksTable,
  fillExternalLinksTable,
  fillLyricsTable,
  getHandsontableInstance,
  removeHandsontableRows,
  getSnapshotsDir,
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

  test("Form should be mounted", async ({ page }) => {
    const form = getFormLocator(page);
    await expect(form).toBeVisible();
  });

  test("Handsontable tables should be loaded with initial data", async ({ page }) => {
    const form = getFormLocator(page);

    const handsontables = [
      { id: "broadcast-links", nrows: 5 },
      { id: "lyrics", nrows: 20 },
      { id: "external-links", nrows: 5 },
    ];

    for (const { id, nrows } of handsontables) {
      await assertTableRowNumber(getHandsontableInstance(form, id), nrows);
    }
  });

  test("should output when on empty state", async ({ page }, { project: { name: browser } }) => {
    const form = getFormLocator(page);

    await form.getByRole("checkbox", { name: "Ignore Errors" }).click();
    await form.getByRole("button", { name: "Generate" }).click();

    const copyTitleButton = page.getByRole("button", { name: "Copy Title" });
    const pageOutput = page.locator("#page-output");

    await expect(copyTitleButton).toBeVisible();
    await expect(pageOutput).toBeVisible();

    await expect(copyTitleButton).toHaveText("[PAGE TITLE]");
    await expect(pageOutput).toHaveValue(`{{Infobox Song
|songtitle = "''''''"
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = N/A
|link = N/A
|language = 
}}

==Lyrics==
{{lyrics toggle|org:Original|rom:Romanized|iso-lang=}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|}`);

    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/songs/empty.png`,
      fullPage: true,
    });
  });

  test("should output a page for Japanese songs", async ({ page }, {
    project: { name: browser },
  }) => {
    const form = getFormLocator(page);

    /* Content Warnings */
    await form.getByLabel("Content Warnings").selectOption("1");
    await form.getByRole("textbox", { name: "e.g. violence/gore/sexual content" }).click();
    await form
      .getByRole("textbox", { name: "e.g. violence/gore/sexual content" })
      .fill("suicidal themes");
    await form.getByText("Epileptic Warning").click();

    /* Language & ISO Code */
    await form.getByRole("combobox", { name: "Song Language" }).click();
    await form.getByRole("option", { name: "Japanese" }).click();
    await page.keyboard.press("Escape");
    await form.getByRole("textbox", { name: "Language ISO Code" }).click();
    await form.getByRole("textbox", { name: "Language ISO Code" }).fill("ja");

    /* Titles */
    await form.getByRole("textbox", { name: "Original Title" }).click();
    await form.getByRole("textbox", { name: "Original Title" }).fill("ローリングガール");
    await form.getByRole("textbox", { name: "Transliterated Title" }).click();
    await form.getByRole("textbox", { name: "Transliterated Title" }).fill("Rooringu Gaaru");
    await form.getByRole("textbox", { name: "Translated Title" }).click();
    await form.getByRole("textbox", { name: "Translated Title" }).fill("Rolling Girl");
    await form.getByRole("checkbox", { name: "Is an official title?" }).click();

    /* Colours */
    await form.locator('#infobox-bg-color-picker input[type="color"]').fill("#474747");
    await form.locator('#infobox-fg-color-picker input[type="color"]').fill("#cccccc");

    /* General information */
    await form.getByRole("textbox", { name: "Upload Date" }).fill("2010-02-14");
    await form.getByRole("textbox", { name: "Singer(s)" }).click();
    await form.getByRole("textbox", { name: "Singer(s)" }).fill("[[Hatsune Miku (VOCALOID)]]");
    await form.getByRole("textbox", { name: "Producer(s)" }).click();
    await form.getByRole("textbox", { name: "Producer(s)" }).fill("[[wowaka]] (music, lyrics)");
    await form.getByRole("textbox", { name: "Description" }).click();
    await form.getByRole("textbox", { name: "Description" }).fill("This is a song by wowaka.");

    /* Broadcast links */
    {
      const broadcastLinksTable = getHandsontableInstance(form, "broadcast-links");
      const data = [
        {
          i: {
            url: "http://www.nicovideo.jp/watch/sm9714351",
            viewCount: "100000",
          },
          o: {
            site: /Niconico/,
            url: /^https:\/\/www\.nicovideo\.jp\/watch\/sm9714351$/,
          },
        },
        {
          i: {
            url: "https://youtu.be/vnw8zURAxkU",
            viewCount: "12300000",
          },
          o: {
            site: /YouTube/,
            url: /^https:\/\/www\.youtube\.com\/watch\?v=vnw8zURAxkU$/,
          },
        },
      ];
      await fillBroadcastLinksTable(broadcastLinksTable, data);
      await removeHandsontableRows(page, broadcastLinksTable, data.length);
    }

    /* Lyrics */
    {
      const lyricsTable = getHandsontableInstance(form, "lyrics");
      const data = [
        {
          customStyle: "color:red;",
          original: "あいうえお",
          romanized: "aiueo",
          english: "ABCD",
        },
        {
          customStyle: "",
          original: "かきくけこ",
          romanized: "kakikukeko",
          english: "EFGH",
        },
        {
          customStyle: "",
          original: "さしすせそ",
          romanized: "sasisuseso",
          english: "IJKL",
        },
        {
          customStyle: "",
          original: "",
          romanized: "",
          english: "",
        },
        {
          customStyle: "",
          original: "SHOUT!",
          romanized: "SHOUT!",
          english: "SHOUT!",
        },
      ];
      await fillLyricsTable(lyricsTable, data);
      await removeHandsontableRows(page, lyricsTable, data.length);
    }
    /* Translator */
    await form.getByRole("textbox", { name: "Translator" }).click();
    await form.getByRole("textbox", { name: "Translator" }).fill("Project DIVA 2nd Stage");
    await form.getByRole("checkbox", { name: "Is an official translation?" }).click();

    /* External links */
    {
      const externalLinksTable = getHandsontableInstance(form, "external-links");
      const data = [
        {
          i: {
            url: "https://vocadb.net/S/1501",
            isOfficial: false,
          },
          o: {
            desc: "VocaDB",
            url: /^https:\/\/vocadb\.net\/S\/1501$/,
          },
        },
        {
          i: {
            url: "https://www.pixiv.net/artworks/10324371",
            isOfficial: true,
          },
          o: {
            desc: "pixiv",
            url: /^https:\/\/www\.pixiv\.net\/artworks\/10324371$/,
          },
        },
      ];
      await fillExternalLinksTable(externalLinksTable, data);
      await removeHandsontableRows(page, externalLinksTable, data.length);
    }

    await form.getByRole("button", { name: "Autoload" }).click();
    await expect(form.getByRole("textbox", { name: "Categories" })).toHaveValue(
      "wowaka songs list",
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

    await expect(copyTitleButton).toHaveText("ローリングガール (Rooringu Gaaru)");
    await expect(pageOutput).toHaveValue(`{{sort}}{{Epilepsy}}{{Questionable|suicidal themes}}
{{Infobox Song
|songtitle = "'''ローリングガール'''"<br />Romaji: Rooringu Gaaru<br />Official English: Rolling Girl
|color = #474747; color:#cccccc
|original upload date = {{Date|2010|February|14}}
|singer = [[Hatsune Miku (VOCALOID)]]
|producer = [[wowaka]] (music, lyrics)
|#views = 100,000+ (NN), 12,000,000+ (YT)
|link = {{#|https://www.nicovideo.jp/watch/sm9714351}} {{#|https://www.youtube.com/watch?v=vnw8zURAxkU}}
|description = This is a song by wowaka.
|language = Japanese
}}

==Lyrics==
{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}
{{OfficialEnglishNotify}}
{| border="1" cellpadding="4" style="border-collapse:collapse; border:1px groove; line-height:1.5"
!style="background-color:#474747; color:#cccccc;"|Singer
|<span style="color:red;">Singer</span>
|All
|}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|- style="color:red;"
|あいうえお
|aiueo
|ABCD
|-
|かきくけこ
|kakikukeko
|EFGH
|-
|さしすせそ
|sasisuseso
|IJKL
|-
|<br />
|-
| {{shared}} SHOUT!
|}
{{Translator|Project DIVA 2nd Stage}}

==External Links==
* [https://www.pixiv.net/artworks/10324371 pixiv]
===Unofficial===
* {{VDB|S/1501}}

[[Category:wowaka songs list]]`);

    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/songs/japanese.png`,
      fullPage: true,
    });
  });

  test("should output a page for Japanese songs without a translation", async ({ page }, {
    project: { name: browser },
  }) => {
    const form = getFormLocator(page);

    /* Content Warnings */
    await form.getByLabel("Content Warnings").selectOption("1");
    await form.getByRole("textbox", { name: "e.g. violence/gore/sexual content" }).click();
    await form
      .getByRole("textbox", { name: "e.g. violence/gore/sexual content" })
      .fill("suicidal themes");
    await form.getByText("Epileptic Warning").click();

    /* Language & ISO Code */
    await form.getByRole("combobox", { name: "Song Language" }).click();
    await form.getByRole("option", { name: "Japanese" }).click();
    await page.keyboard.press("Escape");
    await form.getByRole("textbox", { name: "Language ISO Code" }).click();
    await form.getByRole("textbox", { name: "Language ISO Code" }).fill("ja");

    /* Titles */
    await form.getByRole("textbox", { name: "Original Title" }).click();
    await form.getByRole("textbox", { name: "Original Title" }).fill("ローリングガール");
    await form.getByRole("textbox", { name: "Transliterated Title" }).click();
    await form.getByRole("textbox", { name: "Transliterated Title" }).fill("Rooringu Gaaru");
    await form.getByRole("textbox", { name: "Translated Title" }).click();
    await form.getByRole("textbox", { name: "Translated Title" }).fill("Rolling Girl");
    await form.getByRole("checkbox", { name: "Is an official title?" }).click();

    /* Colours */
    await page.locator('#infobox-bg-color-picker input[type="color"]').fill("#474747");
    await page.locator('#infobox-fg-color-picker input[type="color"]').fill("#cccccc");

    /* General information */
    await form.getByRole("textbox", { name: "Upload Date" }).fill("2010-02-14");
    await form.getByRole("textbox", { name: "Singer(s)" }).click();
    await form.getByRole("textbox", { name: "Singer(s)" }).fill("[[Hatsune Miku (VOCALOID)]]");
    await form.getByRole("textbox", { name: "Producer(s)" }).click();
    await form.getByRole("textbox", { name: "Producer(s)" }).fill("[[wowaka]] (music, lyrics)");
    await form.getByRole("textbox", { name: "Description" }).click();
    await form.getByRole("textbox", { name: "Description" }).fill("This is a song by wowaka.");

    /* Broadcast links */
    {
      const broadcastLinksTable = getHandsontableInstance(form, "broadcast-links");
      const data = [
        {
          i: {
            url: "http://www.nicovideo.jp/watch/sm9714351",
            viewCount: "100000",
          },
          o: {
            site: /Niconico/,
            url: /^https:\/\/www\.nicovideo\.jp\/watch\/sm9714351$/,
          },
        },
        {
          i: {
            url: "https://youtu.be/vnw8zURAxkU",
            viewCount: "12300000",
          },
          o: {
            site: /YouTube/,
            url: /^https:\/\/www\.youtube\.com\/watch\?v=vnw8zURAxkU$/,
          },
        },
      ];
      await fillBroadcastLinksTable(broadcastLinksTable, data);
      await removeHandsontableRows(page, broadcastLinksTable, data.length);
    }

    /* Lyrics */
    {
      const lyricsTable = getHandsontableInstance(form, "lyrics");
      const data = [
        {
          customStyle: "color:red;",
          original: "あいうえお",
          romanized: "aiueo",
        },
        {
          customStyle: "",
          original: "かきくけこ",
          romanized: "kakikukeko",
        },
        {
          customStyle: "",
          original: "さしすせそ",
          romanized: "sasisuseso",
        },
        {
          customStyle: "",
          original: "",
          romanized: "",
        },
        {
          customStyle: "",
          original: "SHOUT!",
          romanized: "SHOUT!",
        },
      ];
      await fillLyricsTable(lyricsTable, data);
      await removeHandsontableRows(page, lyricsTable, data.length);
    }

    /* External links */
    {
      const externalLinksTable = getHandsontableInstance(form, "external-links");
      const data = [
        {
          i: {
            url: "https://vocadb.net/S/1501",
            isOfficial: false,
          },
          o: {
            desc: "VocaDB",
            url: /^https:\/\/vocadb\.net\/S\/1501$/,
          },
        },
        {
          i: {
            url: "https://www.pixiv.net/artworks/10324371",
            isOfficial: true,
          },
          o: {
            desc: "pixiv",
            url: /^https:\/\/www\.pixiv\.net\/artworks\/10324371$/,
          },
        },
      ];
      await fillExternalLinksTable(externalLinksTable, data);
      await removeHandsontableRows(page, externalLinksTable, data.length);
    }

    await form.getByRole("button", { name: "Autoload" }).click();
    await expect(form.getByRole("textbox", { name: "Categories" })).toHaveValue(
      "wowaka songs list",
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

    await expect(copyTitleButton).toHaveText("ローリングガール (Rooringu Gaaru)");
    await expect(pageOutput).toHaveValue(`{{sort}}{{Epilepsy}}{{Questionable|suicidal themes}}
{{Infobox Song
|songtitle = "'''ローリングガール'''"<br />Romaji: Rooringu Gaaru<br />Official English: Rolling Girl
|color = #474747; color:#cccccc
|original upload date = {{Date|2010|February|14}}
|singer = [[Hatsune Miku (VOCALOID)]]
|producer = [[wowaka]] (music, lyrics)
|#views = 100,000+ (NN), 12,000,000+ (YT)
|link = {{#|https://www.nicovideo.jp/watch/sm9714351}} {{#|https://www.youtube.com/watch?v=vnw8zURAxkU}}
|description = This is a song by wowaka.
|language = Japanese
}}

==Lyrics==
{{lyrics toggle|jp:Japanese|rom:Romaji}}
{| border="1" cellpadding="4" style="border-collapse:collapse; border:1px groove; line-height:1.5"
!style="background-color:#474747; color:#cccccc;"|Singer
|<span style="color:red;">Singer</span>
|All
|}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|- style="color:red;"
|あいうえお
|aiueo
|-
|かきくけこ
|kakikukeko
|-
|さしすせそ
|sasisuseso
|-
|<br />
|-
| {{shared}} SHOUT!
|}

==External Links==
* [https://www.pixiv.net/artworks/10324371 pixiv]
===Unofficial===
* {{VDB|S/1501}}

[[Category:wowaka songs list]]`);

    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/songs/japanese-no-tl.png`,
      fullPage: true,
    });
  });

  test("should output a page for Chinese songs", async ({ page }, {
    project: { name: browser },
  }) => {
    const form = getFormLocator(page);

    /* Language & ISO Code */
    await form.getByRole("combobox", { name: "Song Language" }).click();
    await form.getByRole("option", { name: "Mandarin" }).click();
    await page.keyboard.press("Escape");
    await form.getByRole("textbox", { name: "Language ISO Code" }).click();
    await form.getByRole("textbox", { name: "Language ISO Code" }).fill("zh-Hans");

    /* Titles */
    await form.getByRole("textbox", { name: "Original Title" }).click();
    await form.getByRole("textbox", { name: "Original Title" }).fill("茉莉花");
    await form.getByRole("textbox", { name: "Transliterated Title" }).click();
    await form.getByRole("textbox", { name: "Transliterated Title" }).fill("Mòlìhuā");
    await form.getByRole("textbox", { name: "Translated Title" }).click();
    await form.getByRole("textbox", { name: "Translated Title" }).fill("Jasmine");

    /* Colours */
    await page.locator('#infobox-bg-color-picker input[type="color"]').fill("#751d1d");
    await page.locator('#infobox-fg-color-picker input[type="color"]').fill("#d0d3ce");

    /* General information */
    await form.getByRole("textbox", { name: "Upload Date" }).fill("2013-01-03");
    await form.getByRole("textbox", { name: "Singer(s)" }).click();
    await form.getByRole("textbox", { name: "Singer(s)" }).fill("[[Luo Tianyi (VOCALOID)]]");
    await form.getByRole("textbox", { name: "Producer(s)" }).click();
    await form
      .getByRole("textbox", { name: "Producer(s)" })
      .fill("[[李]] (music)\n[[苏]] (lyrics)");
    await form.getByRole("textbox", { name: "Description" }).click();
    await form.getByRole("textbox", { name: "Description" }).fill("This is a demo song.");

    /* Broadcast links */
    {
      const broadcastLinksTable = getHandsontableInstance(form, "broadcast-links");
      const data = [
        {
          i: {
            url: "https://youtu.be/12345678901",
            viewCount: "5,000+",
          },
          o: {
            site: /YouTube/,
            url: /^https:\/\/www\.youtube\.com\/watch\?v=12345678901$/,
          },
        },
      ];
      await fillBroadcastLinksTable(broadcastLinksTable, data);
      await removeHandsontableRows(page, broadcastLinksTable, data.length);
    }

    /* Lyrics */
    {
      const lyricsTable = getHandsontableInstance(form, "lyrics");
      const data = [
        {
          customStyle: "",
          original: "好一朵茉莉花,",
          romanized: "hǎo yī duo mòlìhuā,",
          english: "What a jasmine flower!",
        },
        {
          customStyle: "",
          original: "滿園花開香也香不過她,",
          romanized: "mǎn yuán huā kāi xiāng yě xiāng bùguò tā,",
          english:
            "Of all the fragrant flowers and grasses in the garden, there is none as fragrant as it.",
        },
        {
          customStyle: "",
          original: "我有心采一朵戴",
          romanized: "wǒ yǒuxīn cǎi yī duo dài",
          english: "I want to pluck one and wear it,",
        },
        {
          customStyle: "",
          original: "又怕看花的人兒罵.",
          romanized: "yòu pà kàn huā de rén er mà.",
          english: "but the gardener would scold me.",
        },
      ];
      await fillLyricsTable(lyricsTable, data);
      await removeHandsontableRows(page, lyricsTable, data.length);
    }

    await form.getByRole("button", { name: "autoload" }).click();
    await expect(form.getByRole("textbox", { name: "categories" })).toHaveValue(
      "李 songs list\n苏 songs list/Lyrics",
    );

    await form.getByRole("button", { name: "generate" }).click();

    const fatalErrorsAlert = page.locator("#validation-errors");
    await expect(fatalErrorsAlert).not.toBeVisible();

    const copyTitleButton = page.getByRole("button", { name: "Copy Title" });
    const pageOutput = page.locator("#page-output");

    await expect(copyTitleButton).toBeVisible();
    await expect(pageOutput).toBeVisible();
    await pageOutput.scrollIntoViewIfNeeded();

    await expect(copyTitleButton).toHaveText("茉莉花 (Mòlìhuā)");
    await expect(pageOutput).toHaveValue(`{{sort}}
{{Infobox Song
|songtitle = "'''茉莉花'''"<br />Pinyin: Mòlìhuā<br />English: Jasmine
|color = #751d1d; color:#d0d3ce
|original upload date = {{Date|2013|January|3}}
|singer = [[Luo Tianyi (VOCALOID)]]
|producer = [[李]] (music)<br />[[苏]] (lyrics)
|#views = 5,000+
|link = {{#|https://www.youtube.com/watch?v=12345678901}}
|description = This is a demo song.
|language = Mandarin
}}

==Lyrics==
{{lyrics toggle|cn:Mandarin|py:Pinyin|eng:English}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|好一朵茉莉花,
|hǎo yī duo mòlìhuā,
|What a jasmine flower!
|-
|滿園花開香也香不過她,
|mǎn yuán huā kāi xiāng yě xiāng bùguò tā,
|Of all the fragrant flowers and grasses in the garden, there is none as fragrant as it.
|-
|我有心采一朵戴
|wǒ yǒuxīn cǎi yī duo dài
|I want to pluck one and wear it,
|-
|又怕看花的人兒罵.
|yòu pà kàn huā de rén er mà.
|but the gardener would scold me.
|}
{{Translator|Anonymous}}

[[Category:李 songs list]]
[[Category:苏 songs list/Lyrics]]`);

    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/songs/chinese.png`,
      fullPage: true,
    });
  });

  test("should output a page for Chinese songs with alt Traditional Chinese title", async ({
    page,
  }, { project: { name: browser } }) => {
    const form = getFormLocator(page);

    /* Language & ISO Code */
    await form.getByRole("combobox", { name: "Song Language" }).click();
    await form.getByRole("option", { name: "Mandarin" }).click();
    await page.keyboard.press("Escape");
    await form.getByRole("textbox", { name: "Language ISO Code" }).click();
    await form.getByRole("textbox", { name: "Language ISO Code" }).fill("zh-Hans");

    /* Titles */
    await form.getByRole("textbox", { name: "Original Title" }).click();
    await form.getByRole("textbox", { name: "Original Title" }).fill("过得好");
    await expect(form.getByRole("textbox", { name: "Traditional Chinese Title" })).toBeVisible();
    await form.getByRole("textbox", { name: "Traditional Chinese Title" }).click();
    await form.getByRole("textbox", { name: "Traditional Chinese Title" }).fill("過得好");
    const toggle = form.locator(".swap").filter({ hasText: "繁⇔简 简⇔繁" });
    await expect(toggle.locator('input[type="checkbox"]')).toBeChecked();
    await form.getByRole("textbox", { name: "Transliterated Title" }).click();
    await form.getByRole("textbox", { name: "Transliterated Title" }).fill("Guò dé Hǎo");
    await form.getByRole("textbox", { name: "Translated Title" }).click();
    await form.getByRole("textbox", { name: "Translated Title" }).fill("Doing Well");

    /* Colours */
    await page.locator('#infobox-bg-color-picker input[type="color"]').fill("#751d1d");
    await page.locator('#infobox-fg-color-picker input[type="color"]').fill("#d0d3ce");

    /* General information */
    await form.getByRole("textbox", { name: "Upload Date" }).fill("2013-01-03");
    await form.getByRole("textbox", { name: "Singer(s)" }).click();
    await form.getByRole("textbox", { name: "Singer(s)" }).fill("[[Luo Tianyi (VOCALOID)]]");
    await form.getByRole("textbox", { name: "Producer(s)" }).click();
    await form
      .getByRole("textbox", { name: "Producer(s)" })
      .fill("[[李]] (music)\n[[苏]] (lyrics)");
    await form.getByRole("textbox", { name: "Description" }).click();
    await form.getByRole("textbox", { name: "Description" }).fill("This is a demo song.");

    /* Broadcast links */
    {
      const broadcastLinksTable = getHandsontableInstance(form, "broadcast-links");
      const data = [
        {
          i: {
            url: "https://youtu.be/12345678901",
            viewCount: "5,000+",
          },
          o: {
            site: /YouTube/,
            url: /^https:\/\/www\.youtube\.com\/watch\?v=12345678901$/,
          },
        },
      ];
      await fillBroadcastLinksTable(broadcastLinksTable, data);
      await removeHandsontableRows(page, broadcastLinksTable, data.length);
    }

    /* Lyrics */
    {
      const lyricsTable = getHandsontableInstance(form, "lyrics");
      const data = [{ original: "あいうえお", romanized: "aiueo", english: "ABCD" }];
      await fillLyricsTable(lyricsTable, data);
      await removeHandsontableRows(page, lyricsTable, data.length);
    }

    await form.getByRole("button", { name: "autoload" }).click();
    await expect(form.getByRole("textbox", { name: "categories" })).toHaveValue(
      "李 songs list\n苏 songs list/Lyrics",
    );

    await form.getByRole("button", { name: "generate" }).click();

    const fatalErrorsAlert = page.locator("#validation-errors");
    await expect(fatalErrorsAlert).not.toBeVisible();

    const copyTitleButton = page.getByRole("button", { name: "Copy Title" });
    const pageOutput = page.locator("#page-output");

    await expect(copyTitleButton).toBeVisible();
    await expect(pageOutput).toBeVisible();
    await pageOutput.scrollIntoViewIfNeeded();

    await expect(copyTitleButton).toHaveText("过得好 (Guò dé Hǎo)");
    await expect(pageOutput).toHaveValue(`{{sort}}
{{Infobox Song
|songtitle = "'''过得好'''"<br />Traditional Chinese: 過得好<br />Pinyin: Guò dé Hǎo<br />English: Doing Well
|color = #751d1d; color:#d0d3ce
|original upload date = {{Date|2013|January|3}}
|singer = [[Luo Tianyi (VOCALOID)]]
|producer = [[李]] (music)<br />[[苏]] (lyrics)
|#views = 5,000+
|link = {{#|https://www.youtube.com/watch?v=12345678901}}
|description = This is a demo song.
|language = Mandarin
}}

==Lyrics==
{{lyrics toggle|cn:Mandarin|py:Pinyin|eng:English}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|ABCD
|}
{{Translator|Anonymous}}

[[Category:李 songs list]]
[[Category:苏 songs list/Lyrics]]`);

    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/songs/chinese-alt-trad-title.png`,
      fullPage: true,
    });
  });

  test("should output a page for Chinese songs with alt Simplified Chinese title", async ({
    page,
  }, { project: { name: browser } }) => {
    const form = getFormLocator(page);

    /* Language & ISO Code */
    await form.getByRole("combobox", { name: "Song Language" }).click();
    await form.getByRole("option", { name: "Mandarin" }).click();
    await page.keyboard.press("Escape");
    await form.getByRole("textbox", { name: "Language ISO Code" }).click();
    await form.getByRole("textbox", { name: "Language ISO Code" }).fill("zh-Hans");

    /* Titles */
    await form.getByRole("textbox", { name: "Original Title" }).click();
    await form.getByRole("textbox", { name: "Original Title" }).fill("過得好");
    await expect(form.getByRole("textbox", { name: "Traditional Chinese Title" })).toBeVisible();
    await form.getByRole("textbox", { name: "Traditional Chinese Title" }).click();
    await form.getByRole("textbox", { name: "Traditional Chinese Title" }).fill("过得好");
    const toggle = form.locator(".swap").filter({ hasText: "繁⇔简 简⇔繁" });
    await toggle.click();
    await expect(toggle.locator('input[type="checkbox"]')).not.toBeChecked();
    await form.getByRole("textbox", { name: "Transliterated Title" }).click();
    await form.getByRole("textbox", { name: "Transliterated Title" }).fill("Guò dé Hǎo");
    await form.getByRole("textbox", { name: "Translated Title" }).click();
    await form.getByRole("textbox", { name: "Translated Title" }).fill("Doing Well");

    /* Colours */
    await page.locator('#infobox-bg-color-picker input[type="color"]').fill("#751d1d");
    await page.locator('#infobox-fg-color-picker input[type="color"]').fill("#d0d3ce");

    /* General information */
    await form.getByRole("textbox", { name: "Upload Date" }).fill("2013-01-03");
    await form.getByRole("textbox", { name: "Singer(s)" }).click();
    await form.getByRole("textbox", { name: "Singer(s)" }).fill("[[Luo Tianyi (VOCALOID)]]");
    await form.getByRole("textbox", { name: "Producer(s)" }).click();
    await form
      .getByRole("textbox", { name: "Producer(s)" })
      .fill("[[李]] (music)\n[[苏]] (lyrics)");
    await form.getByRole("textbox", { name: "Description" }).click();
    await form.getByRole("textbox", { name: "Description" }).fill("This is a demo song.");

    /* Broadcast links */
    {
      const broadcastLinksTable = getHandsontableInstance(form, "broadcast-links");
      const data = [
        {
          i: {
            url: "https://youtu.be/12345678901",
            viewCount: "5,000+",
          },
          o: {
            site: /YouTube/,
            url: /^https:\/\/www\.youtube\.com\/watch\?v=12345678901$/,
          },
        },
      ];
      await fillBroadcastLinksTable(broadcastLinksTable, data);
      await removeHandsontableRows(page, broadcastLinksTable, data.length);
    }

    /* Lyrics */
    {
      const lyricsTable = getHandsontableInstance(form, "lyrics");
      const data = [{ original: "あいうえお", romanized: "aiueo", english: "ABCD" }];
      await fillLyricsTable(lyricsTable, data);
      await removeHandsontableRows(page, lyricsTable, data.length);
    }

    await form.getByRole("button", { name: "autoload" }).click();
    await expect(form.getByRole("textbox", { name: "categories" })).toHaveValue(
      "李 songs list\n苏 songs list/Lyrics",
    );

    await form.getByRole("button", { name: "generate" }).click();

    const fatalErrorsAlert = page.locator("#validation-errors");
    await expect(fatalErrorsAlert).not.toBeVisible();

    const copyTitleButton = page.getByRole("button", { name: "Copy Title" });
    const pageOutput = page.locator("#page-output");

    await expect(copyTitleButton).toBeVisible();
    await expect(pageOutput).toBeVisible();
    await pageOutput.scrollIntoViewIfNeeded();

    await expect(copyTitleButton).toHaveText("過得好 (Guò dé Hǎo)");
    await expect(pageOutput).toHaveValue(`{{sort}}
{{Infobox Song
|songtitle = "'''過得好'''"<br />Simplified Chinese: 过得好<br />Pinyin: Guò dé Hǎo<br />English: Doing Well
|color = #751d1d; color:#d0d3ce
|original upload date = {{Date|2013|January|3}}
|singer = [[Luo Tianyi (VOCALOID)]]
|producer = [[李]] (music)<br />[[苏]] (lyrics)
|#views = 5,000+
|link = {{#|https://www.youtube.com/watch?v=12345678901}}
|description = This is a demo song.
|language = Mandarin
}}

==Lyrics==
{{lyrics toggle|cn:Mandarin|py:Pinyin|eng:English}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|ABCD
|}
{{Translator|Anonymous}}

[[Category:李 songs list]]
[[Category:苏 songs list/Lyrics]]`);

    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/songs/chinese-alt-simp-title.png`,
      fullPage: true,
    });
  });

  test("should output a page for Indonesian songs", async ({ page }, {
    project: { name: browser },
  }) => {
    const form = getFormLocator(page);

    /* Language & ISO Code */
    await form.getByRole("combobox", { name: "Song Language" }).click();
    const romanizedTitle = form.getByPlaceholder("Romanized title");
    await expect(romanizedTitle).toBeVisible();
    await form.getByRole("option", { name: "Indonesian" }).click();
    await page.keyboard.press("Escape");
    await expect(romanizedTitle).not.toBeVisible();
    await form.getByRole("textbox", { name: "Language ISO Code" }).click();
    await form.getByRole("textbox", { name: "Language ISO Code" }).fill("id");

    /* Titles */
    await form.getByRole("textbox", { name: "Original Title" }).click();
    await form.getByRole("textbox", { name: "Original Title" }).fill("Bengawan Solo");
    await form.getByRole("textbox", { name: "Translated Title" }).click();
    await form.getByRole("textbox", { name: "Translated Title" }).fill("Solo River");
    await form.getByRole("checkbox", { name: "Is an official title?" }).click();

    /* Colours */
    await page.locator('#infobox-bg-color-picker input[type="color"]').fill("#474747");
    await page.locator('#infobox-fg-color-picker input[type="color"]').fill("#cccccc");

    /* General information */
    await form.getByRole("textbox", { name: "Upload Date" }).fill("2012-12-28");
    await form.getByRole("textbox", { name: "Singer(s)" }).click();
    await form
      .getByRole("textbox", { name: "Singer(s)" })
      .fill("[[Hatsune Miku (VOCALOID)]]\n<small><[[Kagamine Rin (VOCALOID)]]/small>");
    await form.getByRole("textbox", { name: "Producer(s)" }).click();
    await form
      .getByRole("textbox", { name: "Producer(s)" })
      .fill("[[Budi Purnomo]] (music, lyrics)");
    await form.getByRole("textbox", { name: "Description" }).click();
    await form
      .getByRole("textbox", { name: "Description" })
      .fill("This is an Indonesian song of well regard.");

    /* Broadcast links */
    {
      const broadcastLinksTable = getHandsontableInstance(form, "broadcast-links");
      const data = [
        {
          i: {
            url: "https://youtu.be/12345678901",
            viewCount: "1000",
            isDeleted: true,
            isAutogen: false,
            isReprint: false,
          },
          o: {
            site: /YouTube/,
            url: /^https:\/\/www\.youtube\.com\/watch\?v=12345678901$/,
          },
        },
        {
          i: {
            url: "https://youtu.be/12345678902",
            viewCount: "3000",
            isDeleted: false,
            isAutogen: true,
            isReprint: false,
          },
          o: {
            site: /YouTube/,
            url: /^https:\/\/www\.youtube\.com\/watch\?v=12345678902$/,
          },
        },
        {
          i: {
            url: "https://youtu.be/12345678903",
            viewCount: "2000",
            isDeleted: false,
            isAutogen: false,
            isReprint: true,
          },
          o: {
            site: /YouTube/,
            url: /^https:\/\/www\.youtube\.com\/watch\?v=12345678903$/,
          },
        },
      ];
      await fillBroadcastLinksTable(broadcastLinksTable, data);
      await removeHandsontableRows(page, broadcastLinksTable, data.length);
    }

    /* Lyrics */
    {
      const lyricsTable = getHandsontableInstance(form, "lyrics");

      // Number of inputtable columns should shrink to 3
      await assertTableColumnNumber(lyricsTable, 3);

      const data = [
        {
          customStyle: "color:red;",
          original: "aiueo",
          english: "ABCD",
        },
        {
          customStyle: "",
          original: "kakikukeko",
          english: "EFGH",
        },
        {
          customStyle: "",
          original: "sasisuseso",
          english: "IJKL",
        },
        {
          customStyle: "",
          original: "",
          english: "",
        },
        {
          customStyle: "",
          original: "SHOUT!",
          english: "SHOUT!",
        },
      ];
      await fillLyricsTable(lyricsTable, data, { needsRomanization: false });
      await removeHandsontableRows(page, lyricsTable, data.length);
    }

    await form.getByRole("button", { name: "Autoload" }).click();
    await expect(form.getByRole("textbox", { name: "Categories" })).toHaveValue(
      "Budi Purnomo songs list",
    );

    await form.getByRole("button", { name: "Generate" }).click();

    const fatalErrorsAlert = page.locator("#validation-errors");
    await expect(fatalErrorsAlert).not.toBeVisible();

    const copyTitleButton = page.getByRole("button", { name: "Copy Title" });
    const pageOutput = page.locator("#page-output");

    await expect(copyTitleButton).toBeVisible();
    await expect(pageOutput).toBeVisible();
    await pageOutput.scrollIntoViewIfNeeded();

    await expect(copyTitleButton).toHaveText("Bengawan Solo");
    await expect(pageOutput).toHaveValue(`{{Infobox Song
|songtitle = "'''Bengawan Solo'''"<br />Official English: Solo River
|color = #474747; color:#cccccc
|original upload date = {{Date|2012|December|28}}
|singer = [[Hatsune Miku (VOCALOID)]]<br /><small><[[Kagamine Rin (VOCALOID)]]/small>
|producer = [[Budi Purnomo]] (music, lyrics)
|#views = 1,000+ (YT), 3,000+ (YT)
|link = {{#|https://www.youtube.com/watch?v=12345678901|label=deleted}} {{#|https://www.youtube.com/watch?v=12345678902|auto=y}} {{#|https://www.youtube.com/watch?v=12345678903|label=reprint}}
|description = This is an Indonesian song of well regard.
|language = Indonesian
}}

==Lyrics==
{{lyrics toggle|id:Indonesian|eng:English}}
{| border="1" cellpadding="4" style="border-collapse:collapse; border:1px groove; line-height:1.5"
!style="background-color:#474747; color:#cccccc;"|Singer
|<span style="color:red;">Singer</span>
|All
|}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|- style="color:red;"
|aiueo
|ABCD
|-
|kakikukeko
|EFGH
|-
|sasisuseso
|IJKL
|-
|<br />
|-
| {{shared}} SHOUT!
|}
{{Translator|Anonymous}}

[[Category:Budi Purnomo songs list]]`);

    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/songs/indonesian.png`,
      fullPage: true,
    });
  });

  test("should output a page for Indonesian songs without a translation", async ({ page }, {
    project: { name: browser },
  }) => {
    const form = getFormLocator(page);

    /* Language & ISO Code */
    await form.getByRole("combobox", { name: "Song Language" }).click();
    const romanizedTitle = form.getByPlaceholder("Romanized title");
    await expect(romanizedTitle).toBeVisible();
    await form.getByRole("option", { name: "Indonesian" }).click();
    await page.keyboard.press("Escape");
    await expect(romanizedTitle).not.toBeVisible();
    await form.getByRole("textbox", { name: "Language ISO Code" }).click();
    await form.getByRole("textbox", { name: "Language ISO Code" }).fill("id");

    /* Titles */
    await form.getByRole("textbox", { name: "Original Title" }).click();
    await form.getByRole("textbox", { name: "Original Title" }).fill("Bengawan Solo");
    await form.getByRole("textbox", { name: "Translated Title" }).click();
    await form.getByRole("textbox", { name: "Translated Title" }).fill("Solo River");
    await form.getByRole("checkbox", { name: "Is an official title?" }).click();

    /* Colours */
    await page.locator('#infobox-bg-color-picker input[type="color"]').fill("#474747");
    await page.locator('#infobox-fg-color-picker input[type="color"]').fill("#cccccc");

    /* General information */
    await form.getByRole("textbox", { name: "Upload Date" }).fill("2012-12-28");
    await form.getByRole("textbox", { name: "Singer(s)" }).click();
    await form
      .getByRole("textbox", { name: "Singer(s)" })
      .fill("[[Hatsune Miku (VOCALOID)]]\n<small><[[Kagamine Rin (VOCALOID)]]/small>");
    await form.getByRole("textbox", { name: "Producer(s)" }).click();
    await form
      .getByRole("textbox", { name: "Producer(s)" })
      .fill("[[Budi Purnomo]] (music, lyrics)");
    await form.getByRole("textbox", { name: "Description" }).click();
    await form
      .getByRole("textbox", { name: "Description" })
      .fill("This is an Indonesian song of well regard.");

    /* Broadcast links */
    {
      const broadcastLinksTable = getHandsontableInstance(form, "broadcast-links");
      const data = [
        {
          i: {
            url: "https://youtu.be/12345678901",
            viewCount: "1000",
          },
          o: {
            site: /YouTube/,
            url: /^https:\/\/www\.youtube\.com\/watch\?v=12345678901$/,
          },
        },
      ];
      await fillBroadcastLinksTable(broadcastLinksTable, data);
      await removeHandsontableRows(page, broadcastLinksTable, data.length);
    }

    /* Lyrics */
    {
      const lyricsTable = getHandsontableInstance(form, "lyrics");

      // Number of inputtable columns should shrink to 3
      await assertTableColumnNumber(lyricsTable, 3);

      const data = [
        {
          customStyle: "color:red;",
          original: "aiueo",
          english: "",
        },
        {
          customStyle: "",
          original: "kakikukeko",
          english: "",
        },
        {
          customStyle: "",
          original: "sasisuseso",
          english: "",
        },
        {
          customStyle: "",
          original: "",
          english: "",
        },
        {
          customStyle: "",
          original: "SHOUT!",
          english: "",
        },
      ];
      await fillLyricsTable(lyricsTable, data, { needsRomanization: false });
      await removeHandsontableRows(page, lyricsTable, data.length);
    }

    await form.getByRole("button", { name: "Autoload" }).click();
    await expect(form.getByRole("textbox", { name: "Categories" })).toHaveValue(
      "Budi Purnomo songs list",
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

    await expect(copyTitleButton).toHaveText("Bengawan Solo");
    await expect(pageOutput).toHaveValue(`{{Infobox Song
|songtitle = "'''Bengawan Solo'''"<br />Official English: Solo River
|color = #474747; color:#cccccc
|original upload date = {{Date|2012|December|28}}
|singer = [[Hatsune Miku (VOCALOID)]]<br /><small><[[Kagamine Rin (VOCALOID)]]/small>
|producer = [[Budi Purnomo]] (music, lyrics)
|#views = 1,000+
|link = {{#|https://www.youtube.com/watch?v=12345678901}}
|description = This is an Indonesian song of well regard.
|language = Indonesian
}}

==Lyrics==
{{lyrics toggle|id:Indonesian}}
{| border="1" cellpadding="4" style="border-collapse:collapse; border:1px groove; line-height:1.5"
!style="background-color:#474747; color:#cccccc;"|Singer
|<span style="color:red;">Singer</span>
|All
|}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|- style="color:red;"
|aiueo
|-
|kakikukeko
|-
|sasisuseso
|-
|<br />
|-
|SHOUT!
|}

[[Category:Budi Purnomo songs list]]`);

    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/songs/indonesian-no-tl.png`,
      fullPage: true,
    });
  });

  test("should output a page for English songs", async ({ page }, {
    project: { name: browser },
  }) => {
    const form = getFormLocator(page);

    /* Language & ISO Code */
    await form.getByRole("combobox", { name: "Song Language" }).click();
    const romanizedTitle = form.getByPlaceholder("Romanized title");
    const englishTitle = form.getByPlaceholder("English title");
    await expect(romanizedTitle).toBeVisible();
    await expect(englishTitle).toBeVisible();
    await form.getByRole("option", { name: "English" }).click();
    await page.keyboard.press("Escape");
    await expect(romanizedTitle).not.toBeVisible();
    await expect(englishTitle).not.toBeVisible();
    await form.getByRole("textbox", { name: "Language ISO Code" }).click();
    await form.getByRole("textbox", { name: "Language ISO Code" }).fill("id");

    /* Titles */
    await form.getByRole("textbox", { name: "Original Title" }).click();
    await form.getByRole("textbox", { name: "Original Title" }).fill("ECHO the World");

    /* Colours */
    await page.locator('#infobox-bg-color-picker input[type="color"]').fill("#474747");
    await page.locator('#infobox-fg-color-picker input[type="color"]').fill("#cccccc");

    /* General information */
    await form.getByRole("textbox", { name: "Upload Date" }).fill("2012-12-28");
    await form.getByRole("textbox", { name: "Singer(s)" }).click();
    await form.getByRole("textbox", { name: "Singer(s)" }).fill("[[Hatsune Miku (VOCALOID)]]");
    await form.getByRole("textbox", { name: "Producer(s)" }).click();
    await form.getByRole("textbox", { name: "Producer(s)" }).fill("[[Jane Doe]] (music, lyrics)");
    await form.getByRole("textbox", { name: "Description" }).click();
    await form.getByRole("textbox", { name: "Description" }).fill("A song by J.Doe");

    /* Broadcast links */
    {
      const broadcastLinksTable = getHandsontableInstance(form, "broadcast-links");
      const data = [
        {
          i: {
            url: "https://youtu.be/12345678901",
            viewCount: "1000",
          },
          o: {
            site: /YouTube/,
            url: /^https:\/\/www\.youtube\.com\/watch\?v=12345678901$/,
          },
        },
      ];
      await fillBroadcastLinksTable(broadcastLinksTable, data);
      await removeHandsontableRows(page, broadcastLinksTable, data.length);
    }

    /* Lyrics */
    {
      const lyricsTable = getHandsontableInstance(form, "lyrics");

      // Number of inputtable columns should shrink to 2
      await assertTableColumnNumber(lyricsTable, 2);

      const data = [
        {
          customStyle: "",
          original: "ABCD",
        },
        {
          customStyle: "",
          original: "EFGH",
        },
        {
          customStyle: "",
          original: "IJKL",
        },
        {
          customStyle: "",
          original: "",
          english: "",
        },
        {
          customStyle: "color:red;",
          original: "ABCD",
        },
        {
          customStyle: "color:red;",
          original: "EFGH",
        },
        {
          customStyle: "color:yellow;",
          original: "IJKL",
        },
      ];
      await fillLyricsTable(lyricsTable, data, {
        needsRomanization: false,
        needsTranslation: false,
      });
      await removeHandsontableRows(page, lyricsTable, data.length);
    }

    await form.getByRole("button", { name: "Autoload" }).click();
    await expect(form.getByRole("textbox", { name: "Categories" })).toHaveValue(
      "Jane Doe songs list",
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

    await expect(copyTitleButton).toHaveText("ECHO the World");
    await expect(pageOutput).toHaveValue(`{{Infobox Song
|songtitle = "'''ECHO the World'''"
|color = #474747; color:#cccccc
|original upload date = {{Date|2012|December|28}}
|singer = [[Hatsune Miku (VOCALOID)]]
|producer = [[Jane Doe]] (music, lyrics)
|#views = 1,000+
|link = {{#|https://www.youtube.com/watch?v=12345678901}}
|description = A song by J.Doe
|language = English
}}

==Lyrics==
{| border="1" cellpadding="4" style="border-collapse:collapse; border:1px groove; line-height:1.5"
!style="background-color:#474747; color:#cccccc;"|Singer
|<span style="color:red;">Singer</span>
|<span style="color:yellow;">Singer</span>
|All
|}
<poem>ABCD
EFGH
IJKL

<span style="color:red;">ABCD
EFGH</span>
<span style="color:yellow;">IJKL</span></poem>

[[Category:Jane Doe songs list]]`);

    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/songs/english.png`,
      fullPage: true,
    });
  });
});