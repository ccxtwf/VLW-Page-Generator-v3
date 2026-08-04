<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { SvelteComponent } from "svelte";

  import ProducerPageForm from "../forms/ProducerPageForm.svelte";

  import Divider from "../components/reusables/Divider.svelte";
  import FirstTimeEditingNotice from "../components/reusables/FirstTimeEditingNotice.svelte";
  import GeneratedResultsTextBox from "../components/inputFields/GeneratedResultsTextBox.svelte";

  let resultsBox: SvelteComponent;
</script>

<div class="page-container mx-auto max-w-5xl p-4">
  <h1 class="mb-6 text-2xl font-bold">
    {$_("pages.producerGenerator")}
  </h1>

  <hr />

  <ProducerPageForm
    ongenerate={(output) => {
      resultsBox.updateState(output);
    }}
  />

  <Divider />

  <FirstTimeEditingNotice forProducerGen={true} />

  <Divider />

  <GeneratedResultsTextBox bind:this={resultsBox} />
</div>
