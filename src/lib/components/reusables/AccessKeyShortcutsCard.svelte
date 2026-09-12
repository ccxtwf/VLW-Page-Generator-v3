<script lang="ts">
  import { _ } from "svelte-i18n";

  const items = [
    { i18nKey: "formActions.generate", accessKey: "S" },
    { i18nKey: "formActions.copyOutput", accessKey: "C" },
    { i18nKey: "formActions.clear", accessKey: "W" },
    { i18nKey: "formActions.reset", accessKey: "R" },
    { i18nKey: "formActions.themeToggle", accessKey: "Q" },
  ];
</script>

{#snippet guideWindows(accessKey: string)}
  <div>
    <kbd class="kbd">Alt</kbd> + (<kbd class="kbd">Shift</kbd>) +
    <kbd class="kbd">{accessKey}</kbd>
  </div>
{/snippet}

{#snippet guideMac(accessKey: string)}
  <div>
    <kbd class="kbd">⌘</kbd> + <kbd class="kbd">⌥</kbd> +
    <kbd class="kbd">{accessKey}</kbd>
  </div>
{/snippet}

<div
  class="bg-base-200 max-xs:hidden mt-4 grid grid-cols-[150px_1fr] rounded-lg p-4 text-xs lg:grid-cols-[300px_1fr]"
>
  <h3 class="col-span-full mb-4 text-base font-bold">{$_("accessKey")}</h3>
  {#each items as { i18nKey, accessKey }}
    <div>{$_(i18nKey)}</div>
    <div class="flex flex-row gap-x-10 lg:gap-x-20">
      {@render guideWindows(accessKey)}
      {@render guideMac(accessKey)}
    </div>
  {/each}
</div>