<script lang="ts">
  import { _ } from "svelte-i18n";

  import Tooltip from "../components/reusables/Tooltip.svelte";

  let selectedTable: number = $state(0);
  let nTables: number = $state(0);

  let textareaElement: HTMLTextAreaElement;

  let { handleButtonClick }: { handleButtonClick: (contents: string) => void } = $props();

  function handleSubmit(e: Event) {
    e.preventDefault();
    const contents = textareaElement.value || "";
    handleButtonClick(contents);
  }
</script>

<form
  name="lyrics-parser"
  class="mt-8 mb-4 flex w-full flex-col items-center justify-start gap-4"
  onsubmit={handleSubmit}
>
  <h2 class="text-xl font-bold">
    {$_("lyricsEditor.headerText")}
    <Tooltip required={true}>
      {@html $_("lyricsEditor.tooltip")}
    </Tooltip>
  </h2>

  {#if nTables === 0}
    <div class="m-0 rounded-sm border border-gray-400 p-2 text-sm">
      {$_("lyricsEditor.lyricsExtractorState.noData")}
    </div>
  {:else}
    <select
      class="select select-ghost text-xs"
      bind:value={selectedTable}
    >
      <option
        disabled
        selected
      >
        {$_("lyricsEditor.lyricsExtractorState.found", {
          values: { index: selectedTable, total: nTables },
        })}
      </option>
      {#each { length: nTables } as _, i}
        <option value={i}>Table #{i + 1}</option>
      {/each}
    </select>
  {/if}

  <textarea
    class="textarea w-full"
    rows="20"
    bind:this={textareaElement}></textarea>

  <button class="btn btn-primary btn-block"
    >{$_("lyricsEditor.extractLyricsTableButtonText")}</button
  >
</form>