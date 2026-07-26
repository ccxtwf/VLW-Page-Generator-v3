<script lang="ts">
  import type { Snippet } from "svelte";

  interface ToolTipProps {
    required?: boolean;
    position?: "top" | "bottom" | "left" | "right";
    align?: "start" | "end" | "center";
    simpleTooltip?: string;
    children?: Snippet;
  }

  let {
    simpleTooltip,
    required = false,
    position = "top",
    align = "start",
    children,
  }: ToolTipProps = $props();
</script>

<div
  class="tooltip tooltip-top md:tooltip-{position} md:tooltip-{align}"
  data-tip={simpleTooltip}
>
  {#if children}
    <div class="tooltip-content">
      {@render children()}
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