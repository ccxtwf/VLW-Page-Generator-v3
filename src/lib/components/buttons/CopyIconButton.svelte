<script lang="ts">
  /**
   * Written with assistance by ChatGPT
   */
  import { _ } from "svelte-i18n";

  interface CopyIconButtonProps {
    getTextContents: () => string;
  }
  let { getTextContents }: CopyIconButtonProps = $props();

  let isCopied = $state(false);
  let timeout: ReturnType<typeof setTimeout>;

  async function copy() {
    try {
      await navigator.clipboard.writeText(getTextContents());

      isCopied = true;

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        isCopied = false;
      }, 1800);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }
</script>

<div class="relative inline-flex">
  <button
    type="button"
    class="btn btn-ghost btn-square btn-sm transition-all duration-200"
    class:btn-success={isCopied}
    onclick={copy}
    aria-label={isCopied ? $_("formActions.copiedOutput") : $_("formActions.copyOutput")}
    title={isCopied ? $_("formActions.copiedOutput") : $_("formActions.copyOutput")}
  >
    <span class="relative grid h-4 w-4 place-items-center">
      <svg
        class="absolute h-4 w-4 animate-[scale-in_150ms_ease-out]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect
          width="14"
          height="14"
          x="8"
          y="8"
          rx="2"
        />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </svg>
    </span>
  </button>

  {#if isCopied}
    <div
      role="status"
      class="bg-neutral text-neutral-content pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 animate-[tooltip-in_150ms_ease-out] rounded-md px-2.5 py-1.5 text-xs font-medium whitespace-nowrap shadow-lg"
    >
      {$_("formActions.copiedOutput")}
    </div>
  {/if}
</div>

<style>
  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.5);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>