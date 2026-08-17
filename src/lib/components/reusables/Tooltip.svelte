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
  class="dropdown dropdown-hover relative"
>
  {#if children}
    <div
      class="dropdown-content bg-neutral absolute bottom-0 w-60 translate-y-full rounded-sm p-2 text-xs max-sm:right-0 sm:left-1/2 sm:-translate-x-1/2"
    >
      {@render children()}
      {#if required}
        <div class="mt-2">*<em>{$_("required")}</em></div>
      {/if}
    </div>
  {/if}
  <div
    class="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border-1 border-gray-400 text-sm font-bold text-gray-500 transition-colors select-none hover:bg-gray-100"
  >
    {#if required}
      <div class="absolute -top-px right-0 translate-x-1/2 -translate-y-1/4 text-red-500">*</div>
    {/if}
    ?
  </div>
</div>