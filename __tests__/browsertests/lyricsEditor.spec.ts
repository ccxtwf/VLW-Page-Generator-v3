import { test, expect, type Page, type Locator } from "@playwright/test";
import {
  assertTableRowNumber,
  assertTableColumnNumber,
  getHandsontableInstance,
  removeHandsontableColumn,
  insertHandsontableColumnToRight,
  fillTableAtColumn,
  fillTableAtRow,
  getSnapshotsDir,
} from "./utils";

test.describe("Lyrics editor tests", async () => {
  test.beforeEach(async ({ page }) => {
    const response = await page.goto("/#/lyrics-editor");
    expect(response?.ok()).toBe(true);
    await page.waitForLoadState("networkidle");
  });

  function getComponent(
    page: Page,
    component:
      | "lyrics-parser-form"
      | "lyrics-editor-form"
      | "lyrics-editor-table"
      | "parse-textbox"
      | "extract-lyrics-button"
      | "lyrics-toggle-input"
      | "translator-input"
      | "is-official-translation-input"
      | "generate-button"
      | "page-output",
  ): Locator {
    switch (component) {
      case "lyrics-parser-form":
        return page.locator('form[name="lyrics-parser"]');
      case "lyrics-editor-form":
        return page.locator('form[name="lyrics-generator"]');
      case "lyrics-editor-table":
        return getHandsontableInstance(getComponent(page, "lyrics-editor-form"), "lyrics");
      case "parse-textbox":
        return getComponent(page, "lyrics-parser-form").getByRole("textbox");
      case "extract-lyrics-button":
        return getComponent(page, "lyrics-parser-form").getByRole("button", {
          name: "Extract Lyrics Table",
        });
      case "lyrics-toggle-input":
        return getComponent(page, "lyrics-editor-form").getByRole("textbox", {
          name: "Lyrics Toggle Wikitext",
        });
      case "translator-input":
        return getComponent(page, "lyrics-editor-form").getByRole("textbox", {
          name: "Translator",
        });
      case "is-official-translation-input":
        return getComponent(page, "lyrics-editor-form").getByRole("checkbox", {
          name: "Is an official translation?",
        });
      case "generate-button":
        return getComponent(page, "lyrics-editor-form").getByRole("button", { name: "Generate" });
      case "page-output":
        return page.locator("#page-output")!;
    }
    throw new Error("Unreachable code");
  }

  test("Forms should be mounted", async ({ page }) => {
    const lyricsParserForm = getComponent(page, "lyrics-parser-form");
    await expect(lyricsParserForm).toBeVisible();

    const lyricsEditorForm = getComponent(page, "lyrics-editor-form");
    await expect(lyricsEditorForm).toBeVisible();
  });

  test("Handsontable tables should be loaded with initial data", async ({ page }) => {
    const table = getComponent(page, "lyrics-editor-table");
    await assertTableRowNumber(table, 20);
  });

  test("Should successfully parse a wikitable (with unofficial translation) and then serialize it back into wikitext", async ({
    page,
  }, { project: { name: browser } }) => {
    const parseTextbox = getComponent(page, "parse-textbox");
    const text = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|ABCDEFG
|-
|かきくけこ
|kakikukeko
|HIJKLMN
|}
{{Translator|John Doe}}`;
    await parseTextbox.fill(text);

    await getComponent(page, "extract-lyrics-button").click();

    const lyricsToggle = getComponent(page, "lyrics-toggle-input");
    const lyricsTable = getComponent(page, "lyrics-editor-table");
    const translator = getComponent(page, "translator-input");
    const isOfficialTranslation = getComponent(page, "is-official-translation-input");
    await expect(lyricsToggle).toHaveValue("{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}");
    await assertTableColumnNumber(lyricsTable, 4);
    await assertTableRowNumber(lyricsTable, 3);
    await expect(translator).toHaveValue("John Doe");
    await expect(isOfficialTranslation).not.toBeChecked();

    await getComponent(page, "generate-button").click();

    const pageOutput = getComponent(page, "page-output");
    await expect(pageOutput).toHaveValue(text);

    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/lyrics-editor/parse-and-serialize.png`,
      fullPage: true,
    });
  });

  test("Should successfully parse a wikitable (with official translation) and then serialize it back into wikitext", async ({
    page,
  }, { project: { name: browser } }) => {
    const parseTextbox = getComponent(page, "parse-textbox");
    const text = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}
{{OfficialEnglishNotify}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|ABCDEFG
|-
|かきくけこ
|kakikukeko
|HIJKLMN
|}
{{Translator|John Doe}}`;
    await parseTextbox.fill(text);

    await getComponent(page, "extract-lyrics-button").click();

    const lyricsToggle = getComponent(page, "lyrics-toggle-input");
    const lyricsTable = getComponent(page, "lyrics-editor-table");
    const translator = getComponent(page, "translator-input");
    const isOfficialTranslation = getComponent(page, "is-official-translation-input");
    await expect(lyricsToggle).toHaveValue("{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}");
    await assertTableColumnNumber(lyricsTable, 4);
    await assertTableRowNumber(lyricsTable, 3);
    await expect(translator).toHaveValue("John Doe");
    await expect(isOfficialTranslation).toBeChecked();

    await getComponent(page, "generate-button").click();

    const pageOutput = getComponent(page, "page-output");
    await expect(pageOutput).toHaveValue(text);

    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/lyrics-editor/parse-and-serialize-official-tl.png`,
      fullPage: true,
    });
  });

  test("Should successfully parse a wikitable from a page containing multiple wikitables", async ({
    page,
  }, { project: { name: browser } }) => {
    const parseTextbox = getComponent(page, "parse-textbox");

    const lyricsToggle = getComponent(page, "lyrics-toggle-input");
    const lyricsTable = getComponent(page, "lyrics-editor-table");
    const translator = getComponent(page, "translator-input");
    const isOfficialTranslation = getComponent(page, "is-official-translation-input");

    const pageOutput = getComponent(page, "page-output");

    const text = `<tabber>
Original =
{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|ABCDEFG
|-
|かきくけこ
|kakikukeko
|HIJKLMN
|}
{{Translator|John Doe}}
|-|
Remix =
{{lyrics toggle|org:Conlang|rom:Romanized|eng:English}}
{{OfficialEnglishNotify}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|さしすせそ
|sasisuseso
|abcdefgh
|-
|らりるれろ
|rarirurero
|ijklmn
|}
{{Translator|Jane Doe}}
</tabber>`;
    await parseTextbox.fill(text);

    // unfocus from text box
    await page.keyboard.press("Tab");

    const selector = getComponent(page, "lyrics-parser-form").getByRole("combobox");
    await expect(selector).toContainText("Showing table no. 1 out of 2");

    await getComponent(page, "extract-lyrics-button").click();

    await expect(lyricsToggle).toHaveValue("{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}");
    await assertTableColumnNumber(lyricsTable, 4);
    await assertTableRowNumber(lyricsTable, 3);
    await expect(translator).toHaveValue("John Doe");
    await expect(isOfficialTranslation).not.toBeChecked();

    await getComponent(page, "generate-button").click();

    const expected1 = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|ABCDEFG
|-
|かきくけこ
|kakikukeko
|HIJKLMN
|}
{{Translator|John Doe}}`;
    await expect(pageOutput).toHaveValue(expected1);

    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/lyrics-editor/parse-and-serialize-multiple-1.png`,
      fullPage: true,
    });

    await selector.selectOption("1");
    await expect(selector).toContainText("Showing table no. 2 out of 2");

    await getComponent(page, "extract-lyrics-button").click();

    await expect(lyricsToggle).toHaveValue(
      "{{lyrics toggle|org:Conlang|rom:Romanized|eng:English}}",
    );
    await assertTableColumnNumber(lyricsTable, 4);
    await assertTableRowNumber(lyricsTable, 3);
    await expect(translator).toHaveValue("Jane Doe");
    await expect(isOfficialTranslation).toBeChecked();

    await getComponent(page, "generate-button").click();

    const expected2 = `{{lyrics toggle|org:Conlang|rom:Romanized|eng:English}}
{{OfficialEnglishNotify}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|さしすせそ
|sasisuseso
|abcdefgh
|-
|らりるれろ
|rarirurero
|ijklmn
|}
{{Translator|Jane Doe}}`;
    await expect(pageOutput).toHaveValue(expected2);

    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/lyrics-editor/parse-and-serialize-multiple-2.png`,
      fullPage: true,
    });
  });

  test("Should successfully remove a column at end", async ({ page }, {
    project: { name: browser },
  }) => {
    const parseTextbox = getComponent(page, "parse-textbox");
    const text = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|ABCDEFG
|-
|かきくけこ
|kakikukeko
|HIJKLMN
|}
{{Translator|John Doe}}`;
    await parseTextbox.fill(text);

    await getComponent(page, "extract-lyrics-button").click();

    const lyricsTable = getComponent(page, "lyrics-editor-table");
    await assertTableColumnNumber(lyricsTable, 4);
    await assertTableRowNumber(lyricsTable, 3);
    await removeHandsontableColumn(page, lyricsTable, 4);

    const lyricsToggle = getComponent(page, "lyrics-toggle-input");
    await expect(lyricsToggle).toHaveValue("{{lyrics toggle|jp:Japanese|rom:Romaji}}");
    await assertTableColumnNumber(lyricsTable, 3);
    await assertTableRowNumber(lyricsTable, 3);

    await getComponent(page, "generate-button").click();

    const pageOutput = getComponent(page, "page-output");
    const expected = `{{lyrics toggle|jp:Japanese|rom:Romaji}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|-
|かきくけこ
|kakikukeko
|}`;
    await expect(pageOutput).toHaveValue(expected);

    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/lyrics-editor/remove-column-end.png`,
      fullPage: true,
    });
  });

  test("Should successfully add a column at end", async ({ page }, {
    project: { name: browser },
  }) => {
    const parseTextbox = getComponent(page, "parse-textbox");
    const text = `{{lyrics toggle|jp:Japanese|rom:Romaji}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|-
|かきくけこ
|kakikukeko
|}`;
    await parseTextbox.fill(text);

    await getComponent(page, "extract-lyrics-button").click();

    const lyricsTable = getComponent(page, "lyrics-editor-table");
    await assertTableColumnNumber(lyricsTable, 3);
    await assertTableRowNumber(lyricsTable, 3);
    await insertHandsontableColumnToRight(page, lyricsTable, 3);

    await fillTableAtColumn(lyricsTable, 4, ["ABCD", "EFGH"]);

    const translator = getComponent(page, "translator-input");
    const isOfficialTranslation = getComponent(page, "is-official-translation-input");
    await translator.fill("John Doe");
    await expect(translator).toHaveValue("John Doe");
    await expect(isOfficialTranslation).not.toBeChecked();

    const lyricsToggle = getComponent(page, "lyrics-toggle-input");
    await expect(lyricsToggle).toHaveValue(
      "{{lyrics toggle|jp:Japanese|rom:Romaji|col1:Column 1}}",
    );
    await assertTableColumnNumber(lyricsTable, 4);
    await assertTableRowNumber(lyricsTable, 3);

    await lyricsToggle.fill("{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}");
    await assertTableColumnNumber(lyricsTable, 4);
    await assertTableRowNumber(lyricsTable, 3);

    await getComponent(page, "generate-button").click();

    const pageOutput = getComponent(page, "page-output");
    const expected = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|ABCD
|-
|かきくけこ
|kakikukeko
|EFGH
|}
{{Translator|John Doe}}`;
    await expect(pageOutput).toHaveValue(expected);

    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/lyrics-editor/add-column-end.png`,
      fullPage: true,
    });
  });

  test("Should successfully add a row at end", async ({ page }, { project: { name: browser } }) => {
    const parseTextbox = getComponent(page, "parse-textbox");
    const text = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|ABCD
|-
|かきくけこ
|kakikukeko
|EFGH
|}
{{Translator|John Doe}}`;
    await parseTextbox.fill(text);

    await getComponent(page, "extract-lyrics-button").click();

    const lyricsTable = getComponent(page, "lyrics-editor-table");
    await assertTableColumnNumber(lyricsTable, 4);
    await assertTableRowNumber(lyricsTable, 3);
    await fillTableAtRow(lyricsTable, 3, ["", "らりるれろ", "rarirurero", "IJKL"]);
    await assertTableColumnNumber(lyricsTable, 4);
    await assertTableRowNumber(lyricsTable, 4);

    const lyricsToggle = getComponent(page, "lyrics-toggle-input");
    await expect(lyricsToggle).toHaveValue("{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}");
    const translator = getComponent(page, "translator-input");
    const isOfficialTranslation = getComponent(page, "is-official-translation-input");
    await expect(translator).toHaveValue("John Doe");
    await expect(isOfficialTranslation).not.toBeChecked();

    await getComponent(page, "generate-button").click();

    const pageOutput = getComponent(page, "page-output");
    const expected = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|ABCD
|-
|かきくけこ
|kakikukeko
|EFGH
|-
|らりるれろ
|rarirurero
|IJKL
|}
{{Translator|John Doe}}`;
    await expect(pageOutput).toHaveValue(expected);

    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/lyrics-editor/add-row-end.png`,
      fullPage: true,
    });
  });

  test("Should be able to decapitalize romanized lyrics", async ({ page }, {
    project: { name: browser },
  }) => {
    const parseTextbox = getComponent(page, "parse-textbox");
    const text = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|- style="color:yellow;"
|あいうえお あいうえお
|Aiueo aiueo
|ABCDEFG
|-
|かきくけこ かきくけこ
|Kakikukeko Kakikukeko
|HIJKLMN
|-
|庭には二羽鶏がいるの？庭にいるんですよ。そう、
|Niwa ni wa niwatori ga iru no? Niwa ni irun desu yo. Sou,
|OPQRST
|}
{{Translator|John Doe}}`;
    await parseTextbox.fill(text);

    await getComponent(page, "extract-lyrics-button").click();

    const lyricsToggle = getComponent(page, "lyrics-toggle-input");
    const lyricsTable = getComponent(page, "lyrics-editor-table");
    await expect(lyricsToggle).toHaveValue("{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}");
    await assertTableColumnNumber(lyricsTable, 4);
    await assertTableRowNumber(lyricsTable, 4);

    await page.getByRole("button", { name: "Decapitalize romanized lyrics" }).click();

    await getComponent(page, "generate-button").click();

    const pageOutput = getComponent(page, "page-output");
    const expected = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}
{| border="1" cellpadding="4" style="border-collapse:collapse; border:1px groove; line-height:1.5"
!style="background-color:black; color:white;"|Singer
|<span style="color:yellow;">Singer</span>
|All
|}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|- style="color:yellow;"
|あいうえお あいうえお
|aiueo aiueo
|ABCDEFG
|-
|かきくけこ かきくけこ
|kakikukeko Kakikukeko
|HIJKLMN
|-
|庭には二羽鶏がいるの？庭にいるんですよ。そう、
|niwa ni wa niwatori ga iru no? niwa ni irun desu yo. sou,
|OPQRST
|}
{{Translator|John Doe}}`;
    await expect(pageOutput).toHaveValue(expected);

    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/lyrics-editor/action-decapitalize-romanized.png`,
      fullPage: true,
    });
  });

  test("Should successfully consolidate per-cell colour formatting", async ({ page }, {
    project: { name: browser },
  }) => {
    const parseTextbox = getComponent(page, "parse-textbox");
    const text = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|<span style="color:grey;">あいうえお</span>
|<span style="color:grey;">aiueo</span>
|<span style="color:grey;">ABCD</span>
|-
|<span style="color:yellow;">かきくけこ</span><span style="color:red">あいうえお</span>
|<span style="color:yellow;">kakikukeko</span><span style="color:red">aiueo</span>
|<span style="color:yellow;">EFGH</span><span style="color:red">ABCD</span>
|-
|<span style="color:yellow;">かきくけこ<span style="color:red">あいうえお</span></span>
|<span style="color:yellow;">kakikukeko<span style="color:red">aiueo</span></span>
|<span style="color:yellow;">EFGH<span style="color:red">ABCD</span></span>
|-
|かきくけこ
|kakikukeko
|HIJKLMN
|}
{{Translator|John Doe}}`;
    await parseTextbox.fill(text);

    await getComponent(page, "extract-lyrics-button").click();

    const lyricsToggle = getComponent(page, "lyrics-toggle-input");
    const lyricsTable = getComponent(page, "lyrics-editor-table");
    await expect(lyricsToggle).toHaveValue("{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}");
    await assertTableColumnNumber(lyricsTable, 4);
    await assertTableRowNumber(lyricsTable, 5);

    await page.getByRole("button", { name: "Consolidate per-cell span" }).click();

    await getComponent(page, "generate-button").click();

    const pageOutput = getComponent(page, "page-output");
    const expected = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}
{| border="1" cellpadding="4" style="border-collapse:collapse; border:1px groove; line-height:1.5"
!style="background-color:black; color:white;"|Singer
|<span style="color:grey;">Singer</span>
|<span style="color:yellow;">Singer</span>
|<span style="color:red;">Singer</span>
|All
|}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|- style="color:grey;"
|あいうえお
|aiueo
|ABCD
|-
|<span style="color:yellow;">かきくけこ</span><span style="color:red">あいうえお</span>
|<span style="color:yellow;">kakikukeko</span><span style="color:red">aiueo</span>
|<span style="color:yellow;">EFGH</span><span style="color:red">ABCD</span>
|-
|<span style="color:yellow;">かきくけこ<span style="color:red">あいうえお</span></span>
|<span style="color:yellow;">kakikukeko<span style="color:red">aiueo</span></span>
|<span style="color:yellow;">EFGH<span style="color:red">ABCD</span></span>
|-
|かきくけこ
|kakikukeko
|HIJKLMN
|}
{{Translator|John Doe}}`;
    await expect(pageOutput).toHaveValue(expected);

    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/lyrics-editor/action-consolidate-formatting.png`,
      fullPage: true,
    });
  });

  test("Should be able to standardize Hepburn romanization", async ({ page }, {
    project: { name: browser },
  }) => {
    const parseTextbox = getComponent(page, "parse-textbox");
    const text = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|- style="color:yellow;"
|命がずっと続くのさ。
|inochi ga zutto tsudzuku no sa.
|ABCDEFG
|-
|夢の彼方へ
|yume no kanata he
|HIJKLMN
|-
|思い出を！
|omoide wo!
|OPQRST
|}
{{Translator|John Doe}}`;
    await parseTextbox.fill(text);

    await getComponent(page, "extract-lyrics-button").click();

    const lyricsToggle = getComponent(page, "lyrics-toggle-input");
    const lyricsTable = getComponent(page, "lyrics-editor-table");
    await expect(lyricsToggle).toHaveValue("{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}");
    await assertTableColumnNumber(lyricsTable, 4);
    await assertTableRowNumber(lyricsTable, 4);

    await page.getByRole("button", { name: "Romaji: Change 'wo' to 'o'" }).click();

    await getComponent(page, "generate-button").click();

    const pageOutput = getComponent(page, "page-output");
    const expected = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}
{| border="1" cellpadding="4" style="border-collapse:collapse; border:1px groove; line-height:1.5"
!style="background-color:black; color:white;"|Singer
|<span style="color:yellow;">Singer</span>
|All
|}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|- style="color:yellow;"
|命がずっと続くのさ。
|inochi ga zutto tsuzuku no sa.
|ABCDEFG
|-
|夢の彼方へ
|yume no kanata e
|HIJKLMN
|-
|思い出を！
|omoide o!
|OPQRST
|}
{{Translator|John Doe}}`;
    await expect(pageOutput).toHaveValue(expected);

    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/lyrics-editor/action-standardize-Hepburn.png`,
      fullPage: true,
    });
  });

  test("Should be able to detone Pinyin lyrics", async ({ page }, {
    project: { name: browser },
  }) => {
    const parseTextbox = getComponent(page, "parse-textbox");
    const text = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|- style="color:yellow;"
|好一朵美丽的茉莉花
|hǎo yī duǒ měilì de mòlihuā
|ABCDEFG
|-
|芬芳美丽满枝桠
|fēn fāng měilì mǎn zhī yā
|HIJKLMN
|-
|又香又白人人夸
|yòu xiāng yòu bái rén rén kuā
|OPQRST
|-
|女娲补天
|Nǚ wā bǔ tiān
|UVWXYZ
|}
{{Translator|John Doe}}`;
    await parseTextbox.fill(text);

    await getComponent(page, "extract-lyrics-button").click();

    const lyricsToggle = getComponent(page, "lyrics-toggle-input");
    const lyricsTable = getComponent(page, "lyrics-editor-table");
    await expect(lyricsToggle).toHaveValue("{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}");
    await assertTableColumnNumber(lyricsTable, 4);
    await assertTableRowNumber(lyricsTable, 5);

    await page.getByRole("button", { name: "Pinyin: Remove Tones" }).click();

    await getComponent(page, "generate-button").click();

    const pageOutput = getComponent(page, "page-output");
    const expected = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}
{| border="1" cellpadding="4" style="border-collapse:collapse; border:1px groove; line-height:1.5"
!style="background-color:black; color:white;"|Singer
|<span style="color:yellow;">Singer</span>
|All
|}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|- style="color:yellow;"
|好一朵美丽的茉莉花
|hao yi duo meili de molihua
|ABCDEFG
|-
|芬芳美丽满枝桠
|fen fang meili man zhi ya
|HIJKLMN
|-
|又香又白人人夸
|you xiang you bai ren ren kua
|OPQRST
|-
|女娲补天
|Nü wa bu tian
|UVWXYZ
|}
{{Translator|John Doe}}`;
    await expect(pageOutput).toHaveValue(expected);

    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/lyrics-editor/action-detone-pinyin.png`,
      fullPage: true,
    });
  });
});