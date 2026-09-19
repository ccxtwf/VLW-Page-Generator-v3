import { translate } from "../../../../i18n";
import {
  pasteContextMenuItem,
  boldContextMenuItem,
  italicizeContextMenuItem,
  unboldContextMenuItem,
  unitalicizeContextMenuItem,
} from "./factory";

export interface InitCustomContextMenu {
  resetTable: () => void;
}

export const getLyricsContextMenu = ({ resetTable }: InitCustomContextMenu) => ({
  items: {
    copy: { disabled: false },
    cut: { disabled: false },
    paste: pasteContextMenuItem(null, translate("handsontable.paste")),
    sp1: "---------",
    undo: { disabled: false },
    redo: { disabled: false },
    sp2: "---------",
    bold: boldContextMenuItem(null, translate("handsontable.bold")),
    italic: italicizeContextMenuItem(null, translate("handsontable.italic")),
    unbold: unboldContextMenuItem(null, translate("handsontable.unbold")),
    unitalic: unitalicizeContextMenuItem(null, translate("handsontable.unitalic")),
    sp3: "---------",
    row_above: { disabled: false },
    row_below: { disabled: false },
    remove_row: { disabled: false },
    clear_column: { disabled: false },
    sp4: "---------",
    reset_table: {
      name: translate("handsontable.reset"),
      hidden: false,
      callback: resetTable,
    },
  },
});