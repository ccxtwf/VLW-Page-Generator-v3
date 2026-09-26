import { expect } from "vite-plus/test";
import { userEvent } from "vite-plus/test/browser";

export function getHtWrapper(page: HTMLElement) {
  return page.querySelector(".ht-root-wrapper") as HTMLElement;
}

export function getMaster(hotTable: HTMLElement) {
  return hotTable.querySelector(".ht_master") as HTMLElement;
}

export function getRowHeaderCells(hotTable: HTMLElement) {
  return hotTable.querySelector(".ht_clone_inline_start") as HTMLElement;
}

export function getColHeaderCells(hotTable: HTMLElement) {
  return hotTable.querySelector(".ht_clone_top") as HTMLElement;
}

export function getTopLeftCellHandle(hotTable: HTMLElement) {
  return hotTable.querySelector(".ht_clone_top_inline_start_corner") as HTMLElement;
}

export function getTableColHeaders(hotTable: HTMLElement) {
  return Array.from(getMaster(hotTable).querySelectorAll(".htCore > thead > tr > th"));
}

export function getTableRows(hotTable: HTMLElement) {
  return Array.from(getMaster(hotTable).querySelectorAll(".htCore > tbody > tr"));
}

export function getContextMenu(page: HTMLElement) {
  return page.querySelector(".htContextMenu") as HTMLElement;
}

export function countRows(hotTable: HTMLElement) {
  return getTableRows(hotTable).length;
}

export async function checkColHeadersEquality(hotTable: HTMLElement, expected: string[]) {
  const tableColHeaders = getTableColHeaders(hotTable);
  for (let i = 0; i < expected.length; i++) {
    await expect.element(tableColHeaders[i + 1] as HTMLElement).toHaveTextContent(expected[i]);
  }
}

export async function checkTableContentsEquality(hotTable: HTMLElement, expected: unknown[][]) {
  const tableRows = getTableRows(hotTable);
  expect(tableRows.length).toEqual(expected.length);
  for (let i = 0; i < tableRows.length; i++) {
    const tableCells = tableRows[i].querySelectorAll("th, td");
    await expect.element(tableCells[0] as HTMLElement).toHaveTextContent(i + 1);
    for (let j = 0; j < expected[i].length; j++) {
      await expect
        .element(tableCells[j + 1] as HTMLElement)
        .toHaveTextContent(String((expected[i][j] as string) ?? ""));
    }
  }
}

/**
 *
 * @param hotTable
 * @param row 1-th offset
 * @param col 1-th offset
 */
export async function summonContextMenu(
  hotTable: HTMLElement,
  { row, col, rows }: { row?: number; col?: number; rows?: [number, number] } = {},
) {
  let cellHandle: HTMLElement | null = null;
  if (rows) {
    // Multiple rows
    let a = getRowHeaderCells(hotTable).querySelector(
      `.htCore > tbody > [role="row"]:nth-of-type(${rows[0]}) > [role="rowheader"]:first-of-type`,
    ) as HTMLElement;
    let b = getRowHeaderCells(hotTable).querySelector(
      `.htCore > tbody > [role="row"]:nth-of-type(${rows[1]}) > [role="rowheader"]:first-of-type`,
    ) as HTMLElement;
    await userEvent.click(a, { position: { x: 20, y: 10 } });
    await userEvent.click(b, { position: { x: 20, y: 10 }, modifiers: ["Shift"] });
    cellHandle = a;
  } else if (!row && !col) {
    // Top left handle
    cellHandle = getTopLeftCellHandle(hotTable).querySelector(
      `.htCore > thead > [role="row"] > [role="gridcell button"]`,
    ) as HTMLElement;
  } else if (row && col) {
    // Single cell
    cellHandle = getMaster(hotTable).querySelector(
      `.htCore > tbody > [role="row"]:nth-of-type(${row}) > [role="gridcell"]:nth-of-type(${col})`,
    ) as HTMLElement;
  } else if (row) {
    // Row header cell
    cellHandle = getRowHeaderCells(hotTable).querySelector(
      `.htCore > tbody > [role="row"]:nth-of-type(${row}) > [role="rowheader"]:first-of-type`,
    ) as HTMLElement;
  } else if (col) {
    // Column header cell
    cellHandle = getColHeaderCells(hotTable).querySelector(
      `.htCore > thead > [role="row"]:first-of-type > [role="columnheader"]:nth-of-type(${col! + 1})`,
    ) as HTMLElement;
  } else {
    throw new Error("Invalid argument");
  }
  await userEvent.click(cellHandle, {
    button: "right",
    position: { x: 20, y: 10 },
  });
}

export function getContextMenuItem(contextMenu: HTMLElement, labelText: string) {
  const items = Array.from(contextMenu.querySelectorAll('[role="menuitem"]'));
  return items.find((item) => item.textContent === labelText);
}