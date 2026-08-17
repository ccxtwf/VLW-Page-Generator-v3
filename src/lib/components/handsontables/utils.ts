import { type CellChange, type ChangeSource } from "handsontable";
import {
  convertAvidToBvId,
  convertTwitterLink,
  standardizeYoutubeLink,
  upgradeInsecureHttpLink,
} from "../../utils/urlUtils";
import { PV_SERVICE_PROVIDER } from "../../../constants";

/**
 * Cast a column data type as a trimmed string.
 *
 * @param v
 * @returns
 */
export function stringValueFormatter(v: unknown): string {
  return ("" + v).trim();
}

export function handleInputEvent(checkColId: string, cb: (change: CellChange) => void) {
  function _handler(changes: (CellChange | null)[], source: ChangeSource) {
    if (
      ["edit", "CopyPaste.cut", "CopyPaste.paste", "UndoRedo.redo", "UndoRedo.undo"].indexOf(
        source,
      ) < 0
    ) {
      return;
    }
    for (let change of changes) {
      if (!change) {
        continue;
      }
      let [_rowId, colId, _prevValue, _newValue] = change;
      if (colId === checkColId) {
        cb(change);
      }
    }
  }
  return _handler;
}

/**
 * Automatically process an inserted link.
 *
 * @param s
 * @param referUrl
 * @param options
 * @returns
 */
export function processInsertedLink(
  s: string,
  referUrl: { site?: string },
  { bilibili = true }: { bilibili?: boolean } = {},
) {
  if (referUrl.site === PV_SERVICE_PROVIDER.youtube) {
    s = standardizeYoutubeLink(s);
  }
  if (referUrl.site === PV_SERVICE_PROVIDER.xitter) {
    s = convertTwitterLink(s);
  }
  if (bilibili && referUrl.site === PV_SERVICE_PROVIDER.bilibili) {
    s = convertAvidToBvId(s);
  }
  if ((Object.values(PV_SERVICE_PROVIDER) as string[]).includes(referUrl.site || "")) {
    s = upgradeInsecureHttpLink(s);
  }
  return s;
}