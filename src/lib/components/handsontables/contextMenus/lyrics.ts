import {
  pasteContextMenuItem,
  boldContextMenuItem,
  italicizeContextMenuItem,
  unboldContextMenuItem,
  unitalicizeContextMenuItem,
} from "./factory";

export const lyricsContextMenu = {
  items: {
    copy: { disabled: false },
    cut: { disabled: false },
    paste: pasteContextMenuItem(null, "Paste"),
    sp1: "---------",
    undo: { disabled: false },
    redo: { disabled: false },
    sp2: "---------",
    bold: boldContextMenuItem(null, "Bold row"),
    italic: italicizeContextMenuItem(null, "Italicize row"),
    unbold: unboldContextMenuItem(null, "Unbold row"),
    unitalic: unitalicizeContextMenuItem(null, "Unitalicize row"),
    sp3: "---------",
    row_above: { disabled: false },
    row_below: { disabled: false },
    remove_row: { disabled: false },
    clear_column: { disabled: false },
  },
};
