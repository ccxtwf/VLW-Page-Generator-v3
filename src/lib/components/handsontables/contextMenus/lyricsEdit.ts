import type { HotInstance } from "handsontable";
import { lyricsContextMenu } from "./lyrics";

export const lyricsEditContextMenu = {
  items: {
    ...lyricsContextMenu.items,
    sp4: "---------",
    ["col_left"]: {
      disabled(this: HotInstance) {
        const {
          from: { col: fromCol },
        } = this.getSelectedRange()![0];
        // Cannot add column to the left if:
        //  1) The current position is the "customStyle" column
        //  2) The max column size is reached
        return fromCol === 0 || this.countCols() >= (this.getSettings().maxCols as number);
      },
      callback(this: HotInstance) {
        let {
          from: { col: fromCol },
          to: { col: toCol },
        } = this.getSelectedRange()![0];
        // Cannot insert column to the left of the first column
        fromCol = Math.max(fromCol!, 1);
        let amount = toCol! - fromCol! + 1;
        // Cap amount
        amount = Math.min((this.getSettings().maxCols as number) - this.countCols(), amount);
        DEBUG && console.log("INSERT LEFT", fromCol!, amount);
        this.alter("insert_col_start", fromCol! - 1, amount);
      },
    },
    ["col_right"]: {
      disabled(this: HotInstance) {
        const {
          from: { col: fromCol },
        } = this.getSelectedRange()![0];
        // Cannot add column to the right if the max column size is reached
        return fromCol === 0 || this.countCols() >= (this.getSettings().maxCols as number);
      },
      callback(this: HotInstance) {
        const {
          from: { col: fromCol },
          to: { col: toCol },
        } = this.getSelectedRange()![0];
        let amount = toCol! - fromCol! + 1;
        // Cap amount
        amount = Math.min((this.getSettings().maxCols as number) - this.countCols(), amount);
        DEBUG && console.log("INSERT RIGHT", toCol!, amount);
        this.alter("insert_col_end", toCol! - 1, amount);
      },
    },
    ["remove_col"]: {
      disabled(this: HotInstance) {
        // Cannot remove column if the cursor is at the first (`customStyle`) column
        for (let {
          from: { col: fromCol },
          to: { col: toCol },
        } of this.getSelectedRange() || []) {
          if (fromCol! > toCol!) {
            [fromCol, toCol] = [toCol!, fromCol!];
          }
          if (fromCol === 0) {
            return true;
          }
        }
        return false;
      },
    },
  },
};
