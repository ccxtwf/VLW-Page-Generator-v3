<script lang="ts">
  import Handsontable from "./Handsontable.svelte";
  import { type ColumnSettings, type HotInstance } from "handsontable";

  import PlayLink from "../../models/children/PlayLink.svelte";

  import { PV_SERVICES } from "../../../constants";
  import {
    handleInputEvent,
    processInsertedLink,
    sharedContextMenuOptions,
  } from "./utils";

  interface BroadcastLinksTableProps {
    id: string;
    class: string;
    data: PlayLink[];
  }

  let hot: HotInstance | undefined = $state();

  let {
    id,
    class: className,
    data = $bindable([]),
  }: BroadcastLinksTableProps = $props();

  const headerText: string[] = [
    "Site",
    "URL",
    "Reprint?",
    "Auto-gen?",
    "Deleted?",
    "View Count",
  ];
  const columnDefinitions: ColumnSettings[] = [
    {
      data: "site",
      type: "dropdown",
      source: PV_SERVICES.map((el) => el.site),
      strict: false,
      allowInvalid: true,
      validator: undefined,
    },
    {
      data: "url",
      type: "text",
      renderer: "url",
    },
    { data: "isReprint", type: "checkbox", className: "htCenter htMiddle" },
    { data: "isAutogen", type: "checkbox", className: "htCenter htMiddle" },
    { data: "isDeleted", type: "checkbox", className: "htCenter htMiddle" },
    { data: "viewCount", type: "text" },
  ];

  /**
   * When a URL is inputted into the column "URL", check
   * if it is part of a set of recognized links. If so,
   * automatically set the "Site" field.
   *
   * In addition, process the inserted link.
   */
  const onUrlInput = handleInputEvent("url", (change) => {
    let [rowId, _colId, _oldValue, newValue] = change;
    // changed cell is URL
    const referUrl = PV_SERVICES.find(({ re }) => {
      return (newValue as string).match(re) !== null;
    });

    // no match is found
    if (!referUrl) {
      return;
    }

    newValue = processInsertedLink(newValue as string, referUrl);
    change[3] = newValue;
    hot!.setDataAtRowProp(rowId, "site", referUrl.site);
  });
</script>

<Handsontable
  {id}
  class={className}
  bind:data
  bind:hot
  dataSchema={PlayLink}
  rowHeaders={true}
  colHeaders={headerText}
  columns={columnDefinitions}
  settings={{
    beforeChange: onUrlInput,
    contextMenu: sharedContextMenuOptions,
    colWidths: [200, 300, 50, 50, 50, 80],
    rowHeights: 30,
    startRows: 5,
  }}
/>
