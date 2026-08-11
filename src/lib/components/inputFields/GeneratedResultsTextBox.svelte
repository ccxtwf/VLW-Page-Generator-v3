<script lang="ts">
  import { _ } from "svelte-i18n";

  import CopyResultsButton from "../buttons/CopyResultsButton.svelte";
  import CopyIconButton from "../buttons/CopyIconButton.svelte";

  let textarea: HTMLTextAreaElement;
  let title: HTMLDivElement;

  export function updateState(generatedPage: string, pageTitle: string): void {
    textarea.value = generatedPage;
    title.innerText = pageTitle || "[PAGE TITLE]";
  }
</script>

<div class="flex w-full flex-wrap justify-center gap-4 p-8">
  <h2 class="flex-item text-2xl">{$_("results")}</h2>
  <CopyResultsButton getResults={() => textarea.value} />
</div>
<div class="mb-4 flex w-full flex-row items-center justify-center gap-2">
  <div
    class="text-lg font-bold"
    bind:this={title}
  >
    [PAGE TITLE]
  </div>
  <CopyIconButton getTextContents={() => title.innerText} />
</div>
<textarea
  readonly
  class="textarea w-full"
  rows="30"
  bind:this={textarea}></textarea>