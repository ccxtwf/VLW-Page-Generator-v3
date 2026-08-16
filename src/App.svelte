<script lang="ts">
  import { _, isLoading } from "svelte-i18n";
  import BaseLayout from "./lib/components/BaseLayout.svelte";
  import { currentRoute, navigate, ROUTES } from "./lib/router";
  import type { Component } from "svelte";

  const routes: Record<string, () => Promise<{ default: Component<any> }>> =
    ROUTES.reduce(
      (acc, { path, loader }) => ({
        ...acc,
        [path]: loader,
      }),
      {},
    );
  routes["/not-found"] = () =>
    import("./lib/pages/PageNotFoundErrorPage.svelte");

  $effect(() => {
    // on root, redirect to the songs page generator
    if ($currentRoute === "/") {
      navigate("/songs");
    }
  });

  let pageLoader = $derived(
    routes[$currentRoute] ? routes[$currentRoute]() : routes["/not-found"](),
  );

  window.onbeforeunload = (event) => {
    event.preventDefault();
    event.returnValue = "";
  };

  navigation.onnavigate = (event) => {
    if ($currentRoute !== "/" && !window.confirm($_("confirmNav"))) {
      event.preventDefault();
    }
  };
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
      <div class="page-container mx-auto my-20 max-w-5xl p-4 text-center">
        <p class="text-secondary">{$_("loading.error")}</p>
      </div>
    {/await}
  </BaseLayout>
{/if}
