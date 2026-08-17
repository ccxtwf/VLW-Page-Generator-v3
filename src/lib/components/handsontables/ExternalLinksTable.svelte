<script lang="ts">
  import Handsontable from "./Handsontable.svelte";
  import { type ColumnSettings, type HotInstance } from "handsontable";
  import { sharedContextMenuOptions } from "./contextMenus/shared";
  import type { SvelteComponent } from "svelte";

  import ExternalLink from "../../models/children/ExternalLink.svelte";
  import ExternalLinkForProducerPage from "../../models/children/ExternalLinkForProducerPage.svelte";

  import { RECOGNIZED_LINKS } from "../../../constants";
  import { processInsertedLink, handleInputEvent } from "./utils";

  interface ExternalLinksTableProps {
    id: string;
    class: string;
    data: ExternalLink[];
    forProducerPage?: boolean;
  }

  let hot: HotInstance | undefined = $state();
  let child: SvelteComponent | null = null;

  let { id, class: className, data, forProducerPage }: ExternalLinksTableProps = $props();

  const headerText: string[] = ["URL", "Description", "Official"];
  const columnDefinitions: ColumnSettings[] = [
    {
      data: "url",
      type: "text",
      renderer: "url",
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

  /**
   * Automatically update the description upon URL input
   */
  const onLinkInput = handleInputEvent("url", (change) => {
    let [rowId, _colId, oldValue, newValue] = change;

    if (oldValue === newValue) {
      return;
    }

    // changed cell is URL
    const referUrl = RECOGNIZED_LINKS.find(({ re }) => {
      return newValue?.toString()?.match(re);
    });

    // match not found
    if (!referUrl) {
      return;
    }

    newValue = processInsertedLink(newValue as string, referUrl, {
      bilibili: false,
    });
    change[3] = newValue;
    hot!.setDataAtRowProp(rowId, "description", referUrl.site);
  });

  export function getLatestData() {
    return child?.getLatestData();
  }
</script>

<Handsontable
  {id}
  class={className}
  bind:hot
  bind:this={child}
  {data}
  dataSchema={forProducerPage ? ExternalLinkForProducerPage : ExternalLink}
  rowHeaders={true}
  colHeaders={headerText}
  columns={columnDefinitions}
  contextMenu={sharedContextMenuOptions}
  settings={{
    beforeChange: onLinkInput,
    colWidths: [250, 150, 50, 50, 50],
    rowHeights: 30,
    minSpareRows: 0,
  }}
/>