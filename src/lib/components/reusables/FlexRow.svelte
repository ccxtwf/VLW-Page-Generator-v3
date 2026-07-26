<script lang="ts">
  import { _ } from "svelte-i18n";
  import Tooltip from "./Tooltip.svelte";
  import { type Snippet } from "svelte";

  interface FlexRowProps {
    labelForHtmlId: string;
    labelI18nKey: string;
    tooltipI18nKey: string;
    showUnderLabel?: Snippet;
    children: Snippet;
  }

  let { labelForHtmlId, labelI18nKey, tooltipI18nKey, children, showUnderLabel }: FlexRowProps =
    $props();
</script>

<div class="flex items-center gap-2 font-medium text-gray-200">
  <div>
    <label for={labelForHtmlId}>{$_(labelI18nKey)}</label>
    {#if showUnderLabel}
      {@render showUnderLabel()}
    {/if}
  </div>
  <Tooltip>
    {@html $_(tooltipI18nKey)}
  </Tooltip>
</div>
<div class="flex w-full flex-col gap-2 sm:flex-row">
  {#if children}
    {@render children()}
  {/if}
</div>