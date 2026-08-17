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

  let {
    id,
    class: cssClass,
    toggleText = $bindable(""),
  }: LyricsTableFreeEditProps = $props();

  let headers = $derived(determineColumnHeaders(toggleText));

  let colHeaders: string[] = $derived([
    "Custom style",
    ...$state.snapshot(headers),
  ]);

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

  export function loadData(data: string[][]) {
    hot!.loadData(data);
  }

  export function getData() {
    const i = headers.findIndex((h) => h.includes("English"));
    return !hot || hot.isDestroyed
      ? []
      : hot.getData().map((row) => {
          let [customStyle, original, ...c] = row;
          let romanized: string | undefined = undefined;
          let english: string | undefined = undefined;
          let offset: number = 0;
          switch (i) {
            case -1:
              // English column not found
              if (c.length) {
                romanized = (c[0] as string) || "";
                offset = 1;
              }
              break;
            case 1:
              // Found English at second column
              english = (c[0] as string) || "";
              offset = 1;
              break;
            default:
              // Ideally, the English column would be at the third column
              // No guarantee is made
              romanized = (c[0] as string) || "";
              english = (c[1] as string) || "";
              offset = 2;
              break;
          }

          return new LyricRow({
            customStyle: (customStyle as string) || "",
            original: (original as string) || "",
            romanized,
            english,
            additionalColumns: c.slice(offset).map((e) => (e as string) || ""),
          });
        });
  }

  export function editAction(fn: (data: unknown[][]) => string[][]) {
    const data = hot!.getData();
    const transformed = fn(data);
    hot!.loadData(transformed);

    // Doesn't work as well as I would like?
    // hot!.getPlugin("undoRedo").done(() => ({
    //   actionType: "load_data",
    //   undo: (hot: HotInstance) => {
    //     hot.loadData(data);
    //   },
    //   redo: (hot: HotInstance) => {
    //     hot.loadData(transformed);
    //   },
    // }));
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
        return renderer(
          hotInstance,
          _td,
          _row,
          col,
          _prop,
          _value,
          _cellProperties,
        );
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
      startCols: 4,
      afterCreateCol(index, amount, source) {
        DEBUG && console.log("CREATED COL", index, amount, source);
        toggleText = addColumnsAtIndexToTheLeftToToggle(
          toggleText,
          index,
          amount,
        );
      },
      afterRemoveCol(_index, _amount, physicalColumns, _source) {
        toggleText = removeColumnsAtIndexFromToggle(
          toggleText,
          physicalColumns,
        );
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

<div {id} class={cssClass} bind:this={container}></div>
