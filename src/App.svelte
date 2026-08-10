<script lang="ts">
  import { _, isLoading } from "svelte-i18n";
  import BaseLayout from "./lib/components/BaseLayout.svelte";
  import { currentRoute, navigate, ROUTES } from "./lib/router";
  import type { Component } from "svelte";

  const routes: Record<string, () => Promise<{ default: Component<any> }>> = ROUTES.reduce(
    (acc, { path, component }) => ({
      ...acc,
      [path]: () => import(component),
    }),
    {},
  );
  routes["/not-found"] = () => import("./lib/pages/PageNotFoundErrorPage.svelte");

  $effect(() => {
    // on root, redirect to the songs page generator
    if ($currentRoute == "/") {
      navigate("/songs");
    }
  });

  let pageLoader = $derived(
    routes[$currentRoute] ? routes[$currentRoute]() : routes["/not-found"](),
  );
</script>

{#if $isLoading}
  <!-- Loading i18n -->
{:else}
  <BaseLayout>
    {#await pageLoader}
      <div
        class="bg-opacity-50 text-neutral-content fixed inset-0 z-50 flex h-screen w-screen flex-col items-center justify-center gap-2 bg-gray-900"
      >
        <div class="flex-item loading loading-spinner loading-xl"></div>
        <div class="flex-item text-xl">
          {$_("loading.text")}
        </div>
      </div>
    {:then module}
      <module.default />
    {:catch error}
      <div class="p-2 text-center text-red-600">
        <p>{$_("loading.error")}</p>
      </div>
    {/await}
  </BaseLayout>
{/if}

<style>
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>