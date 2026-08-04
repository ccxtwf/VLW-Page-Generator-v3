<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { SvelteComponent } from "svelte";

  import AlbumPageForm from "../forms/AlbumPageForm.svelte";

  import Divider from "../components/reusables/Divider.svelte";
  import FirstTimeEditingNotice from "../components/reusables/FirstTimeEditingNotice.svelte";
  import GeneratedResultsTextBox from "../components/inputFields/GeneratedResultsTextBox.svelte";

  let resultsBox: SvelteComponent;
</script>

<div class="page-container mx-auto max-w-5xl p-4">
  <h1 class="mb-6 text-2xl font-bold">
    {$_("pages.albumGenerator")}
  </h1>

  <hr />

  <AlbumPageForm
    ongenerate={(output) => {
      resultsBox.updateState(output);
    }}
  />

  <Divider />

  <FirstTimeEditingNotice />

  <Divider />

  <GeneratedResultsTextBox bind:this={resultsBox} />
</div>
