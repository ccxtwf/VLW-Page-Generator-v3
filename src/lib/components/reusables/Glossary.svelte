<script lang="ts">
  import { _ } from "svelte-i18n";

  import DiacriticsGlossary from "./DiacriticsGlossary.svelte";
  import MediawikiSyntaxGlossary from "./MediawikiSyntaxGlossary.svelte";

  let showDiacriticsGuide = $state<boolean>(false);
  let showMwSyntax = $state<boolean>(false);
</script>

<div class="col-span-full">
  <div class="md:join w-full">
    <button
      class="btn btn-outline btn-accent join-item w-full md:w-1/2"
      type="button"
      onclick={() => {
        showDiacriticsGuide = !showDiacriticsGuide;
      }}
    >
      {$_("glossary.diacritics")}
    </button>
    <button
      class="btn btn-outline btn-accent join-item w-full md:w-1/2"
      type="button"
      onclick={() => {
        showMwSyntax = !showMwSyntax;
      }}
    >
      {$_("glossary.mediawiki")}
    </button>
  </div>
  <div class="w-full">
    {#if showDiacriticsGuide}
      <DiacriticsGlossary
        onclose={(e: Event) => {
          showDiacriticsGuide = false;
        }}
      />
    {/if}
    {#if showMwSyntax}
      <MediawikiSyntaxGlossary
        onclose={(e: Event) => {
          showMwSyntax = false;
        }}
      />
    {/if}
  </div>
</div>