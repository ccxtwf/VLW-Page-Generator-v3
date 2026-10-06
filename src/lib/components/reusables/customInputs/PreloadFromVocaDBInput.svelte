<script lang="ts">
  import { _ } from "svelte-i18n";
  interface PreloadFromVocaDBInputProps {
    onfetch: (url: string) => Promise<void>;
    placeholder: string;
  }

  let { onfetch, placeholder }: PreloadFromVocaDBInputProps = $props();
  let vdbUrl = $state("");
  let isLoading = $state(false);
</script>

<div class="join w-full">
  <label class="join-item w-full border-none">
    <input
      id="vocadb-preload-url"
      class="input input-bordered w-full flex-1"
      type="text"
      {placeholder}
      bind:value={vdbUrl}
      autocomplete="off"
      onkeydown={function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          document.getElementById("vocadb-preload-url-button")?.click();
        }
      }}
    />
  </label>
  <div class="join-item border-none">
    <button
      id="vocadb-preload-url-button"
      type="button"
      class="btn btn-neutral w-22"
      onclick={async () => {
        try {
          isLoading = true;
          await onfetch($state.snapshot(vdbUrl));
        } finally {
          isLoading = false;
        }
      }}
    >
      {#if isLoading}
        <span class="loading loading-dots loading-xs"></span>
      {:else}
        {$_("formActions.preload")}
      {/if}
    </button>
  </div>
</div>