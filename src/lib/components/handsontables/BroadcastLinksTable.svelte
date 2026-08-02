<script lang="ts">
  import Handsontable, { type ChangeSource, type ColumnSettings } from "handsontable";

  import { HANDSONTABLE_LICENSE_KEY } from "../../../config";
  import { onMount } from "svelte";

  import { processInsertedLink, sharedContextMenuOptions } from "./utils";
  import { PV_SERVICES } from "../../../constants";
  import type { PlayLinkData } from "../../../schemas/form";

  interface BroadcastLinksTable {
    id: string;
    class: string;
    data: PlayLinkData[];
  }

  let container: HTMLDivElement; // oxlint-disable-line no-unassigned-vars
  let hot: Handsontable;

  let { id, class: className, data = $bindable([]) }: BroadcastLinksTable = $props();

  function handleCellChange(changes: any[][] | null, source: ChangeSource) {
    for (let change of changes || []) {
      let [rowId, colId, oldValue, newValue] = change;
      if (oldValue === newValue || colId !== 1) {
        continue;
      }

      // changed cell is URL
      const referUrl = PV_SERVICES.find(({ re }) => {
        return newValue.match(re) !== null;
      });

      // no match is found
      if (!referUrl) {
        continue;
      }

      hot.setDataAtCell(rowId, 0, referUrl.site); // set description automatically
      newValue = processInsertedLink(newValue, referUrl);
      hot.setDataAtCell(rowId, colId, newValue);
    }
  }

  onMount(() => {
    const headerText: string[] = ["Site", "URL", "Reprint?", "Auto-gen?", "Deleted?", "View Count"];
    const columnDefinitions: ColumnSettings[] = [
      {
        type: "dropdown",
        source: PV_SERVICES.map((el) => el.site),
        strict: false,
        allowInvalid: true,
        validator: undefined,
      },
      {
        type: "text",
        renderer: "url",
      },
      { type: "checkbox", className: "htCenter htMiddle" },
      { type: "checkbox", className: "htCenter htMiddle" },
      { type: "checkbox", className: "htCenter htMiddle" },
      { type: "text" },
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
      startRows: 5,
      minSpareRows: 1,
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