<script lang="ts">
  import { _ } from "svelte-i18n";

  function handleClick(e: Event) {
    if (!window.confirm($_("confirmClear"))) {
      e.preventDefault();
      return;
    }
  }
</script>

<button
  class="btn btn-error ml-auto w-24 text-xs max-sm:w-full"
  type="reset"
  onclick={handleClick}
>
  {$_("formActions.clear")}
</button>