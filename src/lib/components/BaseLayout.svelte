<script lang="ts">
  import "../../app.css";

  import Navbar from "./Navbar.svelte";
  import Footer from "./Footer.svelte";
  import type { Snippet } from "svelte";

  let { children }: { children?: Snippet } = $props();
</script>

<div class="layout-wrapper">
  <Navbar />

  <main>
    {#if children}
      {@render children()}
    {/if}
  </main>

  <Footer />
</div>

<style>
  .layout-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
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
