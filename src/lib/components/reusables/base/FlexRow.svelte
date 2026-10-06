<script lang="ts">
  import { _ } from "svelte-i18n";
  import Tooltip from "./Tooltip.svelte";
  import { type Snippet } from "svelte";

  interface FlexRowProps {
    labelForHtmlId?: string;
    labelI18nKey?: string;
    labelI18nParams?: Record<string, string>;
    rawLabelString?: string;
    tooltipI18nKey?: string;
    tooltipI18nParams?: Record<string, string>;
    hidden?: boolean;
    required?: boolean;
    showUnderLabel?: Snippet;
    children?: Snippet;
  }

  let {
    labelForHtmlId,
    labelI18nKey,
    labelI18nParams,
    tooltipI18nKey,
    tooltipI18nParams,
    rawLabelString,
    hidden = false,
    required = false,
    children,
    showUnderLabel,
  }: FlexRowProps = $props();
</script>

<div
  class="vlw-flex-row-left"
  class:hidden
>
  <div class="vlw-flex-row-label">
    <div class="flex-item grow">
      <label for={labelForHtmlId}>
        {labelI18nKey ? $_(labelI18nKey, { values: labelI18nParams }) : rawLabelString}
      </label>
    </div>
    <div class="flex-item flex-none">
      {#if tooltipI18nKey}
        <Tooltip {required}>
          {@html $_(tooltipI18nKey, { values: tooltipI18nParams })}
        </Tooltip>
      {/if}
    </div>
  </div>
  {#if showUnderLabel}
    <div class="max-sm:self-end">
      {@render showUnderLabel()}
    </div>
  {/if}
</div>
<div
  class="vlw-flex-row-right"
  class:hidden
>
  {#if children}
    {@render children()}
  {/if}
</div>