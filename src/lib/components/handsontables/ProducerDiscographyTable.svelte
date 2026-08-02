<script lang="ts">
  import Handsontable, { type ColumnSettings } from "handsontable";

  import { HANDSONTABLE_LICENSE_KEY } from "../../../config";
  import { onMount } from "svelte";
  import type { ProducerDiscographyItem } from "../../../schemas/form";

  import { sharedContextMenuOptions, stringValueFormatter } from "./utils";

  interface ProducerDiscographyTable {
    id: string;
    class: string;
    data: ProducerDiscographyItem[];
    forAlbums?: boolean;
  }

  let container: HTMLDivElement; // oxlint-disable-line no-unassigned-vars
  let hot: Handsontable;

  let {
    id,
    class: className,
    data = $bindable([]),
    forAlbums,
  }: ProducerDiscographyTable = $props();

  onMount(() => {
    const headerText: string[] = [
      forAlbums ? "Album pages" : "Song pages",
      "Additional template parameters",
    ];
    const columnDefinitions: ColumnSettings[] = [
      {
        data: "page",
        type: "text",
        renderer: "vlw-page",
        valueFormatter: stringValueFormatter,
      },
      {
        data: "additionalParameters",
        type: "text",
        valueFormatter: stringValueFormatter,
      },
    ];
    if (forAlbums) {
      headerText.push("Is Compilation?");
      columnDefinitions.push({
        data: "isCompilation",
        type: "checkbox",
        className: "htCenter htMiddle",
      });
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
      licenseKey: HANDSONTABLE_LICENSE_KEY,
    });
  });
</script>

<div
  {id}
  class={className}
  bind:this={container}
></div>