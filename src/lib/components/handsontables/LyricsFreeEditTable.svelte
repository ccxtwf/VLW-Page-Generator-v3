<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Handsontable, { type HotInstance } from "handsontable";
  import { getTheme } from "handsontable/themes";
  import { lyricsEditContextMenu } from "./contextMenus/lyricsEdit";

  import LyricRow from "../../models/children/LyricsRow.svelte";
  import { HANDSONTABLE_LICENSE_KEY } from "../../../config";
  import {
    addColumnsAtIndexToTheLeftToToggle,
    addColumnsAtIndexToTheRightToToggle,
    determineColumnHeaders,
    removeColumnsAtIndexFromToggle,
  } from "../../utils/lyricsUtils";
  import type { ThemeChangedEventPayload } from "../../../schemas/events";

  interface LyricsTableFreeEditProps {
    id: string;
    class: string;
    toggleText: string;
  }

  let hot: HotInstance | undefined = $state();
  let container: HTMLDivElement; // oxlint-disable-line no-unassigned-vars

  let { id, class: cssClass, toggleText = $bindable("") }: LyricsTableFreeEditProps = $props();

  let headers = $derived(determineColumnHeaders(toggleText));

  let colHeaders: string[] = $derived(["Custom style", ...$state.snapshot(headers)]);

  $effect(() => {
    if (!hot) {
      return;
    }

    const oldColCount = hot.countCols();

    hot.updateSettings({
      colHeaders,
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

  export function getData() {
    return !hot || hot.isDestroyed
      ? []
      : hot.getData().map((row) => {
          let [a, b, c, d, ...e] = row;
          return new LyricRow({
            customStyle: (a as string) || "",
            original: (b as string) || "",
            romanized: (c as string) || "",
            english: (d as string) || "",
            additionalColumns: e.map((f) => (f as string) || ""),
          });
        });
  }

  const cbWatchTheme = (event: CustomEvent<ThemeChangedEventPayload>) => {
    hot?.updateSettings({ theme: getTheme(event.detail.theme) });
  };

  onMount(() => {
    hot = new Handsontable(container, {
      colHeaders,
      renderer(hotInstance, _td, _row, col, _prop, _value, _cellProperties) {
        let rendererKey = "lyrics";
        if (col === 0) {
          rendererKey = "lyrics-custom-style";
        }
        const renderer = Handsontable.renderers.getRenderer(rendererKey);
        return renderer(hotInstance, _td, _row, col, _prop, _value, _cellProperties);
      },
      theme: getTheme(window._theme || "auto"),
      rowHeaders: true,
      height: "auto",
      width: "100%",
      contextMenu: lyricsEditContextMenu,
      autoWrapRow: true,
      autoWrapCol: true,
      manualColumnResize: true,
      selectionMode: "multiple",
      stretchH: "all",
      startRows: 20,
      minCols: 2,
      maxCols: 6,
      afterCreateCol(index, amount, source) {
        if (source === "ContextMenu.columnLeft") {
          toggleText = addColumnsAtIndexToTheLeftToToggle(toggleText, index, amount);
        } else {
          toggleText = addColumnsAtIndexToTheRightToToggle(toggleText, index, amount);
        }
      },
      afterRemoveCol(_index, _amount, physicalColumns, _source) {
        toggleText = removeColumnsAtIndexFromToggle(toggleText, physicalColumns);
      },
      licenseKey: HANDSONTABLE_LICENSE_KEY,
    });

    /**
     * Listen to changes set upon the page's theme
     */
    window.addEventListener("themeChanged", cbWatchTheme);
  });

  onDestroy(() => {
    hot?.destroy();
    window.removeEventListener("themeChanged", cbWatchTheme);
  });
</script>

<div
  {id}
  class={cssClass}
  bind:this={container}
></div>