<script lang="ts">
  import Handsontable, { type CellChange, type ChangeSource } from "handsontable";

  import { HANDSONTABLE_LICENSE_KEY, VOCALOID_WIKI_ARTICLE_ENTRYPOINT } from "../../../config";
  import { onMount } from "svelte";
  import type { AlbumTrackData } from "../../../schemas/form";

  import { sharedContextMenuOptions, stringValueFormatter } from "./utils";

  interface TracklistTable {
    id: string;
    class: string;
    data: AlbumTrackData[];
  }

  let container: HTMLDivElement; // oxlint-disable-line no-unassigned-vars
  let hot: Handsontable;

  let { id, class: className, data = $bindable([]) }: TracklistTable = $props();

  const rxListSeparator = /(,\s*(?!and\b)|,?\s+and\s+|\s+&\s+)/;

  function handleVlwPageUrlInputEvent(changes: (CellChange | null)[], source: ChangeSource) {
    for (let change of changes) {
      if (!change) {
        continue;
      }
      let [rowId, colId, prevValue, newValue] = change;
      let v = `${newValue || ""}`;
      if (colId === 2) {
        // Detect if inputted value in track name cell is a URL that links to VLW
        // If so, automatically change the cell value to the page title
        const ownWikiUrlHead = `${VOCALOID_WIKI_ARTICLE_ENTRYPOINT}/`;
        if (v.startsWith(ownWikiUrlHead)) {
          let wikiPageName = v.replace(ownWikiUrlHead, "");
          wikiPageName = wikiPageName.replaceAll("_", " ");
          change[3] = `[[${wikiPageName}]]`;
        }
      }
    }
  }

  onMount(() => {
    const headerText = [
      "Disk no",
      "Track no",
      "Track name/VLW Page Title",
      "Feat. Producers",
      "Feat. Singers",
    ];
    const columnDefinitions = [
      { data: "discNo", type: "numeric" },
      { data: "trackNo", type: "numeric" },
      {
        data: "pageTitle",
        type: "text",
        renderer: "vlw-internal-link",
        formatter: stringValueFormatter,
      },
      { data: "producerCredit", type: "text" },
      { data: "singerCredit", type: "text" },
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
      beforeChange: handleVlwPageUrlInputEvent,
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