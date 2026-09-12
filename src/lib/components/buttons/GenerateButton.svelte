<script lang="ts">
  import { _ } from "svelte-i18n";

  let { class: cssClass }: { class?: string } = $props();
</script>

<button
  class={["btn btn-primary", cssClass || "sm:btn-wide max-sm:w-full"]}
  type="submit"
  accesskey="s"
  title={$_("formActions.generate") + " [S]"}
>
  {$_("formActions.generate")}
</button>