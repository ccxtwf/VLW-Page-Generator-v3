<script lang="ts">
  import { _ } from 'svelte-i18n'
  import type AlbumBroadcastLink from "../../models/children/AlbumBroadcastLink.svelte";
  import FlexRow from "../reusables/FlexRow.svelte";
  
import { ALBUM_STREAMING_LINKS } from "../../../constants";
  import SimpleTextInput from "./SimpleTextInput.svelte";

  interface AlbumOfficialLinksFieldCollectionProps {
    links: AlbumBroadcastLink[]
  }

  let { links = $bindable([]) }: AlbumOfficialLinksFieldCollectionProps = $props();

</script>

{#each links as link, i}
{let { name, paramKey, placeholder } = ALBUM_STREAMING_LINKS[i];}
<FlexRow
  labelForHtmlId={paramKey}
  rawLabelString={name}
>
  <SimpleTextInput
    id={paramKey}
    placeholder={placeholder}
    bind:value={link.url}
  />
  {#if paramKey === 'bc-embed'}
    <div class="text-xs">{$_('albumGenForm.officialLinks.bandcamp')}</div>
  {/if}
</FlexRow>
{/each}