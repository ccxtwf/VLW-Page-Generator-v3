<script lang="ts">
  import Handsontable from "./Handsontable.svelte";
  import {
    type CellChange,
    type ColumnSettings,
    type HotInstance,
  } from "handsontable";

  import AlbumBroadcastLink from "../../models/children/AlbumBroadcastLink.svelte";

  import { ALBUM_STREAMING_LINKS } from "../../../constants";
  import { handleInputEvent, sharedContextMenuOptions } from "./utils";

  interface AlbumOfficialLinksTableProps {
    id: string;
    class: string;
    data: AlbumBroadcastLink[];
  }

  let hot: HotInstance | undefined = $state();

  let {
    id,
    class: className,
    data = $bindable([]),
  }: AlbumOfficialLinksTableProps = $props();
  let selected = $derived(
    new Set(data.map(({ idx }) => idx).filter((e) => !!e)),
  );

  const headerText: string[] = ["Type", "URL"];
  const columnDefinitions: ColumnSettings[] = [
    {
      data: "site",
      type: "dropdown",
      /**
       * Only one of each item in ALBUM_STREAMING_LINKS may be filled
       * on each page at a time
       *
       * @param _query
       * @param callback
       */
      source(_query: string, callback: (items: unknown[]) => void) {
        const unselected = ALBUM_STREAMING_LINKS.filter(({ idx }) => {
          return !selected.has(idx);
        }).map(({ name, idx }) => ({ key: idx, value: name }));
        callback(unselected);
      },
      strict: false,
      allowInvalid: true,
      validator: undefined,
    },
    {
      data: "url",
      type: "text",
      renderer: "url",
    },
  ];

  /**
   * Maintain the state of `selected` on changes
   */
  const onServiceChange = handleInputEvent("site", (change: CellChange) => {
    const [rowId, _colId, _oldValue, newValue] = change;
    const getKeyValuePair = (o: unknown) => {
      if (typeof o === "object") {
        const { key = null, value = null } =
          (o as { key?: any; value?: any }) || {};
        // Return null for custom inputs
        return typeof key === "number" ? [key, value] : [null, value];
      }
      return [null, o];
    };
    const [a, b] = getKeyValuePair(newValue);
    hot!.setDataAtRowProp(rowId, "idx", a);
    hot!.setDataAtRowProp(rowId, "site", b);
  });
</script>

<Handsontable
  {id}
  class={className}
  bind:data
  bind:hot
  dataSchema={AlbumBroadcastLink}
  rowHeaders={true}
  colHeaders={headerText}
  columns={columnDefinitions}
  contextMenu={sharedContextMenuOptions}
  settings={{
    beforeChange: onServiceChange,
    rowHeights: 30,
    startRows: 5,
  }}
/>
