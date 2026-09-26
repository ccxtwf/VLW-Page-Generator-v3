import { beforeEach, describe, expect, test, TestContext, vi } from "vite-plus/test";
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

import LyricsFreeEditTable from "#src/lib/components/handsontables/LyricsFreeEditTable.svelte";
import LyricRow from "#src/lib/models/children/LyricsRow.svelte.ts";

interface LocalTestContext extends TestContext {
  page: RenderResult<LyricsFreeEditTable, never>;
}

describe("LyricsFreeEditTable component tests - base tests", () => {
  test("table should be wrapped in a div", async () => {
    const page = await render(LyricsFreeEditTable, {
      id: "lyrics",
      class: "vlw-custom-class",
    });
    const wrapper = page.baseElement.querySelector("#lyrics");
    expect(wrapper).not.toBeNull();
    expect(wrapper).toHaveClass("vlw-custom-class");
    const table = getHtWrapper(wrapper as HTMLElement);
    expect(table).not.toBeNull();
  });

  test("successfully load table with starting data", async () => {
    const page = await render(LyricsFreeEditTable, {
      id: "lyrics",
      class: "vlw-custom-class",
      toggleText: "{{lyrics toggle|org:Original|rom:Romanized|eng:English}}",
    });

    /* Initial assertions */
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();

    /* Check displayed column headers */
    await checkColHeadersEquality(table, ["Custom style", "Original", "Romanized", "English"]);

    /* Check displayed data */
    await checkTableContentsEquality(
      table,
      Array(20)
        .fill(null)
        .map(() => ["", "", "", ""]),
    );

    /* Check returned data */
    expect(page.component.getData()).toEqual(
      Array(20)
        .fill(null)
        .map(() => new LyricRow()),
    );
  });
});

describe("LyricsFreeEditTable context menu - base tests", () => {
  beforeEach<LocalTestContext>(async (context) => {
    const page = await render(LyricsFreeEditTable, {
      id: "lyrics",
      class: "vlw-custom-class",
      toggleText: "{{lyrics toggle|org:Original|rom:Romanized|eng:English}}",
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
      "Insert column left",
      "Insert column right",
      "Remove columns",
    ]);
  });
});

describe("LyricsFreeEditTable context menu interactions - bold row", () => {
  beforeEach<LocalTestContext>(async (context) => {
    const page = await render(LyricsFreeEditTable, {
      id: "lyrics",
      class: "vlw-custom-class",
      toggleText: "{{lyrics toggle|org:Original|rom:Romanized|eng:English}}",
    });
    page.component.loadData([
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
    ]);
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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

describe("LyricsFreeEditTable context menu interactions - italicize row", () => {
  beforeEach<LocalTestContext>(async (context) => {
    const page = await render(LyricsFreeEditTable, {
      id: "lyrics",
      class: "vlw-custom-class",
      toggleText: "{{lyrics toggle|org:Original|rom:Romanized|eng:English}}",
    });
    page.component.loadData([
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
    ]);
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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

describe("LyricsFreeEditTable context menu interactions - unbold row", () => {
  beforeEach<LocalTestContext>(async (context) => {
    const page = await render(LyricsFreeEditTable, {
      id: "lyrics",
      class: "vlw-custom-class",
      toggleText: "{{lyrics toggle|org:Original|rom:Romanized|eng:English}}",
    });
    page.component.loadData([
      ["", "'''foo'''", "'''ABC'''", "'''year'''"],
      ["", "'''bar'''", "'''DEF'''", "'''month'''"],
      ["font-weight: bold;", "baz", "GHI", "day"],
    ]);
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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

describe("LyricsFreeEditTable context menu interactions - unitalicize row", () => {
  beforeEach<LocalTestContext>(async (context) => {
    const page = await render(LyricsFreeEditTable, {
      id: "lyrics",
      class: "vlw-custom-class",
      toggleText: "{{lyrics toggle|org:Original|rom:Romanized|eng:English}}",
    });
    page.component.loadData([
      ["", "''foo''", "''ABC''", "''year''"],
      ["", "''bar''", "''DEF''", "''month''"],
      ["font-style: italic;", "baz", "GHI", "day"],
    ]);
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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

describe("LyricsFreeEditTable context menu interactions - row insertion & removal operations", () => {
  beforeEach<LocalTestContext>(async (context) => {
    const page = await render(LyricsFreeEditTable, {
      id: "lyrics",
      class: "vlw-custom-class",
      toggleText: "{{lyrics toggle|org:Original|rom:Romanized|eng:English}}",
    });
    page.component.loadData([
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
    ]);
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
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
    expect(page.component.getData()).toEqual([
      new LyricRow({ customStyle: "", original: "foo", romanized: "ABC", english: "year" }),
      new LyricRow({ customStyle: "", original: "baz", romanized: "GHI", english: "day" }),
      new LyricRow(),
    ]);
  });
});

describe("LyricsFreeEditTable - reset", () => {
  test("should call a callback function when resetting the table", async () => {
    const resetTableHandler = vi.fn();
    const page = await render(LyricsFreeEditTable, {
      id: "lyrics",
      class: "vlw-custom-class",
      toggleText: "{{lyrics toggle|org:Original|rom:Romanized|eng:English}}",
      resetTable: resetTableHandler,
    });
    page.component.loadData([
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
    ]);

    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { row: 1 });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Reset table")!);

    expect(resetTableHandler).toHaveBeenCalledOnce();
  });
});

describe("LyricsFreeEditTable context menu interactions - column insertion & removal operations", () => {
  beforeEach<LocalTestContext>(async (context) => {
    const page = await render(LyricsFreeEditTable, {
      id: "lyrics",
      class: "vlw-custom-class",
      toggleText: "{{lyrics toggle|org:Original|rom:Romanized|eng:English}}",
    });
    page.component.loadData([
      ["", "foo", "ABC", "year"],
      ["", "bar", "DEF", "month"],
      ["", "baz", "GHI", "day"],
    ]);
    context.page = page;
  });

  test("should successfully insert a column to the left of the first column", async ({
    page,
  }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { col: 2 });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Insert column left")!);

    await checkTableContentsEquality(table, [
      ["", "", "foo", "ABC", "year"],
      ["", "", "bar", "DEF", "month"],
      ["", "", "baz", "GHI", "day"],
      ["", "", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getData()).toEqual([
      new LyricRow({
        customStyle: "",
        original: "",
        romanized: "foo",
        english: "ABC",
        additionalColumns: ["year"],
      }),
      new LyricRow({
        customStyle: "",
        original: "",
        romanized: "bar",
        english: "DEF",
        additionalColumns: ["month"],
      }),
      new LyricRow({
        customStyle: "",
        original: "",
        romanized: "baz",
        english: "GHI",
        additionalColumns: ["day"],
      }),
      new LyricRow(),
    ]);
  });

  test("should successfully insert a column to the right of the first column", async ({
    page,
  }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { col: 2 });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Insert column right")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "", "ABC", "year"],
      ["", "bar", "", "DEF", "month"],
      ["", "baz", "", "GHI", "day"],
      ["", "", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getData()).toEqual([
      new LyricRow({
        customStyle: "",
        original: "foo",
        romanized: "",
        english: "ABC",
        additionalColumns: ["year"],
      }),
      new LyricRow({
        customStyle: "",
        original: "bar",
        romanized: "",
        english: "DEF",
        additionalColumns: ["month"],
      }),
      new LyricRow({
        customStyle: "",
        original: "baz",
        romanized: "",
        english: "GHI",
        additionalColumns: ["day"],
      }),
      new LyricRow(),
    ]);
  });

  test("should successfully insert a column to the right of the last column", async ({
    page,
  }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { col: 4 });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Insert column right")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "ABC", "year", ""],
      ["", "bar", "DEF", "month", ""],
      ["", "baz", "GHI", "day", ""],
      ["", "", "", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getData()).toEqual([
      new LyricRow({
        customStyle: "",
        original: "foo",
        romanized: "ABC",
        english: "year",
        additionalColumns: [""],
      }),
      new LyricRow({
        customStyle: "",
        original: "bar",
        romanized: "DEF",
        english: "month",
        additionalColumns: [""],
      }),
      new LyricRow({
        customStyle: "",
        original: "baz",
        romanized: "GHI",
        english: "day",
        additionalColumns: [""],
      }),
      new LyricRow(),
    ]);
  });

  test("should successfully remove a column", async ({ page }: LocalTestContext) => {
    const table = getHtWrapper(page.baseElement);
    await expect.element(table).toBeVisible();
    await summonContextMenu(table, { col: 3 });
    const contextMenu = getContextMenu(page.baseElement);
    await expect.element(contextMenu).toBeVisible();

    await userEvent.click(getContextMenuItem(contextMenu, "Remove column")!);

    await checkTableContentsEquality(table, [
      ["", "foo", "year"],
      ["", "bar", "month"],
      ["", "baz", "day"],
      ["", "", ""],
    ]);

    /* Check returned data */
    expect(page.component.getData()).toEqual([
      new LyricRow({
        customStyle: "",
        original: "foo",
        romanized: "year",
      }),
      new LyricRow({
        customStyle: "",
        original: "bar",
        romanized: "month",
      }),
      new LyricRow({
        customStyle: "",
        original: "baz",
        romanized: "day",
      }),
      new LyricRow(),
    ]);
  });
});