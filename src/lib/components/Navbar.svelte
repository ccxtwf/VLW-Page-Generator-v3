<script lang="ts">
  import { currentRoute, ROUTES } from '../router';
</script>

<header class="navbar-header">
  <div class="navbar-container">
    <div class="brand">
      <span class="brand-logo">🎵</span>
      <span class="brand-name">VLW Page Generator</span>
    </div>
    
    <nav class="nav-links" aria-label="Main Navigation">
      {#each ROUTES as route}
        <a 
          href={`#${route.path}`} 
          class="nav-link"
          class:active={$currentRoute === route.path}
        >
          {route.label}
        </a>
      {/each}
    </nav>
  </div>
</header>

<style>
  .navbar-header {
    background-color: #1e1e24;
    border-bottom: 1px solid #2d2d38;
    padding: 0.75rem 1.5rem;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .navbar-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    font-size: 1.125rem;
    color: #ffffff;
  }

  .brand-logo {
    font-size: 1.25rem;
  }

  .nav-links {
    display: flex;
    gap: 0.5rem;
  }

  .nav-link {
    color: #9ea0a6;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.9375rem;
    font-weight: 500;
    transition: all 0.15s ease-in-out;
  }

  .nav-link:hover {
    color: #ffffff;
    background-color: rgba(255, 255, 255, 0.06);
  }

  .nav-link.active {
    color: #6366f1;
    background-color: rgba(99, 102, 241, 0.12);
    font-weight: 600;
  }
</style>
