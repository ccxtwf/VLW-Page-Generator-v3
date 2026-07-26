<script lang="ts">
  import { _ } from "svelte-i18n";
  import Tooltip from "./Tooltip.svelte";
  import { type Snippet } from "svelte";

  interface FlexRowProps {
    labelForHtmlId: string;
    labelI18nKey: string;
    labelI18nParams?: Record<string, string>;
    tooltipI18nKey: string;
    tooltipI18nParams?: Record<string, string>;
    required?: boolean;
    showUnderLabel?: Snippet;
    children: Snippet;
  }

  let {
    labelForHtmlId,
    labelI18nKey,
    labelI18nParams,
    tooltipI18nKey,
    tooltipI18nParams,
    required = false,
    children,
    showUnderLabel,
  }: FlexRowProps = $props();
</script>

<div class="flex items-center gap-2 font-medium text-gray-200">
  <div class="flex flex-col gap-2">
    <label
      class="flex-item"
      for={labelForHtmlId}>{$_(labelI18nKey, { values: labelI18nParams })}</label
    >
    {#if showUnderLabel}
      <div class="flex-item">
        {@render showUnderLabel()}
      </div>
    {/if}
  </div>
  <Tooltip {required}>
    {@html $_(tooltipI18nKey, { values: tooltipI18nParams })}
  </Tooltip>
</div>
<div class="flex w-full flex-col gap-2 sm:flex-row">
  {#if children}
    {@render children()}
  {/if}
</div>