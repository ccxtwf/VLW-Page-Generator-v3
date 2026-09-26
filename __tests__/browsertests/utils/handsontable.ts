import { type Locator, type Page, expect } from "@playwright/test";

export function getHandsontableInstance(page: Locator, wrapperId?: string) {
  const selector = wrapperId ? `#${wrapperId} .ht-root-wrapper` : ".ht-root-wrapper";
  return page.locator(selector);
}

export function getMaster(hotTable: Locator) {
  return hotTable.locator(".ht_master");
}

export function getRowHeaderCells(hotTable: Locator) {
  return hotTable.locator(".ht_clone_inline_start");
}

export function getColHeaderCells(hotTable: Locator) {
  return hotTable.locator(".ht_clone_top");
}

export function getTopLeftCellHandle(hotTable: Locator) {
  return hotTable.locator(".ht_clone_top_inline_start_corner");
}

export function getTableInput(hotTable: Locator) {
  return hotTable.locator(
    '.handsontableInputHolder.ht_clone_master textarea.handsontableInput:not([role="combobox"])',
  );
}

export async function getTableColHeaders(hotTable: Locator) {
  return await getMaster(hotTable).locator(".htCore > thead > tr > th").all();
}

export async function getTableRows(hotTable: Locator) {
  return await getMaster(hotTable).locator(".htCore > tbody > tr").all();
}

export function getTableRow(hotTable: Locator, index: number) {
  return getMaster(hotTable)
    .locator(".htCore > tbody > tr")
    .nth(index - 1);
}

export function getContextMenu(page: Locator) {
  return page.locator(".htContextMenu");
}

export async function countRows(hotTable: Locator) {
  return (await getTableRows(hotTable)).length;
}

export async function countCols(hotTable: Locator) {
  return (await getTableColHeaders(hotTable)).length;
}

/**
 *
 * @param hotTable
 * @param row 1-th offset
 * @param col 1-th offset
 */
export async function summonContextMenu(
  page: Page,
  hotTable: Locator,
  {
    row,
    col,
    rows,
    allRowsAfter,
  }: { row?: number; col?: number; rows?: [number, number]; allRowsAfter?: number } = {},
) {
  let cellHandle: Locator | null = null;
  if (rows) {
    // Multiple rows
    let a = getRowHeaderCells(hotTable).locator(
      `.htCore > tbody > [role="row"]:nth-of-type(${rows[0]}) > [role="rowheader"]:first-of-type`,
    );
    let b = getRowHeaderCells(hotTable).locator(
      `.htCore > tbody > [role="row"]:nth-of-type(${rows[1]}) > [role="rowheader"]:first-of-type`,
    );
    await a.click({ position: { x: 20, y: 10 } });
    await b.click({ position: { x: 20, y: 10 }, modifiers: ["Shift"] });
    cellHandle = a;
  } else if (allRowsAfter) {
    // All rows after a certain row
    let a = getRowHeaderCells(hotTable).locator(
      `.htCore > tbody > [role="row"]:nth-of-type(${allRowsAfter + 1}) > [role="rowheader"]:first-of-type`,
    );
    await a.click({ position: { x: 20, y: 10 } });
    await page.keyboard.press("Shift+Control+ArrowDown");
    cellHandle = a;
  } else if (!row && !col) {
    // Top left handle
    cellHandle = getTopLeftCellHandle(hotTable).locator(
      `.htCore > thead > [role="row"] > [role="gridcell button"]`,
    );
  } else if (row && col) {
    // Single cell
    cellHandle = getMaster(hotTable).locator(
      `.htCore > tbody > [role="row"]:nth-of-type(${row}) > [role="gridcell"]:nth-of-type(${col})`,
    );
  } else if (row) {
    // Row header cell
    cellHandle = getRowHeaderCells(hotTable).locator(
      `.htCore > tbody > [role="row"]:nth-of-type(${row}) > [role="rowheader"]:first-of-type`,
    );
  } else if (col) {
    // Column header cell
    cellHandle = getColHeaderCells(hotTable).locator(
      `.htCore > thead > [role="row"]:first-of-type > [role="columnheader"]:nth-of-type(${col! + 1})`,
    );
  } else {
    throw new Error("Invalid argument");
  }
  await cellHandle.click({
    button: "right",
    position: { x: 20, y: 10 },
  });
}

/**
 * Assert that the Handontable instance has the given number of columns
 *
 * @param table
 * @param ncolumns
 */
export async function assertTableColumnNumber(table: Locator, ncolumns: number) {
  const cells = await getTableColHeaders(table);
  expect(cells.length - 1).toBe(ncolumns);
}

/**
 * Assert that the Handontable instance has the given number of rows
 *
 * @param table
 * @param ncolumns
 */
export async function assertTableRowNumber(table: Locator, nrows: number) {
  const tbodyRows = await getTableRows(table);
  expect(tbodyRows.length).toBe(nrows);
}

/**
 * On Playwright tests, remove all rows of a Handsontable instance starting from and
 * including the given row number.
 *
 * @param page
 * @param table
 * @param allRowsAfter Remove rows after this row number (1-th index position)
 */
export async function removeHandsontableRows(page: Page, table: Locator, allRowsAfter: number) {
  await summonContextMenu(page, table, { allRowsAfter });
  await page.getByText("Remove row").click();
}

/**
 * On Playwright tests, remove a given column of a Handsontable instance.
 *
 * @param page
 * @param table
 * @param index Column position index (1-th index)
 */
export async function removeHandsontableColumn(page: Page, table: Locator, index: number) {
  await summonContextMenu(page, table, { col: index });
  await page.getByText("Remove column").click();
}

/**
 * On Playwright tests, add a column to the right of the given position on
 * a Handsontable instance.
 *
 * @param page
 * @param table
 * @param index Column position index (1-th index)
 */
export async function insertHandsontableColumnToRight(page: Page, table: Locator, index: number) {
  await summonContextMenu(page, table, { col: index });
  await page.getByText("Insert column right").click();
}

/**
 * On Playwright tests, add a column to the left of the given position on
 * a Handsontable instance.
 *
 * @param page
 * @param table
 * @param index Column position index (1-th index)
 */
export async function insertHandsontableColumnToLeft(page: Page, table: Locator, index: number) {
  await summonContextMenu(page, table, { col: index });
  await page.getByText("Insert column left").click();
}

/**
 *
 * @param table
 * @param index (1-th index)
 * @param data
 */
export async function fillTableAtRow(table: Locator, index: number, data: string[]) {
  const row = getTableRow(table, index);
  for (let i = 0; i < data.length; i++) {
    let cell = row.locator("td").nth(i);
    await cell.click({ clickCount: 2 });
    const inputTextArea = getTableInput(table);
    await inputTextArea.fill(data[i]);
  }
}

/**
 *
 * @param table
 * @param index (1-th index)
 * @param data
 */
export async function fillTableAtColumn(table: Locator, index: number, data: string[]) {
  const tbodyRows = await getTableRows(table);
  for (let i = 0; i < data.length; i++) {
    let rw = tbodyRows[i];
    let cell = rw.locator("td").nth(index - 1);
    await cell.click({ clickCount: 2 });
    const inputTextArea = getTableInput(table);
    await inputTextArea.fill(data[i]);
  }
}