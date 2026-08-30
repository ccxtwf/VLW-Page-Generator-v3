<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { Snippet } from "svelte";

  interface ToolTipProps {
    required?: boolean;
    children?: Snippet;
  }

  let { required = false, children }: ToolTipProps = $props();
</script>

<div
  role="tooltip"
  class="dropdown dropdown-hover help"
>
  {#if children}
    <div class="dropdown-content tooltip-content">
      {@render children()}
      {#if required}
        <div class="mt-2">*<em>{$_("required")}</em></div>
      {/if}
    </div>
  {/if}
  <div class="tooltip-logo">
    {#if required}
      <div class="tooltip-logo-required">*</div>
    {/if}
    ?
  </div>
</div>