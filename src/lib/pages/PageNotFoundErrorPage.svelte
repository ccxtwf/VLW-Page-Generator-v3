<script lang="ts">
  import { _ } from "svelte-i18n";
</script>

<div class="page-container mx-auto my-20 max-w-5xl p-4 text-center">
  <h1 class="text-2xl font-semibold">
    {$_("error.notFound.header")}
  </h1>
  <p class="text-secondary">{$_("error.notFound.body")}</p>
</div>
