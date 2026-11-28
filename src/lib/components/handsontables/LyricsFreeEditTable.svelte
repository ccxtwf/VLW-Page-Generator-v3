<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Handsontable, { type HotInstance } from "handsontable/base";
  import { getRenderer } from "handsontable/renderers";
  import { getTheme } from "handsontable/themes";
  import { getLyricsEditContextMenu } from "./contextMenus/lyricsEdit";

  import Song from "../../models/Song.svelte.js";
  import LyricRow from "../../models/children/LyricsRow.svelte";
  import type { ILyricsRow } from "../../models/schema.js";
  import { HANDSONTABLE_LICENSE_KEY } from "../../../config";
  import {
    addColumnsAtIndexToTheLeftToToggle,
    determineColumnHeaders,
    removeColumnsAtIndexFromToggle,
    mapHandsontableLyricsData,
  } from "../../utils/lyricsUtils";
  import { isDarkModeActive } from "../../utils/themeUtils.js";
  import { registerUndoRedoActionOnDataLoad } from "./utils";
  import type { LyricsThemeToggledEventPayload } from "../../../schemas/events";
  import { LyricsTableHeader } from "../../../constants/tableHeaders";

  interface LyricsTableFreeEditProps {
    id: string;
    class: string;
    toggleText: string;
    resetTable: () => void;
  }

  let hot: HotInstance | undefined = $state();
  let container: HTMLDivElement; // oxlint-disable-line no-unassigned-vars

  let {
    id,
    class: cssClass,
    toggleText = $bindable(""),
    resetTable,
  }: LyricsTableFreeEditProps = $props();

  let headers = $derived(determineColumnHeaders(toggleText));

  let colHeaders: string[] = $derived([LyricsTableHeader.STYLE, ...$state.snapshot(headers)]);
  let colWidths: number[] = $derived([100, ...Array(headers.length).fill(250)]);

  $effect(() => {
    if (!hot) {
      return;
    }

    const oldColCount = hot.countCols();

    hot.updateSettings({
      colHeaders,
      colWidths,
    });

    if (colHeaders.length !== oldColCount) {
      const n = colHeaders.length;
      const addCells = Math.max(0, n - oldColCount);
      const data = hot.getData().map((row) => {
        const newRow = row.slice(0, n).concat(Array(addCells).fill(null));
        return newRow;
      });
      hot.updateData(data);
    }
  });

  export function loadData(data: string[][]): void {
    hot!.loadData(data);
  }

  export function resetState(): void {
    hot!.loadData(
      Array(Song.defaultStartingRows)
        .fill(null)
        .map(() => Array(4).fill("")),
    );
  }

  export function getData(): [LyricRow[], boolean] {
    return !hot || hot.isDestroyed
      ? [[], false]
      : mapHandsontableLyricsData(headers, hot.getData(), LyricRow);
  }

  export function editAction(fn: (data: unknown[][]) => string[][]): void {
    const data = hot!.getData();
    const transformed = fn(structuredClone(data));
    registerUndoRedoActionOnDataLoad(hot!, data, transformed, "customLyricsEditAction");
    hot!.updateData(transformed);
  }

  const cbWatchTheme = (event: CustomEvent<LyricsThemeToggledEventPayload>) => {
    hot?.updateSettings({
      theme: getTheme(event.detail.isDarkMode ? "dark" : "light"),
    });
  };

  onMount(() => {
    hot = new Handsontable(container, {
      colHeaders,
      renderer(hotInstance, _td, _row, col, _prop, _value, _cellProperties) {
        let rendererKey = "lyrics";
        if (col === 0) {
          rendererKey = "lyrics-custom-style";
        }
        const renderer = getRenderer(rendererKey);
        return renderer(hotInstance, _td, _row, col, _prop, _value, _cellProperties);
      },
      theme: getTheme(isDarkModeActive() ? "dark" : "light"),
      rowHeaders: true,
      height: "auto",
      width: "100%",
      contextMenu: getLyricsEditContextMenu({ resetTable }),
      autoWrapRow: true,
      autoWrapCol: true,
      manualColumnResize: true,
      selectionMode: "multiple",
      stretchH: "all",
      startRows: 20,
      minCols: 2,
      maxCols: 6,
      startCols: 4,
      colWidths: [100, 250, 250, 250],
      trimWhitespace: true,
      fillHandle: true,
      imeFastEdit: true,
      minSpareRows: 1,
      afterCreateCol(index, amount, source) {
        DEBUG && console.log("CREATED COL", index, amount, source);
        toggleText = addColumnsAtIndexToTheLeftToToggle((toggleText || "").trim(), index, amount);
      },
      afterRemoveCol(_index, _amount, physicalColumns, _source) {
        toggleText = removeColumnsAtIndexFromToggle((toggleText || "").trim(), physicalColumns);
      },
      licenseKey: HANDSONTABLE_LICENSE_KEY,
    });

    /**
     * Listen to changes set upon the theme toggle
     */
    window.addEventListener("lyricsThemeToggled", cbWatchTheme);
  });

  onDestroy(() => {
    hot?.destroy();
    window.removeEventListener("lyricsThemeToggled", cbWatchTheme);
  });
</script>

<div
  {id}
  class={cssClass}
  bind:this={container}
></div>