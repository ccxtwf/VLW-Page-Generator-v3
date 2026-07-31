<script lang="ts">
  import { _ } from "svelte-i18n";
  interface PreloadFromVocaDBInputProps {
    onfetch: (url: string) => void;
    placeholder: string;
  }

  let { onfetch, placeholder }: PreloadFromVocaDBInputProps = $props();
  let vdbUrl = $state("");
</script>

<div class="join w-full">
  <label class="join-item w-full border-none">
    <input
      id="vocadb-preload-url"
      class="input input-bordered w-full flex-1"
      type="text"
      {placeholder}
      bind:value={vdbUrl}
    />
  </label>
  <div class="join-item border-none">
    <button
      type="button"
      class="btn btn-neutral"
      onclick={() => {
        onfetch($state.snapshot(vdbUrl));
      }}
    >
      {$_("formActions.preload")}
    </button>
  </div>
</div>