import { type Locator, type Page, expect } from "@playwright/test";
import {
  IAlbumTrack,
  IExternalLink,
  IExternalLinkForProducerPage,
  ILyricsRow,
  IPlayLink,
  IProducerDiscographyAlbumItem,
  IProducerDiscographySongItem,
} from "../../src/lib/models/schema";

/**
 *
 * @param id
 * @param form
 * @returns
 */
export function getHandsontableInstance(form: Locator, id: string) {
  return form.locator(`#${id} .ht-root-wrapper`);
}

const HANDSONTABLE_ROW_LABEL_SELECTOR =
  ".ht-grid-content .ht_clone_inline_start.ht_clone_left .htCore tbody tr";
const HANDSONTABLE_ROW_SELECTOR = ".ht-grid-content .ht_master .htCore tbody tr";
const HANDSONTABLE_EDITOR_SELECTOR =
  '.handsontableInputHolder.ht_clone_master textarea.handsontableInput:not([role="combobox"])';

/**
 * On Playwright tests, remove all rows of a Handsontable instance starting from and
 * including the given row number.
 *
 * @param page
 * @param table
 * @param from
 */
export async function removeHandsontableRows(page: Page, table: Locator, offset: number) {
  const tbodyRows = await table.locator(HANDSONTABLE_ROW_LABEL_SELECTOR).all();
  await tbodyRows[offset].click({ delay: 50 });
  await page.keyboard.press("Shift+Control+ArrowDown");
  await tbodyRows[offset].click({ button: "right" });
  await page.getByText("Remove row").click();
}

/**
 * Assert that the Handontable instance has the given number of columns
 *
 * @param table
 * @param ncolumns
 */
export async function assertTableColumnNumber(table: Locator, ncolumns: number) {
  const tbodyRow = table.locator(HANDSONTABLE_ROW_SELECTOR).first();
  const cells = await tbodyRow.locator('td[role="gridcell"]').all();
  expect(cells.length).toBe(ncolumns);
}

/**
 * Assert that the Handontable instance has the given number of rows
 *
 * @param table
 * @param ncolumns
 */
export async function assertTableRowNumber(table: Locator, nrows: number) {
  const tbodyRows = await table.locator(HANDSONTABLE_ROW_SELECTOR).all();
  expect(tbodyRows.length).toBe(nrows);
}

/**
 *
 * @param table
 * @param data
 */
export async function fillBroadcastLinksTable(
  table: Locator,
  data: {
    i: Partial<IPlayLink> & Pick<IPlayLink, "url" | "viewCount">;
    o: { site: RegExp | string; url: RegExp | string };
  }[],
) {
  const tbodyRows = await table.locator(HANDSONTABLE_ROW_SELECTOR).all();
  for (let i = 0; i < data.length; i++) {
    let rw = tbodyRows[i];
    let siteCell = rw.locator("td").nth(0);
    let urlCell = rw.locator("td").nth(1);
    let isReprintCell = rw.locator("td").nth(2);
    let isAutogenCell = rw.locator("td").nth(3);
    let isDeletedCell = rw.locator("td").nth(4);
    let viewCountCell = rw.locator("td").nth(5);

    const { url, viewCount, isReprint = false, isAutogen = false, isDeleted = false } = data[i].i;

    await urlCell.click({ clickCount: 2 });
    const inputTextArea = table.locator(HANDSONTABLE_EDITOR_SELECTOR);
    await inputTextArea.fill(url);
    await inputTextArea.press("Tab");
    await expect(urlCell).toHaveText(data[i].o.url);
    await expect(siteCell).toHaveText(data[i].o.site);

    await viewCountCell.click({ clickCount: 2 });
    await inputTextArea.fill(viewCount);
    await inputTextArea.press("Tab");

    if (isReprint) {
      const cb = isReprintCell.locator('input[type="checkbox"]');
      await cb.click();
      await expect(isReprintCell.getByRole("checkbox")).toBeChecked();
    }

    if (isAutogen) {
      const cb = isAutogenCell.locator('input[type="checkbox"]');
      await cb.click();
      await expect(isAutogenCell.getByRole("checkbox")).toBeChecked();
    }

    if (isDeleted) {
      const cb = isDeletedCell.locator('input[type="checkbox"]');
      await cb.click();
      await expect(isDeletedCell.getByRole("checkbox")).toBeChecked();
    }
  }
}

/**
 *
 * @param table
 * @param data
 */
export async function fillExternalLinksTable(
  table: Locator,
  data: {
    i: Pick<IExternalLink, "url" | "isOfficial">;
    o: { desc: RegExp | string; url: RegExp | string };
  }[],
) {
  const tbodyRows = await table.locator(HANDSONTABLE_ROW_SELECTOR).all();
  for (let i = 0; i < data.length; i++) {
    let rw = tbodyRows[i];
    let urlCell = rw.locator("td").nth(0);
    let descCell = rw.locator("td").nth(1);
    let isOfficialCell = rw.locator("td").nth(2);

    await urlCell.dblclick();
    const inputTextArea = table.locator(HANDSONTABLE_EDITOR_SELECTOR);
    await inputTextArea.fill(data[i].i.url);
    await inputTextArea.press("Tab");
    await expect(descCell).toHaveText(data[i].o.desc);
    await expect(urlCell).toHaveText(data[i].o.url);
    if (data[i].i.isOfficial) {
      const cb = isOfficialCell.locator('input[type="checkbox"]');
      await cb.click();
      await expect(isOfficialCell.getByRole("checkbox")).toBeChecked();
    }
  }
}

/**
 *
 * @param table
 * @param data
 */
export async function fillExternalLinksTableForProducerPage(
  table: Locator,
  data: {
    i: Partial<IExternalLinkForProducerPage> & Pick<IExternalLinkForProducerPage, "url">;
    o: { desc: RegExp | string; url: RegExp | string };
  }[],
) {
  const tbodyRows = await table.locator(HANDSONTABLE_ROW_SELECTOR).all();
  for (let i = 0; i < data.length; i++) {
    let rw = tbodyRows[i];
    let urlCell = rw.locator("td").nth(0);
    let descCell = rw.locator("td").nth(1);
    let isOfficialCell = rw.locator("td").nth(2);
    let isMediaCell = rw.locator("td").nth(3);
    let isInactiveCell = rw.locator("td").nth(4);

    const { url, isOfficial, isMedia, isInactive } = data[i].i;

    await urlCell.dblclick();
    const inputTextArea = table.locator(HANDSONTABLE_EDITOR_SELECTOR);
    await inputTextArea.fill(url);
    await inputTextArea.press("Tab");
    await expect(descCell).toHaveText(data[i].o.desc);
    await expect(urlCell).toHaveText(data[i].o.url);
    if (isOfficial) {
      const cb = isOfficialCell.locator('input[type="checkbox"]');
      await cb.click();
      await expect(isOfficialCell.getByRole("checkbox")).toBeChecked();
    }
    if (isMedia) {
      const cb = isMediaCell.locator('input[type="checkbox"]');
      await cb.click();
      await expect(isMediaCell.getByRole("checkbox")).toBeChecked();
    }
    if (isInactive) {
      const cb = isInactiveCell.locator('input[type="checkbox"]');
      await cb.click();
      await expect(isInactiveCell.getByRole("checkbox")).toBeChecked();
    }
  }
}

/**
 *
 * @param table
 * @param data
 */
export async function fillLyricsTable(
  table: Locator,
  data: Partial<ILyricsRow>[],
  {
    needsRomanization = true,
    needsTranslation = true,
  }: { needsRomanization?: boolean; needsTranslation?: boolean } = {},
) {
  const tbodyRows = await table.locator(HANDSONTABLE_ROW_SELECTOR).all();

  // Summon Handsontable textarea editor to DOM
  await tbodyRows[0].locator('[role="gridcell"]').first().dblclick();
  await table.locator(HANDSONTABLE_EDITOR_SELECTOR).waitFor({ state: "attached" });
  const inputTextArea = table.locator(HANDSONTABLE_EDITOR_SELECTOR);
  await inputTextArea.press("Escape");

  for (let i = 0; i < data.length; i++) {
    let rw = tbodyRows[i];
    const { customStyle, original, romanized, english } = data[i];
    let styleCell = rw.locator("td").nth(0);
    let origCell = rw.locator("td").nth(1);
    let romCell = needsRomanization ? rw.locator("td").nth(2) : null;
    let engCell = needsTranslation ? rw.locator("td").nth(needsRomanization ? 3 : 2) : null;

    await expect(inputTextArea).toBeAttached();
    if (customStyle) {
      await styleCell.dblclick();
      await inputTextArea.fill(customStyle);
      await inputTextArea.press("Tab");
    }
    if (original) {
      await origCell.dblclick();
      await inputTextArea.fill(original);
      await inputTextArea.press("Tab");
    }
    if (romCell && romanized) {
      await romCell.dblclick();
      await inputTextArea.fill(romanized);
      await inputTextArea.press("Tab");
    }
    if (engCell && english) {
      await engCell.dblclick();
      await inputTextArea.fill(english);
      await inputTextArea.press("Tab");
    }
  }
}

export async function fillTracklistTable(table: Locator, data: IAlbumTrack[]) {
  const tbodyRows = await table.locator(HANDSONTABLE_ROW_SELECTOR).all();

  for (let i = 0; i < data.length; i++) {
    let rw = tbodyRows[i];
    const { discNo, trackNo, pageTitle, producerCredit, singerCredit } = data[i];
    let dnCell = rw.locator("td").nth(0);
    let tnCell = rw.locator("td").nth(1);
    let pageTitleCell = rw.locator("td").nth(2);
    let prodCreditsCell = rw.locator("td").nth(3);
    let singerCreditsCell = rw.locator("td").nth(4);

    if (discNo) {
      await dnCell.dblclick();
      await table.locator(HANDSONTABLE_EDITOR_SELECTOR).waitFor({ state: "attached" });
      const inputTextArea = table.locator(HANDSONTABLE_EDITOR_SELECTOR);
      await inputTextArea.fill("" + discNo);
      await inputTextArea.press("Tab");
    }
    if (trackNo) {
      await tnCell.dblclick();
      await table.locator(HANDSONTABLE_EDITOR_SELECTOR).waitFor({ state: "attached" });
      const inputTextArea = table.locator(HANDSONTABLE_EDITOR_SELECTOR);
      await inputTextArea.fill("" + trackNo);
      await inputTextArea.press("Tab");
    }
    if (pageTitle) {
      await pageTitleCell.dblclick();
      await table.locator(HANDSONTABLE_EDITOR_SELECTOR).waitFor({ state: "attached" });
      const inputTextArea = table.locator(HANDSONTABLE_EDITOR_SELECTOR);
      await inputTextArea.fill(pageTitle);
      await inputTextArea.press("Tab");
    }
    if (producerCredit) {
      await prodCreditsCell.dblclick();
      await table.locator(HANDSONTABLE_EDITOR_SELECTOR).waitFor({ state: "attached" });
      const inputTextArea = table.locator(HANDSONTABLE_EDITOR_SELECTOR);
      await inputTextArea.fill(producerCredit);
      await inputTextArea.press("Tab");
    }
    if (singerCredit) {
      await singerCreditsCell.dblclick();
      await table.locator(HANDSONTABLE_EDITOR_SELECTOR).waitFor({ state: "attached" });
      const inputTextArea = table.locator(HANDSONTABLE_EDITOR_SELECTOR);
      await inputTextArea.fill(singerCredit);
      await inputTextArea.press("Tab");
    }
  }
}

/**
 *
 * @param table
 * @param data
 */
export async function fillDiscographyTable(
  table: Locator,
  data: (IProducerDiscographySongItem | IProducerDiscographyAlbumItem)[],
  forAlbumsList: boolean = false,
) {
  const tbodyRows = await table.locator(HANDSONTABLE_ROW_SELECTOR).all();
  for (let i = 0; i < data.length; i++) {
    let rw = tbodyRows[i];
    let pageTitleCell = rw.locator("td").nth(0);
    let moreParamsCell = rw.locator("td").nth(1);
    let isCompilationAlbumCell = forAlbumsList ? rw.locator("td").nth(2) : null;

    await pageTitleCell.dblclick();
    const inputTextArea = table.locator(HANDSONTABLE_EDITOR_SELECTOR);
    await inputTextArea.fill(data[i].page);
    await inputTextArea.press("Tab");

    if (data[i].additionalParameters) {
      await moreParamsCell.dblclick();
      await inputTextArea.fill(data[i].additionalParameters);
      await inputTextArea.press("Tab");
    }

    if (forAlbumsList && (data[i] as IProducerDiscographyAlbumItem).isCompilation) {
      const cb = isCompilationAlbumCell!.locator('input[type="checkbox"]');
      await cb.click();
      await expect(isCompilationAlbumCell!.getByRole("checkbox")).toBeChecked();
    }
  }
}