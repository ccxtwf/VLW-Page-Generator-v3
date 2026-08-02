<script lang="ts">
  import Handsontable, {
    type CellChange,
    type ChangeSource,
    type ColumnSettings,
  } from "handsontable";

  import { HANDSONTABLE_LICENSE_KEY } from "../../../config";
  import { onMount } from "svelte";
  import type { ExternalLink } from "../../../schemas/form";

  import { sharedContextMenuOptions, processInsertedLink, stringValueFormatter } from "./utils";
  import { RECOGNIZED_LINKS } from "../../../constants";

  interface ExternalLinksTable {
    id: string;
    class: string;
    data: ExternalLink[];
    forProducerPage?: boolean;
  }

  let container: HTMLDivElement; // oxlint-disable-line no-unassigned-vars
  let hot: Handsontable;

  let {
    id,
    class: className,
    data = $bindable([]),
    forProducerPage,
  }: ExternalLinksTable = $props();

  function handleCellChange(changes: CellChange[] | null, source: ChangeSource) {
    for (let change of changes || []) {
      let [rowId, colId, oldValue, newValue] = change;
      if (oldValue === newValue || colId !== 0) {
        continue;
      }

      // changed cell is URL
      const referUrl = RECOGNIZED_LINKS.find(({ re }) => {
        return newValue?.toString()?.match(re);
      });

      // match not found
      if (!referUrl) {
        continue;
      }

      hot.setDataAtCell(rowId, 1, referUrl.site); // set description automatically
      newValue = processInsertedLink(newValue as string, referUrl, {
        bilibili: false,
      });
      hot.setDataAtCell(rowId, colId, newValue);
    }
  }

  onMount(() => {
    const headerText: string[] = ["URL", "Description", "Official"];
    const columnDefinitions: ColumnSettings[] = [
      {
        data: "url",
        type: "text",
        renderer: "url",
        formatter: stringValueFormatter,
      },
      {
        data: "description",
        type: "text",
      },
      {
        data: "isOfficial",
        type: "checkbox",
        className: "htCenter htMiddle",
      },
    ];
    if (forProducerPage) {
      headerText.push("Media", "Inactive?");
      columnDefinitions.push(
        {
          data: "isMedia",
          type: "checkbox",
          className: "htCenter htMiddle",
        },
        {
          data: "isInactive",
          type: "checkbox",
          className: "htCenter htMiddle",
        },
      );
    }

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