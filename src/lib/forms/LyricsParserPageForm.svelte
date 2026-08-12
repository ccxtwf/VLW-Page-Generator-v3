<script lang="ts">
  import { _ } from "svelte-i18n";
  import { VOCALOID_LYRICS_WIKI_ARTICLE_ENTRYPOINT } from "../../config";
  import { extractLyricsTablesFromWikipageSrc, parseLyrics } from "../utils/lyricsEditFormActions";
  import type { LyricsParsePayload } from "../../schemas/events";

  let selectedTable: number = $state(0);
  let nTables: number = $state(0);

  let textareaElement: HTMLTextAreaElement;

  function handleSubmit(e: Event) {
    e.preventDefault();
    const contents = textareaElement.value || "";
    const rx = extractLyricsTablesFromWikipageSrc(contents)[selectedTable];
    const [toggleText, lyrics, translator, isOfficialTranslation] = parseLyrics(rx);
    window.dispatchEvent(
      new CustomEvent<LyricsParsePayload>("parsedLyrics", {
        detail: { toggleText, lyrics, translator, isOfficialTranslation },
      }),
    );
  }
</script>

{#snippet guide()}
  <div
    role="alert"
    class="alert alert-soft block w-full"
  >
    <h4 class="text-md mb-2 font-bold">
      {$_("lyricsEditor.guide.header")}
    </h4>

    <ol class="list-outside list-disc pl-5">
      <li>
        {$_("lyricsEditor.guide.p1")}
      </li>
      <li>
        {$_("lyricsEditor.guide.p2")}
      </li>
      <li>
        {$_("lyricsEditor.guide.p3")}
      </li>
    </ol>

    <hr />

    <div class="mt-2 mb-1">
      {$_("lyricsEditor.guide.wikiSourceHeader")}
    </div>

    <ol class="list-outside list-disc pl-5">
      <li>
        {$_("lyricsEditor.guide.s1")}
      </li>
      <li>
        {$_("lyricsEditor.guide.s2")}
        <a
          class="link link-accent"
          href={`${VOCALOID_LYRICS_WIKI_ARTICLE_ENTRYPOINT}${$_("lyricsEditor.guide.s2Example")}?action=raw`}
          title={$_("lyricsEditor.guide.s2AltText")}
          target="_blank"
          rel="noopener noreferrer"
        >
          {$_("lyricsEditor.guide.s2Example")}
        </a>
      </li>
    </ol>
  </div>
{/snippet}

<form
  name="lyrics-parser"
  class="mt-8 mb-4 flex w-full flex-col items-center justify-start gap-4"
  onsubmit={handleSubmit}
>
  {@render guide()}

  <h2 class="text-xl font-bold">
    {$_("lyricsEditor.headerText")}
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
          values: { index: selectedTable + 1, total: nTables },
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
    bind:this={textareaElement}
    onblur={(e) => {
      const value = e.currentTarget.value || "";
      nTables = extractLyricsTablesFromWikipageSrc(value).length;
    }}></textarea>

  <button
    type="submit"
    class="btn btn-primary btn-block"
  >
    {$_("lyricsEditor.extractLyricsTableButtonText")}
  </button>
</form>