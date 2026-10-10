<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { SvelteComponent } from "svelte";

  import AlbumPageForm from "../components/forms/AlbumPageForm.svelte";
  import {
    Divider,
    FirstTimeEditingNotice,
    GeneratedResultsTextBox,
    AccessKeyShortcutsCard,
  } from "../components/reusables";

  let resultsBox: SvelteComponent;
</script>

<div class="page-container mx-auto max-w-5xl p-4">
  <h1 class="mb-6 text-2xl font-bold">
    {$_("pages.albumGenerator")}
  </h1>

  <hr />

  <AlbumPageForm
    ongenerate={(output, title) => {
      resultsBox.updateState(output, title);
    }}
  />

  <Divider />

  <FirstTimeEditingNotice />
  <AccessKeyShortcutsCard />

  <Divider />

  <GeneratedResultsTextBox bind:this={resultsBox} />
</div>