<script lang="ts">
  import { _ } from "svelte-i18n";
  import { currentRoute, ROUTES } from "../router";

  let show = $state(false);

  let prevScrollPos = window.pageYOffset;
  window.onscroll = function () {
    let currentScrollPos = window.pageYOffset;
    if (prevScrollPos > currentScrollPos) {
      show = false;
    } else {
      show = true;
    }
    prevScrollPos = currentScrollPos;
  };

  async function setTheme(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    // console.log(e.currentTarget.value, e.currentTarget.checked);
    const theme = (() => {
      switch (e.currentTarget.value) {
        case "dark":
          return "dark";
        case "corporate":
          return "light";
        default:
          return "auto";
      }
    })();
    window._theme = theme;
    window.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: { theme },
      }),
    );
  }
</script>

<header 
  class="fixed w-full transition-transform duration-300 transform-gpu z-50 shadow-sm navbar-header" 
  class:-translate-y-full={show} 
  class:translate-y-0={!show}
>
  <div class="navbar bg-neutral text-neutral-content border-black-800 border-b-2">
    <div class="navbar-start">
      <div class="dropdown">
        <div
          tabindex="0"
          role="button"
          class="btn btn-ghost lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </div>
        <ul
          tabindex="-1"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          {#each ROUTES as route}
            <li
              class="nav-link"
              class:active={$currentRoute === route.path}
            >
              <a href={`#${route.path}`}>
                {$_(`pages.${route.labelKey}`)}
              </a>
            </li>
          {/each}
        </ul>
      </div>
      <a
        class="btn btn-ghost text-neutral-content text-xl"
        href="/">{$_("sitename")}</a
      >
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        {#each ROUTES as route}
          <li
            class="nav-link"
            class:active={$currentRoute === route.path}
          >
            <a href={`#${route.path}`}>
              {$_(`pages.${route.labelKey}`)}
            </a>
          </li>
        {/each}
      </ul>
    </div>
    <div class="navbar-end">
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
          {let themes = [
            { theme: "corporate", label: "Light" },
            { theme: "dark", label: "Dark" },
          ]}
          {#each themes as { theme, label }}
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                class="theme-controller btn btn-sm btn-block btn-ghost w-full justify-start"
                aria-label={label}
                value={theme}
                onchange={setTheme}
              />
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</header>

<style>
  .nav-link.active {
    background-color: var(--color-base-300);
    color: var(--color-base-content);
    font-weight: 600;
  }
  .navbar-center .nav-link.active {
    border-bottom: solid 2px var(--color-secondary);
  }
</style>