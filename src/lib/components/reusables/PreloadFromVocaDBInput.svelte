<script lang="ts">
  import { _ } from "svelte-i18n";
  interface PreloadFromVocaDBInputProps {
    handleFetch: (url: string) => void;
    placeholder: string;
  }

  let { handleFetch, placeholder }: PreloadFromVocaDBInputProps = $props();
  let vdbUrl = $state("");
</script>

<div class="join w-full">
  <label class="input join-item w-full">
    <input
      id="vocadb-preload-url"
      class="input input-bordered flex-1"
      type="text"
      {placeholder}
      bind:value={vdbUrl}
    />
  </label>
  <div class="join-item border-none">
    <button
      type="button"
      class="btn btn-neutral"
      onclick={() => handleFetch(vdbUrl)}>{$_("formActions.preload")}</button
    >
  </div>
</div>