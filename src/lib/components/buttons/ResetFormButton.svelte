<script lang="ts">
  import { _ } from "svelte-i18n";

  function handleClick(e: Event) {
    if (!window.confirm($_("confirmClear"))) {
      e.preventDefault();
    }
  }
</script>

<button
  class="btn btn-error ml-auto w-24 text-xs max-sm:w-full"
  type="reset"
  tabindex="-1"
  accesskey="r"
  title={$_("formActions.reset") + " [R]"}
  onclick={handleClick}
>
  {$_("formActions.reset")}
</button>