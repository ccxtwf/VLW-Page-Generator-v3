import { beforeEach, describe, expect, test, TestContext } from "vite-plus/test";
import { userEvent } from "vite-plus/test/browser";
import { render, RenderResult } from "vitest-browser-svelte";
import {
  getContextMenu,
  getContextMenuItem,
  getHtWrapper,
  summonContextMenu,
  checkColHeadersEquality,
  checkTableContentsEquality,
} from "./utils";

import LyricsTable from "#src/lib/components/handsontables/LyricsTable.svelte";
import LyricRow from "#src/lib/models/children/LyricsRow.svelte.ts";

interface LocalTestContext extends TestContext {
  page: RenderResult<LyricsTable, never>;
}

describe("LyricsTable component tests - base tests", () => {
  test("successfully load table with no data", async () => {
    const page = await render(LyricsTable, {
      id: "lyrics",
      class: "vlw-custom-class",
      data: [],
    });
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
  });

  test("table should be wrapped in a div", async () => {
    const page = await render(LyricsTable, {
      id: "lyrics",
      class: "vlw-custom-class",
      data: [],
    });
    const wrapper = page.baseElement.querySelector("#lyrics");
    expect(wrapper).not.toBeNull();
    expect(wrapper).toHaveClass("vlw-custom-class");
    const table = getHtWrapper(wrapper as HTMLElement);
    expect(table).not.toBeNull();
  });

  test("successfully load table with starting data", async () => {
    const page = await render(LyricsTable, {
      id: "lyrics",
      class: "vlw-custom-class",
      languageMetadata: {
        headers: ["Original", "Romanized", "English"],
        needsRomanization: true,
        needsTranslation: true,
        isChinese: false,
        isoLangCode: null,
      },
      data: [
        ["", "foo", "ABC", "year"],
        ["", "bar", "DEF", "month"],
        ["", "baz", "GHI", "day"],
      ],
    });

    /* Initial assertions */
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();

    /* Check displayed column headers */
    await checkColHeadersEquality(table, ["Custom style", "Original", "Romanized", "English"]);

    /* Check displayed data */
    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({ customStyle: "", original: "bar", romanized: "DEF", english: "month" }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });
});

describe("LyricsTable context menu - base tests", () => {
  beforeEach<LocalTestContext>(async (context) => {
    const page = await render(LyricsTable, {
      id: "lyrics",
      class: "vlw-custom-class",
      languageMetadata: {
        headers: ["Original", "Romanized", "English"],
        needsRomanization: true,
        needsTranslation: true,
        isChinese: false,
        isoLangCode: null,
      },
      data: [
        ["", "foo", "ABC", "year"],
        ["", "bar", "DEF", "month"],
        ["", "baz", "GHI", "day"],
      ],
    });
    context.page = page;
  });

  test("context menu should appear when the top left cell handle is selected", async ({
    page,
  }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table);
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();
  });

  test("context menu should appear when a row header cell is selected", async ({
    page,
  }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { row: 1 });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();
  });

  test("context menu should appear when a column header cell is selected", async ({
    page,
  }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { col: 1 });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();
  });

  test("context menu should appear when a cell is selected", async ({ page }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { row: 2, col: 1 });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();
  });

  test("context menu should contain selected items", async ({ page }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { row: 1 });
    const contextMenu = getContextMenu(page.baseElement);
    const roleItems = Array.from(contextMenu.querySelectorAll('[role="menuitem"]'))
      .map((el) => el.textContent)
      .filter((s) => s);
    expect(roleItems).toMatchObject([
      "Copy",
      "Cut",
      "Paste",
      "Undo",
      "Redo",
      "Bold row(s)",
      "Italicize row(s)",
      "Insert row above",
      "Insert row below",
      "Remove row",
      "Clear column",
      "Reset table",
    ]);
  });
});

describe("LyricsTable context menu interactions - bold row", () => {
  beforeEach<LocalTestContext>(async (context) => {
    const page = await render(LyricsTable, {
      id: "lyrics",
      class: "vlw-custom-class",
      languageMetadata: {
        headers: ["Original", "Romanized", "English"],
        needsRomanization: true,
        needsTranslation: true,
        isChinese: false,
        isoLangCode: null,
      },
      data: [
        ["", "foo", "ABC", "year"],
        ["", "bar", "DEF", "month"],
        ["", "baz", "GHI", "day"],
      ],
    });
    context.page = page;
  });

  test("should successfully bold a row", async ({ page }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { row: 1 });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Bold row(s)")!);

    await checkTableContentsEquality(table, [
      ["bold;", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({
        customStyle: "font-weight: bold;",
        original: "foo",
        romanized: "ABC",
        english: "year",
      }),
      new LyricRow({ customStyle: "", original: "bar", romanized: "DEF", english: "month" }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });

  test("should successfully bold the table", async ({ page }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table);
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Bold row(s)")!);

    await checkTableContentsEquality(table, [
      ["bold;", "foo", "ABC", "year"],
      ["bold;", "bar", "DEF", "month"],
      ["bold;", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({
        customStyle: "font-weight: bold;",
        original: "foo",
        romanized: "ABC",
        english: "year",
      }),
      new LyricRow({
        customStyle: "font-weight: bold;",
        original: "bar",
        romanized: "DEF",
        english: "month",
      }),
      new LyricRow({
        customStyle: "font-weight: bold;",
        original: "baz",
        romanized: "GHI",
        english: "day",
      }),
      new LyricRow(),
    ]);
  });

  test("should successfully bold selected rows", async ({ page }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { rows: [1, 2] });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Bold row(s)")!);

    await checkTableContentsEquality(table, [
      ["bold;", "foo", "ABC", "year"],
      ["bold;", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({
        customStyle: "font-weight: bold;",
        original: "foo",
        romanized: "ABC",
        english: "year",
      }),
      new LyricRow({
        customStyle: "font-weight: bold;",
        original: "bar",
        romanized: "DEF",
        english: "month",
      }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });

  test('should successfully undo & redo action upon clicking "Undo" & "Redo" on the context menu', async ({
    page,
  }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table);
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Bold row(s)")!);

    await summonContextMenu(table);
    await userEvent.click(getContextMenuItem(contextMenu, "Undo")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({
        customStyle: "",
        original: "foo",
        romanized: "ABC",
        english: "year",
      }),
      new LyricRow({
        customStyle: "",
        original: "bar",
        romanized: "DEF",
        english: "month",
      }),
      new LyricRow({
        customStyle: "",
        original: "baz",
        romanized: "GHI",
        english: "day",
      }),
      new LyricRow(),
    ]);

    await summonContextMenu(table);
    await userEvent.click(getContextMenuItem(contextMenu, "Redo")!);

    await checkTableContentsEquality(table, [
      ["bold;", "foo", "ABC", "year"],
      ["bold;", "bar", "DEF", "month"],
      ["bold;", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({
        customStyle: "font-weight: bold;",
        original: "foo",
        romanized: "ABC",
        english: "year",
      }),
      new LyricRow({
        customStyle: "font-weight: bold;",
        original: "bar",
        romanized: "DEF",
        english: "month",
      }),
      new LyricRow({
        customStyle: "font-weight: bold;",
        original: "baz",
        romanized: "GHI",
        english: "day",
      }),
      new LyricRow(),
    ]);
  });

  test('should successfully undo & redo action upon clicking "Undo" & "Redo" on the context menu', async ({
    page,
  }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table);
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Bold row(s)")!);

    await userEvent.keyboard("{Control>}z{/Control}");

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({
        customStyle: "",
        original: "foo",
        romanized: "ABC",
        english: "year",
      }),
      new LyricRow({
        customStyle: "",
        original: "bar",
        romanized: "DEF",
        english: "month",
      }),
      new LyricRow({
        customStyle: "",
        original: "baz",
        romanized: "GHI",
        english: "day",
      }),
      new LyricRow(),
    ]);

    await userEvent.keyboard("{Control>}y{/Control}");

    await checkTableContentsEquality(table, [
      ["bold;", "foo", "ABC", "year"],
      ["bold;", "bar", "DEF", "month"],
      ["bold;", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({
        customStyle: "font-weight: bold;",
        original: "foo",
        romanized: "ABC",
        english: "year",
      }),
      new LyricRow({
        customStyle: "font-weight: bold;",
        original: "bar",
        romanized: "DEF",
        english: "month",
      }),
      new LyricRow({
        customStyle: "font-weight: bold;",
        original: "baz",
        romanized: "GHI",
        english: "day",
      }),
      new LyricRow(),
    ]);
  });
});

describe("LyricsTable context menu interactions - italicize row", () => {
  beforeEach<LocalTestContext>(async (context) => {
    const page = await render(LyricsTable, {
      id: "lyrics",
      class: "vlw-custom-class",
      languageMetadata: {
        headers: ["Original", "Romanized", "English"],
        needsRomanization: true,
        needsTranslation: true,
        isChinese: false,
        isoLangCode: null,
      },
      data: [
        ["", "foo", "ABC", "year"],
        ["", "bar", "DEF", "month"],
        ["", "baz", "GHI", "day"],
      ],
    });
    context.page = page;
  });

  test("should successfully italicize a row", async ({ page }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { row: 1 });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Italicize row(s)")!);

    await checkTableContentsEquality(table, [
      ["italic;", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({
        customStyle: "font-style: italic;",
        original: "foo",
        romanized: "ABC",
        english: "year",
      }),
      new LyricRow({ customStyle: "", original: "bar", romanized: "DEF", english: "month" }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });

  test("should successfully italicize the table", async ({ page }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table);
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Italicize row(s)")!);

    await checkTableContentsEquality(table, [
      ["italic;", "foo", "ABC", "year"],
      ["italic;", "bar", "DEF", "month"],
      ["italic;", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({
        customStyle: "font-style: italic;",
        original: "foo",
        romanized: "ABC",
        english: "year",
      }),
      new LyricRow({
        customStyle: "font-style: italic;",
        original: "bar",
        romanized: "DEF",
        english: "month",
      }),
      new LyricRow({
        customStyle: "font-style: italic;",
        original: "baz",
        romanized: "GHI",
        english: "day",
      }),
      new LyricRow(),
    ]);
  });

  test("should successfully italicize selected rows", async ({ page }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { rows: [1, 2] });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Italicize row(s)")!);

    await checkTableContentsEquality(table, [
      ["italic;", "foo", "ABC", "year"],
      ["italic;", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({
        customStyle: "font-style: italic;",
        original: "foo",
        romanized: "ABC",
        english: "year",
      }),
      new LyricRow({
        customStyle: "font-style: italic;",
        original: "bar",
        romanized: "DEF",
        english: "month",
      }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });

  test('should successfully undo & redo action upon clicking "Undo" & "Redo" on the context menu', async ({
    page,
  }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table);
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Italicize row(s)")!);

    await summonContextMenu(table);
    await userEvent.click(getContextMenuItem(contextMenu, "Undo")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({
        customStyle: "",
        original: "foo",
        romanized: "ABC",
        english: "year",
      }),
      new LyricRow({
        customStyle: "",
        original: "bar",
        romanized: "DEF",
        english: "month",
      }),
      new LyricRow({
        customStyle: "",
        original: "baz",
        romanized: "GHI",
        english: "day",
      }),
      new LyricRow(),
    ]);

    await summonContextMenu(table);
    await userEvent.click(getContextMenuItem(contextMenu, "Redo")!);

    await checkTableContentsEquality(table, [
      ["italic;", "foo", "ABC", "year"],
      ["italic;", "bar", "DEF", "month"],
      ["italic;", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({
        customStyle: "font-style: italic;",
        original: "foo",
        romanized: "ABC",
        english: "year",
      }),
      new LyricRow({
        customStyle: "font-style: italic;",
        original: "bar",
        romanized: "DEF",
        english: "month",
      }),
      new LyricRow({
        customStyle: "font-style: italic;",
        original: "baz",
        romanized: "GHI",
        english: "day",
      }),
      new LyricRow(),
    ]);
  });

  test('should successfully undo & redo action upon clicking "Undo" & "Redo" on the context menu', async ({
    page,
  }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table);
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Italicize row(s)")!);

    await userEvent.keyboard("{Control>}z{/Control}");

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({
        customStyle: "",
        original: "foo",
        romanized: "ABC",
        english: "year",
      }),
      new LyricRow({
        customStyle: "",
        original: "bar",
        romanized: "DEF",
        english: "month",
      }),
      new LyricRow({
        customStyle: "",
        original: "baz",
        romanized: "GHI",
        english: "day",
      }),
      new LyricRow(),
    ]);

    await userEvent.keyboard("{Control>}y{/Control}");

    await checkTableContentsEquality(table, [
      ["italic;", "foo", "ABC", "year"],
      ["italic;", "bar", "DEF", "month"],
      ["italic;", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({
        customStyle: "font-style: italic;",
        original: "foo",
        romanized: "ABC",
        english: "year",
      }),
      new LyricRow({
        customStyle: "font-style: italic;",
        original: "bar",
        romanized: "DEF",
        english: "month",
      }),
      new LyricRow({
        customStyle: "font-style: italic;",
        original: "baz",
        romanized: "GHI",
        english: "day",
      }),
      new LyricRow(),
    ]);
  });
});

describe("LyricsTable context menu interactions - unbold row", () => {
  beforeEach<LocalTestContext>(async (context) => {
    const page = await render(LyricsTable, {
      id: "lyrics",
      class: "vlw-custom-class",
      languageMetadata: {
        headers: ["Original", "Romanized", "English"],
        needsRomanization: true,
        needsTranslation: true,
        isChinese: false,
        isoLangCode: null,
      },
      data: [
        ["", "'''foo'''", "'''ABC'''", "'''year'''"],
        ["", "'''bar'''", "'''DEF'''", "'''month'''"],
        ["font-weight: bold;", "baz", "GHI", "day"],
      ],
    });
    context.page = page;
  });

  test("should successfully unbold a row", async ({ page }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { row: 1 });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Unbold row(s)")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["bold;", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({
        customStyle: "",
        original: "'''bar'''",
        romanized: "'''DEF'''",
        english: "'''month'''",
      }),
      new LyricRow({
        customStyle: "font-weight: bold;",
        original: "baz",
        romanized: "GHI",
        english: "day",
      }),
      new LyricRow(),
    ]);
  });

  test("should successfully unbold the table", async ({ page }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table);
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Unbold row(s)")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({
        customStyle: "",
        original: "bar",
        romanized: "DEF",
        english: "month",
      }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });

  test("should successfully unbold selected rows", async ({ page }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { rows: [2, 3] });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Unbold row(s)")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({
        customStyle: "",
        original: "'''foo'''",
        romanized: "'''ABC'''",
        english: "'''year'''",
      }),
      new LyricRow({
        customStyle: "",
        original: "bar",
        romanized: "DEF",
        english: "month",
      }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });

  test('should successfully undo & redo action upon clicking "Undo" & "Redo" on the context menu', async ({
    page,
  }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table);
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Unbold row(s)")!);

    await summonContextMenu(table);
    await userEvent.click(getContextMenuItem(contextMenu, "Undo")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["bold;", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({
        customStyle: "",
        original: "'''foo'''",
        romanized: "'''ABC'''",
        english: "'''year'''",
      }),
      new LyricRow({
        customStyle: "",
        original: "'''bar'''",
        romanized: "'''DEF'''",
        english: "'''month'''",
      }),
      new LyricRow({
        customStyle: "font-weight: bold;",
        original: "baz",
        romanized: "GHI",
        english: "day",
      }),
      new LyricRow(),
    ]);

    await summonContextMenu(table);
    await userEvent.click(getContextMenuItem(contextMenu, "Redo")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({
        customStyle: "",
        original: "bar",
        romanized: "DEF",
        english: "month",
      }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });

  test("should successfully undo & redo action upon clicking Ctrl+Z & Ctrl+Y on the context menu", async ({
    page,
  }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table);
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Unbold row(s)")!);

    await userEvent.keyboard("{Control>}z{/Control}");

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["bold;", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({
        customStyle: "",
        original: "'''foo'''",
        romanized: "'''ABC'''",
        english: "'''year'''",
      }),
      new LyricRow({
        customStyle: "",
        original: "'''bar'''",
        romanized: "'''DEF'''",
        english: "'''month'''",
      }),
      new LyricRow({
        customStyle: "font-weight: bold;",
        original: "baz",
        romanized: "GHI",
        english: "day",
      }),
      new LyricRow(),
    ]);

    await userEvent.keyboard("{Control>}y{/Control}");

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({
        customStyle: "",
        original: "bar",
        romanized: "DEF",
        english: "month",
      }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });
});

describe("LyricsTable context menu interactions - unitalicize row", () => {
  beforeEach<LocalTestContext>(async (context) => {
    const page = await render(LyricsTable, {
      id: "lyrics",
      class: "vlw-custom-class",
      languageMetadata: {
        headers: ["Original", "Romanized", "English"],
        needsRomanization: true,
        needsTranslation: true,
        isChinese: false,
        isoLangCode: null,
      },
      data: [
        ["", "''foo''", "''ABC''", "''year''"],
        ["", "''bar''", "''DEF''", "''month''"],
        ["font-style: italic;", "baz", "GHI", "day"],
      ],
    });
    context.page = page;
  });

  test("should successfully unitalicize a row", async ({ page }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { row: 1 });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Unitalicize row(s)")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["italic;", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({
        customStyle: "",
        original: "''bar''",
        romanized: "''DEF''",
        english: "''month''",
      }),
      new LyricRow({
        customStyle: "font-style: italic;",
        original: "baz",
        romanized: "GHI",
        english: "day",
      }),
      new LyricRow(),
    ]);
  });

  test("should successfully unitalicize the table", async ({ page }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table);
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Unitalicize row(s)")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({
        customStyle: "",
        original: "bar",
        romanized: "DEF",
        english: "month",
      }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });

  test("should successfully unitalicize selected rows", async ({ page }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { rows: [2, 3] });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Unitalicize row(s)")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({
        customStyle: "",
        original: "''foo''",
        romanized: "''ABC''",
        english: "''year''",
      }),
      new LyricRow({
        customStyle: "",
        original: "bar",
        romanized: "DEF",
        english: "month",
      }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });

  test('should successfully undo & redo action upon clicking "Undo" & "Redo" on the context menu', async ({
    page,
  }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table);
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Unitalicize row(s)")!);

    await summonContextMenu(table);
    await userEvent.click(getContextMenuItem(contextMenu, "Undo")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["italic;", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({
        customStyle: "",
        original: "''foo''",
        romanized: "''ABC''",
        english: "''year''",
      }),
      new LyricRow({
        customStyle: "",
        original: "''bar''",
        romanized: "''DEF''",
        english: "''month''",
      }),
      new LyricRow({
        customStyle: "font-style: italic;",
        original: "baz",
        romanized: "GHI",
        english: "day",
      }),
      new LyricRow(),
    ]);

    await summonContextMenu(table);
    await userEvent.click(getContextMenuItem(contextMenu, "Redo")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({
        customStyle: "",
        original: "bar",
        romanized: "DEF",
        english: "month",
      }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });

  test("should successfully undo & redo action upon clicking Ctrl+Z & Ctrl+Y on the context menu", async ({
    page,
  }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table);
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Unitalicize row(s)")!);

    await userEvent.keyboard("{Control>}z{/Control}");

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["italic;", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({
        customStyle: "",
        original: "''foo''",
        romanized: "''ABC''",
        english: "''year''",
      }),
      new LyricRow({
        customStyle: "",
        original: "''bar''",
        romanized: "''DEF''",
        english: "''month''",
      }),
      new LyricRow({
        customStyle: "font-style: italic;",
        original: "baz",
        romanized: "GHI",
        english: "day",
      }),
      new LyricRow(),
    ]);

    await userEvent.keyboard("{Control>}y{/Control}");

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({
        customStyle: "",
        original: "bar",
        romanized: "DEF",
        english: "month",
      }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });
});

describe("LyricsTable context menu interactions - row insertion & removal operations", () => {
  beforeEach<LocalTestContext>(async (context) => {
    const page = await render(LyricsTable, {
      id: "lyrics",
      class: "vlw-custom-class",
      languageMetadata: {
        headers: ["Original", "Romanized", "English"],
        needsRomanization: true,
        needsTranslation: true,
        isChinese: false,
        isoLangCode: null,
      },
      data: [
        ["", "foo", "ABC", "year"],
        ["", "bar", "DEF", "month"],
        ["", "baz", "GHI", "day"],
      ],
    });
    context.page = page;
  });

  test("should successfully insert a row above", async ({ page }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { row: 2 });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Insert row above")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "", "", ""],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow(),
      new LyricRow({ customStyle: "", original: "bar", romanized: "DEF", english: "month" }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });

  test("should successfully insert a row below", async ({ page }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { row: 2 });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Insert row below")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "", "", ""],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({ customStyle: "", original: "bar", romanized: "DEF", english: "month" }),
      new LyricRow(),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });

  test('should successfully undo & redo single row insertion action on clicking "Undo" and "Redo" on the context menu', async ({
    page,
  }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { row: 2 });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Insert row below")!);

    await summonContextMenu(table);
    await userEvent.click(getContextMenuItem(contextMenu, "Undo")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({ customStyle: "", original: "bar", romanized: "DEF", english: "month" }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);

    await summonContextMenu(table);
    await userEvent.click(getContextMenuItem(contextMenu, "Redo")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "", "", ""],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({ customStyle: "", original: "bar", romanized: "DEF", english: "month" }),
      new LyricRow(),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });

  test("should successfully undo & redo single row insertion action on clicking Ctrl+Z & Ctrl+Y", async ({
    page,
  }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { row: 2 });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Insert row below")!);

    await userEvent.keyboard("{Control>}z{/Control}");

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({ customStyle: "", original: "bar", romanized: "DEF", english: "month" }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);

    await userEvent.keyboard("{Control>}y{/Control}");

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "", "", ""],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({ customStyle: "", original: "bar", romanized: "DEF", english: "month" }),
      new LyricRow(),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });

  test("should successfully insert several rows below", async ({ page }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { rows: [1, 2] });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Insert 2 rows below")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({ customStyle: "", original: "bar", romanized: "DEF", english: "month" }),
      new LyricRow(),
      new LyricRow(),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });

  test('should successfully undo & redo multiple row insertion action on clicking "Undo" and "Redo" on the context menu', async ({
    page,
  }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { rows: [1, 2] });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Insert 2 rows below")!);

    await summonContextMenu(table);
    await userEvent.click(getContextMenuItem(contextMenu, "Undo")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({ customStyle: "", original: "bar", romanized: "DEF", english: "month" }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);

    await summonContextMenu(table);
    await userEvent.click(getContextMenuItem(contextMenu, "Redo")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({ customStyle: "", original: "bar", romanized: "DEF", english: "month" }),
      new LyricRow(),
      new LyricRow(),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });

  test("should successfully undo & redo multiple row insertion action on clicking Ctrl+Z & Ctrl+Y", async ({
    page,
  }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { rows: [1, 2] });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Insert 2 rows below")!);

    await userEvent.keyboard("{Control>}z{/Control}");

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({ customStyle: "", original: "bar", romanized: "DEF", english: "month" }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);

    await userEvent.keyboard("{Control>}y{/Control}");

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({ customStyle: "", original: "bar", romanized: "DEF", english: "month" }),
      new LyricRow(),
      new LyricRow(),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });

  test("should successfully remove a row", async ({ page }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { row: 2 });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Remove row")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });

  test('should successfully undo & redo row removal action on clicking "Undo" and "Redo" on the context menu', async ({
    page,
  }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { row: 2 });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Remove row")!);

    await summonContextMenu(table);
    await userEvent.click(getContextMenuItem(contextMenu, "Undo")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({ customStyle: "", original: "bar", romanized: "DEF", english: "month" }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);

    await summonContextMenu(table);
    await userEvent.click(getContextMenuItem(contextMenu, "Redo")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });

  test("should successfully undo & redo row removal action on clicking Ctrl+Z & Ctrl+Y", async ({
    page,
  }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { row: 2 });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Remove row")!);

    await userEvent.keyboard("{Control>}z{/Control}");

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({ customStyle: "", original: "bar", romanized: "DEF", english: "month" }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);

    await userEvent.keyboard("{Control>}y{/Control}");

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });

  test("should successfully reset table", async ({ page }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { row: 1 });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Reset table")!);
    await new Promise((resolve) => setTimeout(resolve, 200));

    await checkTableContentsEquality(
      table,
      Array(20)
        .fill(null)
        .map(() => ["", "", "", ""]),
    );

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual(
      Array(20)
        .fill(null)
        .map(() => new LyricRow({ customStyle: "", original: "", romanized: "", english: "" })),
    );
  });

  test('should successfully undo & redo reset table action on clicking "Undo" and "Redo" on the context menu', async ({
    page,
  }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { row: 1 });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Reset table")!);
    await new Promise((resolve) => setTimeout(resolve, 200));

    await summonContextMenu(table);
    await userEvent.click(getContextMenuItem(contextMenu, "Undo")!);
    await new Promise((resolve) => setTimeout(resolve, 200));

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({ customStyle: "", original: "bar", romanized: "DEF", english: "month" }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);

    await summonContextMenu(table);
    await userEvent.click(getContextMenuItem(contextMenu, "Redo")!);
    await new Promise((resolve) => setTimeout(resolve, 200));

    await checkTableContentsEquality(
      table,
      Array(20)
        .fill(null)
        .map(() => ["", "", "", ""]),
    );

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual(
      Array(20)
        .fill(null)
        .map(() => new LyricRow({ customStyle: "", original: "", romanized: "", english: "" })),
    );
  });

  test("should successfully undo & redo reset table action on clicking Ctrl+Z & Ctrl+Y", async ({
    page,
  }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { row: 1 });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Reset table")!);
    await new Promise((resolve) => setTimeout(resolve, 200));

    await userEvent.keyboard("{Control>}z{/Control}");
    await new Promise((resolve) => setTimeout(resolve, 200));

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({ customStyle: "", original: "bar", romanized: "DEF", english: "month" }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);

    await userEvent.keyboard("{Control>}y{/Control}");
    await new Promise((resolve) => setTimeout(resolve, 200));

    await checkTableContentsEquality(
      table,
      Array(20)
        .fill(null)
        .map(() => ["", "", "", ""]),
    );

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual(
      Array(20)
        .fill(null)
        .map(() => new LyricRow({ customStyle: "", original: "", romanized: "", english: "" })),
    );
  });
});

describe("LyricsTable component tests - with set languages", () => {
  test("successfully load table when the language is set to Japanese", async () => {
    const page = await render(LyricsTable, {
      id: "lyrics",
      class: "vlw-custom-class",
      languageMetadata: {
        headers: ["Japanese", "Romaji", "English"],
        needsRomanization: true,
        needsTranslation: true,
        isChinese: false,
        isoLangCode: "ja",
      },
      data: [
        ["", "foo", "ABC", "year"],
        ["", "bar", "DEF", "month"],
        ["", "baz", "GHI", "day"],
      ],
    });

    /* Initial assertions */
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();

    /* Check displayed column headers */
    await checkColHeadersEquality(table, ["Custom style", "Japanese", "Romaji", "English"]);

    /* Check displayed data */
    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({ customStyle: "", original: "bar", romanized: "DEF", english: "month" }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });

  test("successfully load table when the language is set to Mandarin", async () => {
    const page = await render(LyricsTable, {
      id: "lyrics",
      class: "vlw-custom-class",
      languageMetadata: {
        headers: ["Mandarin", "Pinyin", "English"],
        needsRomanization: true,
        needsTranslation: true,
        isChinese: true,
        isoLangCode: "zh-Hans",
      },
      data: [
        ["", "foo", "ABC", "year"],
        ["", "bar", "DEF", "month"],
        ["", "baz", "GHI", "day"],
      ],
    });

    /* Initial assertions */
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();

    /* Check displayed column headers */
    await checkColHeadersEquality(table, ["Custom style", "Mandarin", "Pinyin", "English"]);

    /* Check displayed data */
    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
      ["", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({ customStyle: "", original: "bar", romanized: "DEF", english: "month" }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });

  test("successfully load table when the language is set to Spanish", async () => {
    const page = await render(LyricsTable, {
      id: "lyrics",
      class: "vlw-custom-class",
      languageMetadata: {
        headers: ["Spanish", "", "English"],
        needsRomanization: false,
        needsTranslation: true,
        isChinese: false,
        isoLangCode: "es",
      },
      data: [
        ["", "foo", "", "year"],
        ["", "bar", "", "month"],
        ["", "baz", "", "day"],
      ],
    });

    /* Initial assertions */
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();

    /* Check displayed column headers */
    await checkColHeadersEquality(table, ["Custom style", "Spanish", "English"]);

    /* Check displayed data */
    await checkTableContentsEquality(table, [
      ["", "foo", "year"],
      ["", "bar", "month"],
      ["", "baz", "day"],
      ["", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "", english: "year" }),
      new LyricRow({ customStyle: "", original: "bar", romanized: "", english: "month" }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "", english: "day" }),
      new LyricRow(),
    ]);
  });

  test("successfully load table when the language is set to English", async () => {
    const page = await render(LyricsTable, {
      id: "lyrics",
      class: "vlw-custom-class",
      languageMetadata: {
        headers: ["English", "", ""],
        needsRomanization: false,
        needsTranslation: false,
        isChinese: false,
        isoLangCode: "en",
      },
      data: [
        ["", "year", "", ""],
        ["", "month", "", ""],
        ["", "day", "", ""],
      ],
    });

    /* Initial assertions */
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();

    /* Check displayed column headers */
    await checkColHeadersEquality(table, ["Custom style", "English"]);

    /* Check displayed data */
    await checkTableContentsEquality(table, [
      ["", "year"],
      ["", "month"],
      ["", "day"],
      ["", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "", romanized: "", english: "year" }),
      new LyricRow({ customStyle: "", original: "", romanized: "", english: "month" }),
      new LyricRow({ customStyle: "", original: "", romanized: "", english: "day" }),
      new LyricRow(),
    ]);
  });

  test("successfully load table when the language is set to non-lexical", async () => {
    const page = await render(LyricsTable, {
      id: "lyrics",
      class: "vlw-custom-class",
      languageMetadata: {
        headers: ["Non-lexical lyrics", "", ""],
        needsRomanization: false,
        needsTranslation: false,
        isChinese: false,
        isoLangCode: null,
      },
      data: [
        ["", "year", "", ""],
        ["", "month", "", ""],
        ["", "day", "", ""],
      ],
    });

    /* Initial assertions */
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();

    /* Check displayed column headers */
    await checkColHeadersEquality(table, ["Custom style", "Non-lexical lyrics"]);

    /* Check displayed data */
    await checkTableContentsEquality(table, [
      ["", "year"],
      ["", "month"],
      ["", "day"],
      ["", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "", romanized: "", english: "year" }),
      new LyricRow({ customStyle: "", original: "", romanized: "", english: "month" }),
      new LyricRow({ customStyle: "", original: "", romanized: "", english: "day" }),
      new LyricRow(),
    ]);
  });

  test("successfully load table when the language is set to conlang", async () => {
    const page = await render(LyricsTable, {
      id: "lyrics",
      class: "vlw-custom-class",
      languageMetadata: {
        headers: ["Conlang", "", "English"],
        needsRomanization: false,
        needsTranslation: true,
        isChinese: false,
        isoLangCode: null,
      },
      data: [
        ["", "foo", "", "year"],
        ["", "bar", "", "month"],
        ["", "baz", "", "day"],
      ],
    });

    /* Initial assertions */
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();

    /* Check displayed column headers */
    await checkColHeadersEquality(table, ["Custom style", "Conlang", "English"]);

    /* Check displayed data */
    await checkTableContentsEquality(table, [
      ["", "foo", "year"],
      ["", "bar", "month"],
      ["", "baz", "day"],
      ["", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getLatestData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "", english: "year" }),
      new LyricRow({ customStyle: "", original: "bar", romanized: "", english: "month" }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "", english: "day" }),
      new LyricRow(),
    ]);
  });
});