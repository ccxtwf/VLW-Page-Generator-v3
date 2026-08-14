<script lang="ts">
  import { _ } from "svelte-i18n";

  import CopyResultsButton from "../buttons/CopyResultsButton.svelte";
  import CopyTitleButton from "../buttons/CopyTitleButton.svelte";
  import type { SvelteComponent } from "svelte";

  let { showTitle = true }: { showTitle?: boolean } = $props();

  let textarea: HTMLTextAreaElement;
  let copyTitle: SvelteComponent;

  export function updateState(generatedPage: string, pageTitle: string): void {
    textarea.value = generatedPage;
    copyTitle?.updateState(pageTitle);
  }
</script>

<div class="flex w-full flex-wrap justify-center gap-4 p-8">
  <h2 class="flex-item text-2xl">{$_("results")}</h2>
  <CopyResultsButton getResults={() => textarea.value} />
</div>
{#if showTitle}
  <div class="flex w-full flex-wrap justify-center gap-4 p-2">
    <CopyTitleButton bind:this={copyTitle} />
  </div>
{/if}
<textarea readonly class="textarea w-full" rows="30" bind:this={textarea}
></textarea>
