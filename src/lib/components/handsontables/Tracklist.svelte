<script lang="ts">
  import Handsontable from "./Handsontable.svelte";

  import AlbumTrackData from "../../models/children/AlbumTrackData.svelte";

  import { VOCALOID_LYRICS_WIKI_ARTICLE_ENTRYPOINT } from "../../../config";
  import { handleInputEvent } from "./utils";
  import { getOtherMediaWikiPageName } from "../../utils/urlUtils";

  interface TracklistTableProps {
    id: string;
    class: string;
    data: AlbumTrackData[];
  }

  let {
    id,
    class: className,
    data = $bindable([]),
  }: TracklistTableProps = $props();

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
</script>

<Handsontable
  {id}
  class={className}
  bind:data
  dataSchema={AlbumTrackData}
  rowHeaders={true}
  colHeaders={headerText}
  columns={columnDefinitions}
  settings={{
    beforeChange: onVlwPageInput,
    rowHeights: 30,
    minSpareRows: 0,
  }}
/>
