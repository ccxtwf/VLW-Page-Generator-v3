import { pasteContextMenuItem, renderMarkupContextMenuItem } from "./factory";

export const tracklistContextMenu = {
  items: {
    copy: { disabled: false },
    cut: { disabled: false },
    paste: pasteContextMenuItem(null, "Paste"),
    sp1: "---------",
    undo: { disabled: false },
    redo: { disabled: false },
    sp2: "---------",
    producerMarkup: renderMarkupContextMenuItem(3, "Add producer markup"),
    singerMarkup: renderMarkupContextMenuItem(4, "Add singer markup"),
    sp3: "---------",
    row_above: { disabled: false },
    row_below: { disabled: false },
    remove_row: { disabled: false },
    clear_column: { disabled: false },
  },
};
