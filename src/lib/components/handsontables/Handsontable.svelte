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
   *     bind:data={rows}
   *     colHeaders={['Name', 'Age', 'Active']}
   *     columns={[{ type: 'text' }, { type: 'numeric' }, { type: 'checkbox' }]}
   *     height={300}
   *   />
   *
   * Requires: npm install handsontable
   */
  import { onMount, onDestroy } from "svelte";
  import Handsontable, { type HotInstance } from "handsontable";
  import type { GridSettings } from "handsontable";
  import type { ChangeSource } from "handsontable";

  type Constructor<T = any> = new (...args: any[]) => T;

  interface HandsontableProps
    extends Pick<
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
    data = $bindable([]),
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

    licenseKey = "non-commercial-and-evaluation",
    settings = {}, // any extra Handsontable settings you want to pass through
    onReady = undefined, // optional callback: (hotInstance) => void
  }: HandsontableProps = $props();

  let container: HTMLDivElement; // oxlint-disable-line no-unassigned-vars
  let suppressSync = false; // guards against feedback loops between hot <-> data

  onMount(() => {
    const initialData = $state.snapshot(data);

    hot = new Handsontable(container, {
      // pass initial state only
      // Keep in mind that Handsontable will only handle the pure data objects,
      // in that the methods defined in the model classes will not be available
      // in the Handsontable context
      data: initialData,
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
      afterChange: (_, source) => syncFromHot(source),
      afterCreateRow: (_, __, source?: ChangeSource) => syncFromHot(source),
      afterRemoveRow: (_, __, ___, source?: ChangeSource) =>
        syncFromHot(source),
      afterCreateCol: (_, __, source?: ChangeSource) => syncFromHot(source),
      afterRemoveCol: (_, __, ___, source?: ChangeSource) =>
        syncFromHot(source),
      ...settings,
    });

    onReady?.(hot);
  });

  function syncFromHot(source?: ChangeSource): void {
    if (source === "loadData") {
      return;
    }
    suppressSync = true;
    data = (hot!.getSourceData() as object[]).map((value) => {
      return new ClassRef(value);
    });
    queueMicrotask(() => (suppressSync = false));
  }

  // Push external changes to `data` into the grid, but skip the round-trip
  // when the change originated from Handsontable itself.
  $effect(() => {
    // reading `data` here registers the dependency
    const snapshot = $state.snapshot(data);
    if (hot && !hot.isDestroyed && !suppressSync) {
      hot.loadData(snapshot);
    }
  });

  onDestroy(() => {
    hot?.destroy();
  });
</script>

<div {id} class={cssClass} bind:this={container}></div>
