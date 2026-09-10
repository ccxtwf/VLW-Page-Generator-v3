<script lang="ts">
  import { _ } from "svelte-i18n";
  import { currentRoute, ROUTES } from "../router";
  import ThemeNavbarDropdown from "./reusables/ThemeNavbarDropdown.svelte";

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
</script>

<header
  class="navbar-header fixed z-50 w-full transform-gpu shadow-sm transition-transform duration-300"
  class:-translate-y-full={show}
  class:translate-y-0={!show}
>
  <div class="navbar bg-neutral text-neutral-content border-black-800 border-b-2">
    <div class="navbar-start">
      <div class="dropdown">
        <div
          tabindex="0"
          role="button"
          class="btn btn-ghost text-neutral-content lg:hidden"
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
          class="menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box z-1 mt-3 w-52 p-2 shadow"
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
        href={import.meta.env.BASE_URL}
      >
        {$_("sitename")}
      </a>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul
        class="menu menu-horizontal px-1"
        role="navigation"
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
    <div class="navbar-end">
      <ThemeNavbarDropdown />
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