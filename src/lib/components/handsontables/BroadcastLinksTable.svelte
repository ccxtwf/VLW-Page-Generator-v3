<script lang="ts">
  import { _ } from "svelte-i18n";
  import Handsontable from "./Handsontable.svelte";
  import { type ColumnSettings, type HotInstance } from "handsontable/base";
  import { sharedContextMenuOptions } from "./contextMenus/shared";
  import type { SvelteComponent } from "svelte";

  import PlayLink from "../../models/children/PlayLink.svelte";

  import { PV_SERVICES } from "../../../constants";
  import { handleInputEvent, processInsertedLink } from "./utils";

  interface BroadcastLinksTableProps {
    id: string;
    class: string;
    data: PlayLink[];
  }

  let hot: HotInstance | undefined = $state();
  let child: SvelteComponent | null = null;

  let { id, class: className, data }: BroadcastLinksTableProps = $props();

  const headerText: string[] = [
    $_("songGenForm.broadcastLinks.headers.site"),
    $_("songGenForm.broadcastLinks.headers.url"),
    $_("songGenForm.broadcastLinks.headers.isReprint"),
    $_("songGenForm.broadcastLinks.headers.isAutogen"),
    $_("songGenForm.broadcastLinks.headers.isDeleted"),
    $_("songGenForm.broadcastLinks.headers.viewCount"),
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
    {
      data: "isReprint",
      type: "checkbox",
      className: "htCenter htMiddle",
    },
    {
      data: "isAutogen",
      type: "checkbox",
      className: "htCenter htMiddle",
    },
    {
      data: "isDeleted",
      type: "checkbox",
      className: "htCenter htMiddle",
    },
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
      return ((newValue as string) || "").match(re) !== null;
    });

    // no match is found
    if (!referUrl) {
      return;
    }

    newValue = processInsertedLink(newValue as string, referUrl);
    change[3] = newValue;
    hot!.setDataAtRowProp(rowId, "site", referUrl.site);
  });

  export function getLatestData() {
    return child?.getLatestData();
  }
</script>

<Handsontable
  {id}
  class={className}
  {data}
  bind:hot
  bind:this={child}
  dataSchema={PlayLink}
  rowHeaders={true}
  colHeaders={headerText}
  columns={columnDefinitions}
  settings={{
    beforeChange: onUrlInput,
    contextMenu: sharedContextMenuOptions,
    colWidths: [120, 280, 70, 70, 70, 80],
    rowHeights: 30,
    isEmptyRow(this: HotInstance, rowIdx: number) {
      const row = this.getSourceDataAtRow(rowIdx) as PlayLink;
      //@ts-ignore
      return Boolean(!row || !row.url || !row.viewCount);
    },
  }}
/>