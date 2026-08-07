<script lang="ts">
  import Handsontable from "./Handsontable.svelte";
  import type { ColumnSettings, HotInstance } from "handsontable";

  import LyricRow from "../../models/children/LyricsRow.svelte";

  import { lyricsContextMenu } from "./contextMenus/lyrics";

  import type { MultiSelectItem } from "../../../schemas/form";
  import { getLanguageMetadata } from "../../utils/lyricsUtils";

  interface LyricsTableProps {
    id: string;
    class: string;
    languages: MultiSelectItem[];
    data: LyricRow[];
  }

  let hot: HotInstance | undefined = $state();

  let {
    id,
    class: className,
    languages = $bindable([]),
    data = $bindable([]),
  }: LyricsTableProps = $props();

  const languageMetadata = $derived(getLanguageMetadata(languages));

  const columnDefinitions: ColumnSettings[] = [
    {
      data: "customStyle",
      type: "text",
      renderer: "lyrics-custom-style",
    },
    {
      data: "original",
      type: "text",
      renderer: "lyrics",
    },
    {
      data: "romanized",
      type: "text",
      renderer: "lyrics",
    },
    {
      data: "english",
      type: "text",
      renderer: "lyrics",
    },
  ];

  $effect(() => {
    /**
     * Change column headers and column visibility when a different selection of
     * languages is selected
     */
    const { headers, needsRomanization, needsTranslation } =
      $state.snapshot(languageMetadata);
    const hiddenColumns: number[] = [];
    if (!needsRomanization) {
      hiddenColumns.push(2);
    }
    if (!needsTranslation) {
      hiddenColumns.push(3);
    }
    hot?.updateSettings({
      colHeaders: ["Custom style", ...headers],
      hiddenColumns: {
        columns: hiddenColumns,
        copyPasteEnabled: true,
        indicators: false,
      },
    });
  });
</script>

<Handsontable
  {id}
  class={className}
  bind:hot
  bind:data
  dataSchema={LyricRow}
  rowHeaders={true}
  columns={columnDefinitions}
  contextMenu={lyricsContextMenu}
  settings={{
    colWidths: [100, 250, 250, 250],
    rowHeights: 30,
    startRows: 5,
  }}
/>
