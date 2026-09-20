import { translate } from "../../../../i18n";
import {
  insertMultipleRowsMenuItem,
  pasteContextMenuItem,
  renderMarkupContextMenuItem,
} from "./factory";

export const tracklistContextMenu = {
  items: {
    copy: { disabled: false },
    cut: { disabled: false },
    paste: pasteContextMenuItem({ name: translate("handsontable.paste") }),
    sp1: "---------",
    undo: { disabled: false },
    redo: { disabled: false },
    sp2: "---------",
    producerMarkup: renderMarkupContextMenuItem({
      colId: 3,
      name: translate("handsontable.addProducerMarkup"),
    }),
    singerMarkup: renderMarkupContextMenuItem({
      colId: 4,
      name: translate("handsontable.addSingerMarkup"),
    }),
    sp3: "---------",
    row_above: { disabled: false },
    row_below: { disabled: false },
    insert_n_rows: insertMultipleRowsMenuItem(),
    remove_row: { disabled: false },
    clear_column: { disabled: false },
  },
};