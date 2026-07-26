<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { ROUTES } from '../router';
  const buildCode = import.meta.env.VITE_BUILD_CODE;
</script>

<footer class="app-footer">
  <div class="footer-container">
    <div class="footer-main">
      <div class="author-credits">
        Author: <span class="author-name">ccxtwf</span>
      </div>

      <nav class="small-nav" aria-label="Footer Links">
        {#each ROUTES as route}
          <a href={`#${route.path}`} class="footer-link">{$_(`pages.${route.labelKey}`)}</a>
        {/each}
      </nav>

      <div class="repo-links">
        <a
          href="https://github.com/ccxtwf"
          target="_blank"
          rel="noopener noreferrer"
          class="icon-link"
          title="GitHub Repository"
        >
          <svg class="icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span>GitHub</span>
        </a>
        <a
          href="https://gitlab.com/ccxtwf"
          target="_blank"
          rel="noopener noreferrer"
          class="icon-link"
          title="GitLab Mirror"
        >
          <svg class="icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 01-.3-.92l2.36-7.25a.42.42 0 01.8-.04l2.45 7.51h10.68l2.45-7.51a.42.42 0 01.8.04l2.36 7.25a.84.84 0 01-.3.92z"/>
          </svg>
          <span>GitLab</span>
        </a>
      </div>
    </div>

    <div class="footer-meta">
      <span class="build-code">Build code: {buildCode}</span>
    </div>
  </div>
</footer>

<style>
  .app-footer {
    background-color: #18181c;
    border-top: 1px solid #2d2d38;
    padding: 1.5rem 1.5rem;
    margin-top: auto;
  }

  .footer-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .footer-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .author-credits {
    font-size: 0.875rem;
    color: #a1a1aa;
  }

  .author-name {
    color: #6366f1;
    font-weight: 600;
  }

  .small-nav {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .footer-link {
    color: #71717a;
    font-size: 0.8125rem;
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .footer-link:hover {
    color: #e4e4e7;
  }

  .repo-links {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .icon-link {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    color: #9ea0a6;
    font-size: 0.8125rem;
    text-decoration: none;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.04);
    transition: all 0.15s ease;
  }

  .icon-link:hover {
    color: #ffffff;
    background-color: rgba(255, 255, 255, 0.08);
  }

  .footer-meta {
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 0.75rem;
    display: flex;
    justify-content: flex-end;
  }

  .build-code {
    font-size: 0.75rem;
    color: #71717a;
  }
</style>