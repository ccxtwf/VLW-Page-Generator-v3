import { insertMultipleRowsMenuItem } from "./factory";

/**
 * Shared context menu for various Handsontable elements
 */
export const sharedContextMenuOptions = {
  items: {
    copy: { disabled: false },
    cut: { disabled: false },
    sp1: "---------",
    undo: true,
    redo: true,
    sp2: "---------",
    row_above: true,
    row_below: { disabled: false },
    insert_n_rows: insertMultipleRowsMenuItem(),
    remove_row: true,
    clear_column: true,
  },
};