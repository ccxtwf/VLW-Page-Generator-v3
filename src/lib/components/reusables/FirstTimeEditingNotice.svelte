<script lang="ts">
  import { _ } from "svelte-i18n";

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
      <li>{@html $_("firstTimeGuide.tip1")}</li>
      {#if !forProducerGen}
        <li>{@html $_("firstTimeGuide.tip2")}</li>
      {/if}
    </ul>
  </div>
</div>