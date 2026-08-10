<script lang="ts">
  /**
   * Written with help by Claude
   * A thin, reusable Svelte 5 wrapper around Handsontable.
   *
   * Usage:
   *   <script>
   *     let rows = $state([
   *       ['Alice', 29, true],
   *       ['Bob', 34, false],
   *     ]);
   *   &lt;/script>
   *
   *   <HotTable
   *     data={rows}
   *     colHeaders={['Name', 'Age', 'Active']}
   *     columns={[{ type: 'text' }, { type: 'numeric' }, { type: 'checkbox' }]}
   *     height={300}
   *   />
   *
   * Requires: npm install handsontable
   */
  import { onMount, onDestroy } from "svelte";
  import Handsontable, { type HotInstance, type GridSettings } from "handsontable";
  import { getTheme } from "handsontable/themes";
  import { HANDSONTABLE_LICENSE_KEY } from "../../../config";

  type Constructor<T = any> = new (...args: any[]) => T;

  interface HandsontableProps extends Pick<
    GridSettings,
    | "colHeaders"
    | "rowHeaders"
    | "height"
    | "width"
    | "licenseKey"
    | "columns"
    | "contextMenu"
    | "autoWrapRow"
    | "autoWrapCol"
    | "manualColumnResize"
    | "selectionMode"
    | "stretchH"
  > {
    id?: string;
    class?: string;
    data: object[];
    hot?: HotInstance;
    dataSchema: Constructor;
    settings?: GridSettings;
    onReady?: (hot: Handsontable) => void;
  }

  let {
    id,
    class: cssClass,
    data,
    hot = $bindable(),
    dataSchema: ClassRef,
    colHeaders = true,
    rowHeaders = true,
    height = "auto",
    width = "100%",
    columns = undefined,
    stretchH = "all",
    selectionMode = "multiple",
    contextMenu = undefined,
    autoWrapRow = true,
    autoWrapCol = true,
    manualColumnResize = true,

    licenseKey = HANDSONTABLE_LICENSE_KEY,
    settings = {}, // any extra Handsontable settings you want to pass through
    onReady = undefined, // optional callback: (hotInstance) => void
  }: HandsontableProps = $props();

  let container: HTMLDivElement; // oxlint-disable-line no-unassigned-vars

  /**
   * Get the latest data as passed to (and later processed within)
   * the Handsontable component
   */
  export function getLatestData() {
    if (!hot) {
      return [];
    }
    return (hot!.getSourceData() as object[]).map((value) => {
      return new ClassRef(value);
    });
  }

  onMount(() => {
    hot = new Handsontable(container, {
      data, // pass initial state only
      theme: getTheme("main"),
      colHeaders,
      columns,
      rowHeaders,
      height,
      width,
      contextMenu,
      autoWrapRow,
      autoWrapCol,
      manualColumnResize,
      selectionMode,
      stretchH,
      licenseKey,
      ...settings,
    });

    onReady?.(hot);
  });

  /**
   * Push external changes to `data` into the grid, but skip the round-trip
   * when the change originated from Handsontable itself.
   */
  $effect(() => {
    // reading `data` here registers the dependency
    const snapshot = $state.snapshot(data);
    if (hot && !hot.isDestroyed) {
      hot.loadData(snapshot);
    }
  });

  /**
   * Note that changes made to the data state in Handsontable are not immediately
   * reflected on the models' data state (as handled by `formData` on the main
   * Svelte form components)
   */

  onDestroy(() => {
    hot?.destroy();
  });
</script>

<div
  {id}
  class={cssClass}
  bind:this={container}
></div>