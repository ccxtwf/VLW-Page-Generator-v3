<script lang="ts">
  import { _ } from "svelte-i18n";
  import type AlbumBroadcastLink from "../../models/children/AlbumBroadcastLink.svelte";
  import { ALBUM_STREAMING_LINKS } from "../../../constants";
  import SimpleTextInput from "./SimpleTextInput.svelte";

  interface AlbumOfficialLinksFieldCollectionProps {
    links: AlbumBroadcastLink[];
  }

  let { links = $bindable([]) }: AlbumOfficialLinksFieldCollectionProps = $props();
</script>

{#each links as link, i}
  {let { name, paramKey, placeholder } = ALBUM_STREAMING_LINKS[i]}

  <div class="w-full">
    <label
      for={paramKey}
      class="text-sm"
    >
      {name}
    </label>
  </div>
  <div class="flex w-full flex-col gap-2">
    <SimpleTextInput
      id={paramKey}
      {placeholder}
      bind:value={link.url}
    />
    {#if paramKey === "bc-embed"}
      <div class="block text-xs">{$_("albumGenForm.officialLinks.bandcamp")}</div>
    {/if}
  </div>
{/each}