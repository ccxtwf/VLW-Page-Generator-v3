<script lang="ts">
  import { _ } from "svelte-i18n";
  import { VOCALOID_LYRICS_WIKI_ARTICLE_ENTRYPOINT } from "../../../config";

  interface FirstTimeEditingNoticeProps {
    forProducerGen?: boolean;
  }

  let { forProducerGen = false }: FirstTimeEditingNoticeProps = $props();
</script>

<div
  role="alert"
  class="alert alert-soft alert-horizontal w-full"
>
  <div class="py-3">
    <h3 class="mb-4 text-xl font-bold">{@html $_("firstTimeGuide.header")}</h3>
    <p class="mb-2">{@html $_("firstTimeGuide.paragraphOpener")}</p>
    <ul class="list-outside list-disc gap-y-3 pl-5">
      {let sharedOpts = { values: { domain: VOCALOID_LYRICS_WIKI_ARTICLE_ENTRYPOINT } }}
      <li>
        {@html $_("firstTimeGuide.tip1", sharedOpts)}
      </li>
      <li>{@html $_("firstTimeGuide.tip2", sharedOpts)}</li>
      <li>{@html $_("firstTimeGuide.tip3", sharedOpts)}</li>
      {#if !forProducerGen}
        <li>{@html $_("firstTimeGuide.tip4", sharedOpts)}</li>
      {/if}
    </ul>
  </div>
</div>