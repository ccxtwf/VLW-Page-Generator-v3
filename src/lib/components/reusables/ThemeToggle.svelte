<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { _ } from "svelte-i18n";
  import {
    isAutoDarkMode,
    getActiveLightTheme,
    getActiveDarkTheme,
    setTheme,
    type ThemeChangedEvent,
  } from "../../utils/themeUtils";

  let isDarkModeToggled = $state<boolean>(isAutoDarkMode());

  const cbWatchTheme = (e: ThemeChangedEvent) => {
    const el = document.querySelector(`input[name='theme-toggle']`)! as HTMLInputElement;
    isDarkModeToggled = e.detail.isDarkMode;
    el.checked = isDarkModeToggled;
  };

  onMount(() => {
    window.addEventListener("themeChanged", cbWatchTheme);
  });
  onDestroy(() => {
    window.removeEventListener("themeChanged", cbWatchTheme);
  });
</script>

<label
  class="lyrics-theme-toggle flex cursor-pointer gap-2"
  class:theme-toggled={isDarkModeToggled}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="sun-icon"
  >
    <circle
      cx="12"
      cy="12"
      r="5"
    />
    <path
      d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
    />
  </svg>
  <input
    type="checkbox"
    name="theme-toggle"
    class="toggle theme-controller"
    checked={isDarkModeToggled}
    defaultChecked={isDarkModeToggled}
    value={getActiveDarkTheme()}
    onchange={function (e) {
      isDarkModeToggled = (e.target as HTMLInputElement).checked;
      setTheme(isDarkModeToggled ? getActiveDarkTheme() : getActiveLightTheme());
    }}
  />
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="moon-icon"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
</label>