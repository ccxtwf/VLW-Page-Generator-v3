<script lang="ts">
  import Handsontable from "./Handsontable.svelte";
  import type { ColumnSettings, HotInstance } from "handsontable/base";
  import { getTheme } from "handsontable/themes";
  import Song from "#src/lib/models/Song.svelte.js";
  import LyricRow from "../../models/children/LyricsRow.svelte";

  import { getLyricsContextMenu } from "./contextMenus/lyrics";
  import type { LanguageMetadata } from "../../utils/lyricsUtils";
  import { isDarkModeActive } from "../../utils/themeUtils";
  import { registerUndoRedoActionOnDataLoad } from "./utils";
  import { LyricsTableHeader } from "../../../constants/tableHeaders";
  import type { LyricsThemeToggledEventPayload } from "../../../schemas/events";

  interface LyricsTableProps {
    id: string;
    class: string;
    languageMetadata: LanguageMetadata;
    data: (string | null | undefined)[][];
  }

  let hot: HotInstance | undefined = $state();

  let {
    id,
    class: className,
    languageMetadata = $bindable({
      headers: [],
      needsRomanization: false,
      needsTranslation: false,
      isChinese: false,
      isoLangCode: null,
    }),
    data,
  }: LyricsTableProps = $props();

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
    const { headers, needsRomanization, needsTranslation } = languageMetadata;
    const hiddenColumns: number[] = [];
    if (!needsRomanization) {
      hiddenColumns.push(2);
    }
    if (!needsTranslation) {
      hiddenColumns.push(3);
    }
    hot?.updateSettings({
      colHeaders: [LyricsTableHeader.STYLE, ...headers],
      hiddenColumns: {
        columns: hiddenColumns,
        copyPasteEnabled: true,
        indicators: false,
      },
    });
  });

  const cbWatchTheme = (event: CustomEvent<LyricsThemeToggledEventPayload>) => {
    hot?.updateSettings({
      theme: getTheme(event.detail.isDarkMode ? "dark" : "light"),
    });
  };

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

  function resetTable() {
    const oldData = hot!.getData();
    const newData = Array(Song.defaultStartingRows)
      .fill(null)
      .map(() => Array(4).fill(""));
    registerUndoRedoActionOnDataLoad(hot!, oldData, newData, "resetLyricsAction");
    hot!.updateData(newData);
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
  contextMenu={getLyricsContextMenu({ resetTable })}
  settings={{
    colWidths: [100, 250, 250, 250],
    rowHeights: 30,
    fillHandle: true,
    imeFastEdit: true,
    theme: getTheme(isDarkModeActive() ? "dark" : "light"),
    minSpareRows: 1,
  }}
  onReady={function () {
    /**
     * Listen to changes set upon the theme toggle
     */
    window.addEventListener("lyricsThemeToggled", cbWatchTheme);
  }}
  onUnmount={function () {
    window.removeEventListener("lyricsThemeToggled", cbWatchTheme);
  }}
/>