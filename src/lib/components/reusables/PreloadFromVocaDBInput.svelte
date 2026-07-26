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
      <input type="text" placeholder="{placeholder}" bind:value={vdbUrl} />
    </label>
  </div>
  <button type="button" class="btn btn-neutral join-item" onclick={() => handleFetch(vdbUrl)}>Preload</button>
</div>