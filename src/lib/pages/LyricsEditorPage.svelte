<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { SvelteComponent } from "svelte";

  import Divider from "../components/reusables/Divider.svelte";

  import GeneratedResultsTextBox from "../components/inputFields/GeneratedResultsTextBox.svelte";
  import LyricsParserPageForm from "../forms/LyricsParserPageForm.svelte";
  import LyricsEditorPageForm from "../forms/LyricsEditorPageForm.svelte";

  let resultsBox: SvelteComponent;
</script>

<div class="page-container mx-auto max-w-4xl p-4">
  <h1 class="mb-6 text-2xl font-bold text-white">
    {$_("pages.lyricsEditor")}
  </h1>

  <LyricsParserPageForm handleButtonClick={console.log} />

  <Divider />

  <LyricsEditorPageForm forwardGeneratedResults={console.log} />

  <Divider />

  <GeneratedResultsTextBox bind:this={resultsBox} />
</div>