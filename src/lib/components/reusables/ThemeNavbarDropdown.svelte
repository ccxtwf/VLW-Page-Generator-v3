<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { _ } from "svelte-i18n";
  import {
    THEMES,
    setTheme,
    type DaisyUiTheme,
    type ThemeChangedEvent,
  } from "../../utils/themeUtils";

  const cbWatchTheme = (e: ThemeChangedEvent) => {
    const theme = e.detail.theme;
    const el = document.querySelector(`input[name='theme-navbar-controller'][value='${theme}']`);
    if (el) {
      (el as HTMLInputElement).checked = true;
    }
  };

  function handleThemeToggle(e: Event) {
    setTheme((e.target as HTMLInputElement).value as DaisyUiTheme);
  }

  onMount(() => {
    window.addEventListener("themeChanged", cbWatchTheme);
  });
  onDestroy(() => {
    window.removeEventListener("themeChanged", cbWatchTheme);
  });
</script>

<div class="dropdown dropdown-bottom dropdown-end">
  <div
    tabindex="0"
    role="button"
    class="btn btn-ghost text-neutral-content hover:text-base-content m-1"
  >
    {$_("themeSelector")}
    <svg
      width="12px"
      height="12px"
      class="inline-block h-2 w-2 fill-current opacity-60"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 2048 2048"
    >
      <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
    </svg>
  </div>
  <ul
    tabindex="-1"
    class="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl"
  >
    {#each THEMES as { theme, labelKey }}
      <li>
        <input
          type="radio"
          name="theme-navbar-controller"
          class="theme-controller btn btn-sm btn-block btn-ghost w-full justify-start"
          aria-label={$_(labelKey)}
          value={theme}
          onchange={handleThemeToggle}
        />
      </li>
    {/each}
  </ul>
</div>