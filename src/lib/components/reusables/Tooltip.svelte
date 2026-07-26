<script lang="ts">
  import type { Snippet } from "svelte";

  interface ToolTipProps {
    required?: boolean;
    position?: 'top' | 'bottom' | 'left' | 'right';
    align?: 'start' | 'end' | 'center';
    simpleTooltip?: string
    children?: Snippet
  }
  
  let { simpleTooltip, required = false, position = 'top', align = 'start', children }: ToolTipProps = $props();
</script>

<div class="tooltip tooltip-top md:tooltip-{position} md:tooltip-{align}" data-tip={simpleTooltip}>
  {#if children}
    <div class="tooltip-content">
      {@render children()}
    </div>
	{/if}
  <div class="flex items-center justify-center w-4 h-4 rounded-full border-1 border-gray-400 text-gray-500 font-bold text-sm select-none hover:bg-gray-100 transition-colors cursor-pointer">
    {#if required}
      <div class="text-red-500">*</div>
    {/if}
    ?
  </div>
</div>