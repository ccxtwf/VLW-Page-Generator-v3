<script lang="ts">
  import Navbar from "./Navbar.svelte";
  import Footer from "./Footer.svelte";
  import type { Snippet } from "svelte";

  let { children }: { children?: Snippet } = $props();
</script>

<div class="flex flex-col min-h-screen layout-wrapper">
  <Navbar />

  <main class="mt-20">
    {#if children}
      {@render children()}
    {/if}
  </main>

  <Footer />
</div>

<style>
  .layout-wrapper {
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      sans-serif;
  }
</style>
