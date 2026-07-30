<script lang="ts">
  import { _ } from "svelte-i18n";

  let { onclick }: { onclick: (e: Event) => void } = $props();
</script>

<button
  class="btn btn-secondary btn-sm"
  type="button"
  {onclick}
>
  {$_("formActions.autoloadCategories")}
</button>