<script lang="ts">
  interface PreloadFromVocaDBInputProps {
    handleFetch: (url: string) => void
    placeholder: string
  }

  let { handleFetch, placeholder }: PreloadFromVocaDBInputProps = $props();
  let vdbUrl = $state("");
</script>

<div class="join">
  <div>
    <label class="input join-item">
      <input id="vocadb-preload-url" class="input input-bordered flex-1" type="text" placeholder="{placeholder}" bind:value={vdbUrl} />
    </label>
  </div>
  <button type="button" class="btn btn-neutral join-item" onclick={() => handleFetch(vdbUrl)}>Preload</button>
</div>