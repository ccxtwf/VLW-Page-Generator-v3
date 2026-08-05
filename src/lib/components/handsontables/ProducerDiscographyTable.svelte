<script lang="ts">
  import Handsontable from "./Handsontable.svelte";
  import type { ColumnSettings } from "handsontable";

  import ProducerDiscographySongItem from "../../models/children/ProducerDiscographySongItem.svelte";
  import ProducerDiscographyAlbumItem from "../../models/children/ProducerDiscographyAlbumItem.svelte";

  import { VOCALOID_LYRICS_WIKI_ARTICLE_ENTRYPOINT } from "../../../config";
  import { handleInputEvent, sharedContextMenuOptions } from "./utils";
  import { getOtherMediaWikiPageName } from "../../utils/urlUtils";

  interface ProducerDiscographyTableProps {
    id: string;
    class: string;
    data: ProducerDiscographySongItem[];
    forAlbums?: boolean;
  }

  let {
    id,
    class: className,
    data = $bindable([]),
    forAlbums,
  }: ProducerDiscographyTableProps = $props();

  const headerText: string[] = [
    forAlbums ? "Album pages" : "Song pages",
    "Additional template parameters",
  ];

  const columnDefinitions: ColumnSettings[] = [
    {
      data: "page",
      type: "text",
      renderer: "vlw-page",
    },
    {
      data: "additionalParameters",
      type: "text",
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

  /**
   * Event handler:
   * When a URL linking to a VLW page is copied/inputted into the
   * corresponding column, immediately truncate the given URL so it
   * shows the wiki page name instead
   */
  const onVlwPageInput = handleInputEvent("page", (change) => {
    const page = getOtherMediaWikiPageName(
      (change[2] as string) || "",
      VOCALOID_LYRICS_WIKI_ARTICLE_ENTRYPOINT,
    );
    if (page) {
      change[3] = page;
    }
  });
</script>

<Handsontable
  {id}
  class={className}
  bind:data
  dataSchema={forAlbums
    ? ProducerDiscographyAlbumItem
    : ProducerDiscographySongItem}
  rowHeaders={true}
  colHeaders={headerText}
  columns={columnDefinitions}
  contextMenu={sharedContextMenuOptions}
  settings={{
    beforeChange: onVlwPageInput,
    colWidths: forAlbums ? [70, 40, 50] : [70, 60],
    rowHeights: 30,
    minSpareRows: 0,
  }}
/>
