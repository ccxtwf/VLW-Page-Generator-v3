<script lang="ts">
  import { _ } from "svelte-i18n";
  import type AlbumBroadcastLink from "../../../models/children/AlbumBroadcastLink.svelte";
  import { ALBUM_STREAMING_LINKS } from "../../../../constants";
  import { SimpleTextInput } from "../base";

  interface AlbumOfficialLinksFieldCollectionProps {
    links: AlbumBroadcastLink[];
  }

  let { links = $bindable([]) }: AlbumOfficialLinksFieldCollectionProps = $props();
</script>

{#each links as link, i}
  {let { paramKey, placeholder, iconUrl } = ALBUM_STREAMING_LINKS[i]}

  <div class="w-full">
    <label
      for={paramKey}
      class="flex w-full flex-row items-center gap-x-2"
    >
      <div class="text-sm">
        {$_("albumGenForm.officialLinks.items." + paramKey)}
      </div>
      <div>
        <img
          src={import.meta.env.BASE_URL + iconUrl}
          alt=""
          width="16"
          height="16"
        />
      </div>
    </label>
  </div>
  <div class="flex w-full flex-col gap-2">
    <SimpleTextInput
      id={paramKey}
      {placeholder}
      bind:value={link.url}
    />
    {#if paramKey === "bc-embed"}
      <div class="block text-xs">
        {$_("albumGenForm.officialLinks.bandcamp")}
      </div>
    {/if}
  </div>
{/each}