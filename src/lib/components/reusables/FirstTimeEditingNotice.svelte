<script lang="ts">
  import { _ } from "svelte-i18n";
</script>

<div
  role="alert"
  class="alert alert-soft alert-vertical sm:alert-horizontal w-full"
>
  <div>
    <h3 class="font-bold">{@html $_("firstTimeGuide.header")}</h3>
    <p>{@html $_("firstTimeGuide.paragraphOpener")}</p>
    <ul class="list-inside list-disc">
      <li>{@html $_("firstTimeGuide.tip1")}</li>
      <li>{@html $_("firstTimeGuide.tip2")}</li>
    </ul>
  </div>
</div>