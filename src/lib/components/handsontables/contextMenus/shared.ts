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
    remove_row: true,
    clear_column: true,
  },
};