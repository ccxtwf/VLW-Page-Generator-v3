<script lang="ts">
  import { _ } from "svelte-i18n";

  let { getResults }: { getResults: () => string } = $props();
  let isCopied = $state(false);

  async function copyToClipboard() {
    try {
      let results = getResults();
      await navigator.clipboard.writeText(results);
      isCopied = true;
      setTimeout(() => (isCopied = false), 2000); // Reset feedback
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }
</script>

<div class="relative inline-flex">
  <button
    class="btn btn-info w-32 transition-all duration-200"
    class:btn-outline={!isCopied}
    type="button"
    onclick={copyToClipboard}
  >
    {$_("formActions.copyOutput")}
  </button>

  {#if isCopied}
    <div
      role="status"
      class="bg-neutral text-neutral-content pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 animate-[tooltip-in_150ms_ease-out] rounded-md px-2.5 py-1.5 text-xs font-medium whitespace-nowrap shadow-lg"
    >
      {$_("formActions.copiedOutput")}
    </div>
  {/if}
</div>