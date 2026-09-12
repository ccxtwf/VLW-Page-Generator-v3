<script lang="ts">
  import { _ } from "svelte-i18n";

  let { onclick }: { onclick: (e: Event) => void } = $props();
</script>

<button
  class="btn btn-neutral w-24 text-xs max-sm:w-full"
  tabindex="-1"
  type="button"
  accesskey="w"
  title={$_("formActions.clear") + " [W]"}
  {onclick}
>
  {$_("formActions.clear")}
</button>