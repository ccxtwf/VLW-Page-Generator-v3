<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { SvelteComponent } from "svelte";

  import Divider from "../components/reusables/Divider.svelte";

  import GeneratedResultsTextBox from "../components/inputFields/GeneratedResultsTextBox.svelte";
  import LyricsParserPageForm from "../forms/LyricsParserPageForm.svelte";
  import LyricsEditorPageForm from "../forms/LyricsEditorPageForm.svelte";

  let resultsBox: SvelteComponent;
</script>

<div class="page-container mx-auto max-w-5xl p-4">
  <h1 class="mb-2 text-2xl font-bold">
    {$_("pages.lyricsEditor")}
  </h1>

  <div class="mb-6 text-xs">
    {@html $_("lyricsEditor.overview")}
  </div>

  <hr />

  <LyricsParserPageForm />

  <h1 class="mt-24 mb-6 text-2xl font-bold">
    {$_("lyricsEditor.fields.parsedLyricsHeader")}
  </h1>

  <hr />

  <LyricsEditorPageForm
    ongenerate={(wikipage) => {
      resultsBox.updateState(wikipage);
    }}
  />

  <Divider />

  <GeneratedResultsTextBox bind:this={resultsBox} />
</div>