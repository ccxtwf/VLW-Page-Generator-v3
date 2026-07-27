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

<button
  class="btn btn-outline btn-info w-32 transition-colors"
  type="button"
  onclick={copyToClipboard}
>
  {isCopied ? $_("formActions.copiedOutput") : $_("formActions.copyOutput")}
</button>