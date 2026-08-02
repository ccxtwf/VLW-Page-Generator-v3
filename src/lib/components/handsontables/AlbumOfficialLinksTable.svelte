<script lang="ts">
  import Handsontable, {
    type CellChange,
    type ChangeSource,
    type ColumnSettings,
  } from "handsontable";

  import { HANDSONTABLE_LICENSE_KEY } from "../../../config";
  import { onMount } from "svelte";

  import { ALBUM_STREAMING_LINKS } from "../../../constants";
  import type { AlbumBroadcastLink } from "../../../schemas/form";
  import { sharedContextMenuOptions } from "./utils";

  interface AlbumOfficialLinksTable {
    id: string;
    class: string;
    data: AlbumBroadcastLink[];
  }

  let container: HTMLDivElement; // oxlint-disable-line no-unassigned-vars
  let hot: Handsontable;

  let { id, class: className, data = $bindable([]) }: AlbumOfficialLinksTable = $props();
  let selected = $derived(new Set(data.map(({ idx }) => idx).filter((e) => !!e)));

  function handleCellChange(changes: CellChange[] | null, source: ChangeSource) {
    for (const change of changes || []) {
      const [rowId, colId, oldValue, newValue] = change;
      if (colId !== "site") {
        continue;
      }
      const getKeyValuePair = (o: unknown) => {
        if (typeof o === "object") {
          const { key = null, value = null } = (o as { key?: any; value?: any }) || {};
          // Return null for custom inputs
          return typeof key === "number" ? [key, value] : [null, value];
        }
        return [null, o];
      };
      const [a, b] = getKeyValuePair(newValue);
      data[rowId].idx = a;
      data[rowId].site = b;
    }
  }

  onMount(() => {
    const headerText: string[] = ["Type", "URL"];
    const columnDefinitions: ColumnSettings[] = [
      {
        data: "site",
        type: "dropdown",
        /**
         * Only one of each item in ALBUM_STREAMING_LINKS may be filled
         * on each page at a time
         *
         * @param query
         * @param callback
         */
        source(query: string, callback: (items: unknown[]) => void) {
          const unselected = ALBUM_STREAMING_LINKS.filter(({ idx }) => {
            return !selected.has(idx);
          }).map(({ name, idx }) => ({ key: idx, value: name }));
          callback(unselected);
        },
        strict: false,
        allowInvalid: true,
        validator: undefined,
      },
      {
        data: "url",
        type: "text",
        renderer: "url",
      },
    ];

    hot = new Handsontable(container, {
      data,
      rowHeaders: true,
      colHeaders: headerText,
      columns: columnDefinitions,
      width: "100%",
      height: "auto",
      contextMenu: sharedContextMenuOptions,
      autoWrapRow: true,
      autoWrapCol: true,
      manualColumnResize: true,
      selectionMode: "multiple",
      stretchH: "all",
      rowHeights: 30,
      afterChange: handleCellChange,
      licenseKey: HANDSONTABLE_LICENSE_KEY,
    });

    $effect(() => {
      hot.updateData($state.snapshot(data));
    });
  });
</script>

<div
  {id}
  class={className}
  bind:this={container}
></div>