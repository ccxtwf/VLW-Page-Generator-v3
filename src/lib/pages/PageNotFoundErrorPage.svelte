<script lang="ts">
  import { _ } from "svelte-i18n";
</script>

<div class="page-container mx-auto max-w-5xl p-4 h-dvh text-center">
  <h1 class="text-2xl font-semibold mt-40">
    {$_("error.notFound.header")}
  </h1>
  <p class="text-secondary">{$_("error.notFound.body")}</p>
</div>
