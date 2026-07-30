<script lang="ts">
  import { _ } from "svelte-i18n";

  import CopyResultsButton from "../buttons/CopyResultsButton.svelte";

  let results = $state("");

  export function updateState(newResults: string): void {
    results = newResults;
  }
</script>

<div class="mt-4 flex w-full flex-wrap justify-center gap-4 p-8">
  <h2 class="flex-item text-2xl">{$_("results")}</h2>
  <CopyResultsButton getResults={() => results} />
</div>
<textarea
  readonly
  class="textarea w-full"
  rows="30">{results}</textarea
>