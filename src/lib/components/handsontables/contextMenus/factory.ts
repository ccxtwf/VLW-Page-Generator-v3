import type { CellCoords, HotInstance } from "handsontable";
import type { MenuItemConfig } from "handsontable/plugins/contextMenu";
import { renderListInWikiInternalLinkMarkup } from "../../../utils/utils";

interface ContextMenuSelection {
  start?: CellCoords;
  end?: CellCoords;
}

type ContextMenuFactory = (colId: number | null, name: string | (() => string)) => MenuItemConfig;

/**
 * Definitions for the menu config item to paste data
 */
export const pasteContextMenuItem: ContextMenuFactory = (_colId, name) => {
  return {
    name,
    callback(this: HotInstance, _key: string, selection: unknown[], _clickEvent: MouseEvent) {
      let {
        start: { row: fromRow = null, col: fromCol = null } = {},
        end: { row: toRow = null, col: toCol = null } = {},
      } = (selection || [{}])[0] as ContextMenuSelection;
      if ([fromRow, fromCol, toRow, toCol].some((e) => e === null)) {
        return;
      }
      if (fromRow! > toRow!) {
        [fromRow, toRow] = [toRow, fromRow];
      }
      if (fromCol! > toCol!) {
        [fromCol, toCol] = [toCol, fromCol];
      }

      navigator.clipboard
        .readText()
        .then((str) => {
          const pasted = str.split(/\n/).map((line) => line.split(/\t/));

          let numExistingRows = this.getData().length;
          let numOverlappedExistingRows = Math.min(numExistingRows - fromRow!, pasted.length);
          let numOverflowedRows = pasted.length - numOverlappedExistingRows;
          const changes: (number | string)[][] = [];

          if (fromRow === toRow && fromCol === toCol) {
            // Starting cell is a single cell
            // In this case, limit the paste range to rows after fromRow and columns after fromCol
            let numOverlappedExistingColumns = Math.min(
              5,
              Math.max(...pasted.map((line) => line.length)),
            );
            for (let i = 0; i < numOverlappedExistingRows; i++) {
              for (let j = 0; j < numOverlappedExistingColumns; j++) {
                changes.push([fromRow! + i, fromCol! + j, pasted[i][j] || ""]);
              }
            }
            for (let i = 0; i < numOverflowedRows; i++) {
              for (let j = 0; j < numOverlappedExistingColumns; j++) {
                changes.push([
                  numExistingRows + i,
                  fromCol! + j,
                  pasted[numOverlappedExistingRows + i][j] || "",
                ]);
              }
            }
          } else {
            // Starting cell is a multi-cell range
            // In this case, limit the paste range to the columns within fromCol & toCol,
            // and to rows below (equal to or more than) fromRow
            for (let i = 0; i < numOverlappedExistingRows; i++) {
              for (let j = fromCol!; j <= toCol!; j++) {
                changes.push([fromRow! + i, fromCol! + j, pasted[i][j - fromCol!] || ""]);
              }
            }
            for (let i = 0; i < numOverflowedRows; i++) {
              for (let j = fromCol!; j <= toCol!; j++) {
                changes.push([
                  numExistingRows + i,
                  fromCol! + j,
                  pasted[numOverlappedExistingRows + i][j - fromCol!] || "",
                ]);
              }
            }
          }

          this.setDataAtCell(changes);
        })
        .catch(() => {
          window.alert("Unable to paste! Please use keyboard command (Ctrl/Cmd + V)!");
        });
    },
  };
};

/**
 * Definitions for the menu config item to render items in a list
 * as MediaWiki internal links
 *
 * e.g. Apple, Bananas, and Coconut -> [[Apple]], [[Bananas]], and [[Coconut]]
 */
export const renderMarkupContextMenuItem: ContextMenuFactory = (colId, name) => {
  return {
    name,
    hidden(this: HotInstance) {
      const { from: { col: fromCol = null } = {}, to: { col: toCol = null } = {} } =
        (this.getSelectedRange() || [{}])[0];
      if (fromCol !== colId || toCol !== colId) {
        return true;
      }
      return false;
    },
    callback(this: HotInstance, _key: string, selection: unknown[], _clickEvent: MouseEvent) {
      const {
        start: { row: fromRow = null, col: fromCol = null } = {},
        end: { row: toRow = null, col: toCol = null } = {},
      } = (selection || [{}])[0] as ContextMenuSelection;
      if (fromRow === null || toRow === null) {
        return;
      }
      if (fromCol !== colId || toCol !== colId) {
        return;
      }
      const data = this.getData();
      for (let i = fromRow; i <= toRow; i++) {
        const row = data[i];
        let o = ((row[colId!] as string) || "").trim();
        o = renderListInWikiInternalLinkMarkup(o);
        row[colId!] = o;
      }
      this.updateData(data);
    },
  };
};

const rxMatchBolded = /^\s*('{3}|<b>)(?<text>.*)('{3}|<\/b>)\s*$/;
const rxMatchBoldedCss = /font-weight\s*:\s*bold\b\s*;*/;
const rxMatchItalicised =
  /^\s*('{2}|<i>)(?='{3,}|\s*\b)(?<text>.*)(?<='{3,}|\b\s*)('{2}|<\/i>)\s*$/;
const rxMatchItalicisedCss = /font-style\s*:\s*italic\b\s*;*/;

function getSelectedRows(hot: HotInstance) {
  const { from: { row: fromRow = null } = {}, to: { row: toRow = null } = {} } =
    (hot.getSelectedRange() || [{}])[0];
  if (fromRow === null || toRow === null) {
    return [];
  }
  const selectedRows = [];
  for (let i = fromRow; i <= toRow; i++) {
    selectedRows.push(hot.getDataAtRow(i));
  }
  return selectedRows;
}

/**
 * A helper function.
 *
 * Sets the visibility of the given context menu should be shown based on
 * if the specified style is detected in the selected range
 *
 * @param rowInlineCss
 * @param cellWikitextMarkup
 * @param doRemoveStyle
 * @returns
 */
const shouldHideLyricsFormattingOption = (
  rowInlineCss: RegExp,
  cellWikitextMarkup: RegExp,
  doRemoveStyle: boolean,
) => {
  return function (this: HotInstance) {
    const selectedRows = getSelectedRows(this);
    let isHidden;

    /**
     * Returns true if the row either 1) has the style specified in the
     * `customStyle` cell, or 2) has the style specified to the whole
     * individual lyrics cell
     *
     * @param row
     * @returns
     */
    const hasStyle = (row: unknown[]) => {
      let customStyle = (row[0] as string) || "";
      if (customStyle.match(rowInlineCss)) {
        return true;
      }
      for (let i = 1; i < row.length; i++) {
        if (((row[i] as string) || "").match(cellWikitextMarkup)) {
          return true;
        }
      }
      return false;
    };

    /**
     * Conditions to show:
     *  1) To remove style: Some of the selected rows must have the specified style
     *  2) To add style: none of the selected rows must have the specified style
     */
    isHidden = doRemoveStyle ? !selectedRows.some(hasStyle) : selectedRows.some(hasStyle);

    return isHidden;
  };
};

/**
 * A helper function.
 *
 * Prepares the callback to execute to add the given style to the `customStyle` cell.
 *
 * @param customStyle
 * @returns
 */
const addLyricsRowsStyling = (customStyle: string) => {
  return function (this: HotInstance, _key: string, selection: unknown[], _clickEvent: MouseEvent) {
    const { start: { row: fromRow = null } = {}, end: { row: toRow = null } = {} } = (selection || [
      {},
    ])[0] as ContextMenuSelection;
    if (fromRow === null || toRow === null) {
      return;
    }
    const data = this.getData();
    for (let i = fromRow; i <= toRow; i++) {
      if (((data[i][1] as string) || "").trim() === "") {
        continue;
      }
      if (!data[i][0]) {
        data[i][0] = "";
      }
      data[i][0] += customStyle;
    }
    this.updateData(data);
  };
};

/**
 * A helper function.
 *
 * Prepares the callback to execute to remove the given style from the `customStyle`
 * cell or the individual lyrics cells.
 *
 * @param customStyle
 * @returns
 */
const removeLyricsRowStyling = (rowInlineCss: RegExp, cellWikitextMarkup: RegExp) => {
  return function (this: HotInstance, _key: string, selection: unknown[], _clickEvent: MouseEvent) {
    const { start: { row: fromRow = null } = {}, end: { row: toRow = null } = {} } = (selection || [
      {},
    ])[0] as ContextMenuSelection;
    if (fromRow === null || toRow === null) {
      return;
    }
    const data = this.getData();
    for (let i = fromRow; i <= toRow; i++) {
      data[i][0] = ((data[i][0] as string) || "").replace(rowInlineCss, "");
      for (let j = 1; j < data[i].length; j++) {
        data[i][j] = ((data[i][j] as string) || "").replace(cellWikitextMarkup, "$2");
      }
    }
    this.updateData(data);
  };
};

/**
 * Bold selected rows (except for the first column, "customStyle")
 *
 * @param _colId
 * @param name
 * @returns
 */
export const boldContextMenuItem: ContextMenuFactory = (_colId, name) => {
  return {
    name,
    hidden: shouldHideLyricsFormattingOption(rxMatchBoldedCss, rxMatchBolded, false),
    callback: addLyricsRowsStyling("font-weight: bold"),
  };
};

/**
 * Italicize selected rows (except for the first column, "customStyle")
 *
 * @param _colId
 * @param name
 * @returns
 */
export const italicizeContextMenuItem: ContextMenuFactory = (_colId, name) => {
  return {
    name,
    hidden: shouldHideLyricsFormattingOption(rxMatchItalicisedCss, rxMatchItalicised, false),
    callback: addLyricsRowsStyling("font-style: italic"),
  };
};

/**
 * Unbold selected rows (except for the first column, "customStyle")
 *
 * @param _colId
 * @param name
 * @returns
 */
export const unboldContextMenuItem: ContextMenuFactory = (_colId, name) => {
  return {
    name,
    hidden: shouldHideLyricsFormattingOption(rxMatchBoldedCss, rxMatchBolded, true),
    callback: removeLyricsRowStyling(rxMatchBoldedCss, rxMatchBolded),
  };
};

/**
 * Unitalicize selected rows (except for the first column, "customStyle")
 *
 * @param _colId
 * @param name
 * @returns
 */
export const unitalicizeContextMenuItem: ContextMenuFactory = (_colId, name) => {
  return {
    name,
    hidden: shouldHideLyricsFormattingOption(rxMatchItalicisedCss, rxMatchItalicised, true),
    callback: removeLyricsRowStyling(rxMatchItalicisedCss, rxMatchItalicised),
  };
};