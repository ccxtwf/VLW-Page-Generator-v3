<script lang="ts">
  import { _ } from "svelte-i18n";
  import SimpleTextInput from "../inputFields/SimpleTextInput.svelte";

  interface PreloadDiscographyFromVlwInputProps {
    prodCategory: string;
    handleDiscographyLoading: () => Promise<void>;
  }

  let {
    prodCategory = $bindable(""),
    handleDiscographyLoading,
  }: PreloadDiscographyFromVlwInputProps = $props();
  let isLoading = $state(false);
</script>

<div class="sm:join flex-item block w-full">
  <SimpleTextInput
    id="producer-category"
    placeholder={$_("producerGenForm.mainProducerCategory.placeholder")}
    bind:value={prodCategory}
    onkeydown={function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("fetch-vlw-button")?.click();
      }
    }}
  />
  <div class="sm:join-item block [&]:border-none">
    <button
      id="fetch-vlw-button"
      type="button"
      class="btn btn-neutral w-full text-xs sm:w-48"
      onclick={async () => {
        try {
          isLoading = true;
          await handleDiscographyLoading();
        } finally {
          isLoading = false;
        }
      }}
    >
      {#if isLoading}
        <span class="loading loading-dots loading-xs"></span>
      {:else}
        {$_("producerGenForm.mainProducerCategory.fetchFromLiveWikiButtonText")}
      {/if}
    </button>
  </div>
</div>