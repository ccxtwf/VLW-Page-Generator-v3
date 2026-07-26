<script lang="ts">
  import { _, isLoading } from 'svelte-i18n';
  import BaseLayout from './lib/components/BaseLayout.svelte';
  import { currentRoute, ROUTES } from './lib/router';
  import type { Component } from 'svelte';

  const routes: Record<string, () => Promise<{ default: Component<any> }>> = ROUTES.reduce((acc, { path, component }) => ({
    ...acc,
    [path]: () => import(component),
  }), {});
  routes['/not-found'] = () => import('./lib/pages/PageNotFoundErrorPage.svelte');

  let pageLoader = $derived(
    routes[$currentRoute] ? routes[$currentRoute]() : routes['/not-found']()
  );
</script>

{#if $isLoading}
  <!-- Loading i18n -->
{:else}
  <BaseLayout>
    {#await pageLoader}
      <div class="throbber-container" aria-label="{$_('loading.text')}">
        <div class="spinner"></div>
      </div>
    {:then module}
      <module.default />
    {:catch error}
      <div class="error-container">
        <p>{$_('loading.error')}</p>
      </div>
    {/await}
  </BaseLayout>
{/if}

<style>
  .throbber-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 250px;
  }

  .spinner {
    width: 44px;
    height: 44px;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-left-color: #6366f1;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .error-container {
    text-align: center;
    color: #f87171;
    padding: 2rem;
  }
</style>

