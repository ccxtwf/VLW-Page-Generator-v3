<script lang="ts">
  import Handsontable from "./Handsontable.svelte";
  import type { ColumnSettings, HotInstance } from "handsontable";
  import type { SvelteComponent } from "svelte";

  import LyricRow from "../../models/children/LyricsRow.svelte";

  import { lyricsContextMenu } from "./contextMenus/lyrics";

  import type { MultiSelectItem } from "../../../schemas/form";
  import { getLanguageMetadata } from "../../utils/lyricsUtils";

  interface LyricsTableProps {
    id: string;
    class: string;
    languages: MultiSelectItem[];
    data: (string | null | undefined)[][];
  }

  let hot: HotInstance | undefined = $state();

  let { id, class: className, languages = $bindable([]), data }: LyricsTableProps = $props();

  const languageMetadata = $derived(getLanguageMetadata(languages));

  const columnDefinitions: ColumnSettings[] = [
    {
      type: "text",
      renderer: "lyrics-custom-style",
    },
    {
      type: "text",
      renderer: "lyrics",
    },
    {
      type: "text",
      renderer: "lyrics",
    },
    {
      type: "text",
      renderer: "lyrics",
    },
  ];

  $effect(() => {
    /**
     * Change column headers and column visibility when a different selection of
     * languages is selected
     */
    const { headers, needsRomanization, needsTranslation } = $state.snapshot(languageMetadata);
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

  export function getLatestData() {
    if (!hot) {
      return [];
    }
    return (hot!.getData() as unknown[][]).map((row) => {
      const [customStyle, original, romanized, english] = row;
      return new LyricRow({
        customStyle: (customStyle as string) || "",
        original: (original as string) || "",
        romanized: (romanized as string) || "",
        english: (english as string) || "",
      });
    });
  }
</script>

<Handsontable
  {id}
  class={className}
  bind:hot
  {data}
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