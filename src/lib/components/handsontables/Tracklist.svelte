<script lang="ts">
  import Handsontable from "./Handsontable.svelte";
  import type { SvelteComponent } from "svelte";

  import AlbumTrackData from "../../models/children/AlbumTrackData.svelte";

  import { tracklistContextMenu } from "./contextMenus/tracklist";

  import { VOCALOID_LYRICS_WIKI_ARTICLE_ENTRYPOINT } from "../../../config";
  import { handleInputEvent } from "./utils";
  import { getOtherMediaWikiPageName } from "../../utils/urlUtils";

  let child: SvelteComponent | null = null;

  interface TracklistTableProps {
    id: string;
    class: string;
    data: AlbumTrackData[];
  }

  let { id, class: className, data }: TracklistTableProps = $props();

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
    },
    { data: "producerCredit", type: "text" },
    { data: "singerCredit", type: "text" },
  ];

  /**
   * Event handler:
   * When a URL linking to a VLW page is copied/inputted into the
   * corresponding column, immediately truncate the given URL so it
   * shows the wiki page name instead
   */
  const onVlwPageInput = handleInputEvent("pageTitle", (change) => {
    const page = getOtherMediaWikiPageName(
      (change[2] as string) || "",
      VOCALOID_LYRICS_WIKI_ARTICLE_ENTRYPOINT,
    );
    if (page) {
      change[3] = `[[${page}]]`;
    }
  });

  export function getLatestData() {
    return child?.getLatestData();
  }
</script>

<Handsontable
  {id}
  class={className}
  bind:this={child}
  {data}
  dataSchema={AlbumTrackData}
  rowHeaders={true}
  colHeaders={headerText}
  columns={columnDefinitions}
  contextMenu={tracklistContextMenu}
  settings={{
    beforeChange: onVlwPageInput,
    colWidths: [50, 50, 200, 200, 200],
    rowHeights: 30,
    minSpareRows: 0,
  }}
/>