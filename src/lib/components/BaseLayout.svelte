<script lang="ts">
  import Navbar from './Navbar.svelte';
  import Footer from './Footer.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children?: Snippet } = $props();
</script>

<div class="layout-wrapper">
  <Navbar />
  
  <main class="content-container">
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
    background-color: #121216;
    color: #e4e4e7;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }

  .content-container {
    flex: 1;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 2rem 1.5rem;
    box-sizing: border-box;
  }
</style>

