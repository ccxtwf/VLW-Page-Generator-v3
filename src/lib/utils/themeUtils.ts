import type {
  LyricsThemeToggledEventPayload,
  ThemeChangedEventPayload,
} from "../../../src/schemas/events.d";

const daisyUiThemes = ["corporate", "dark", "gato", "nord"] as const;
export type DaisyUiTheme = (typeof daisyUiThemes)[number];
export type ThemeChangedEvent = CustomEvent<ThemeChangedEventPayload>;

export const THEMES: { theme: DaisyUiTheme; labelKey: string }[] = [
  { theme: "corporate", labelKey: "themes.light" },
  { theme: "nord", labelKey: "themes.nord" },
  { theme: "dark", labelKey: "themes.dark" },
  { theme: "gato", labelKey: "themes.gato" },
];

/**
 * Returns true if the browser is set to prefer dark mode.
 *
 * @returns
 */
export function isAutoDarkMode(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function getActiveLightTheme(): DaisyUiTheme {
  return (localStorage.getItem(getLcKey(false)) as DaisyUiTheme) ?? "corporate";
}

export function getActiveDarkTheme(): DaisyUiTheme {
  return (localStorage.getItem(getLcKey(true)) as DaisyUiTheme) ?? "dark";
}

export function getActiveTheme(): DaisyUiTheme | null {
  return localStorage.getItem(getLcKey()) as DaisyUiTheme;
}

export function isValidTheme(theme: string): boolean {
  return (daisyUiThemes as readonly string[]).indexOf(theme) > -1;
}

export function isDarkModeActive(): boolean {
  const activeTheme = getActiveTheme();
  if (!activeTheme || !isValidTheme(activeTheme)) {
    return isAutoDarkMode();
  }
  return isThemeDarkMode(activeTheme);
}

export function isThemeDarkMode(theme: DaisyUiTheme): boolean {
  switch (theme) {
    case "dark":
    case "gato":
      return true;
    case "corporate":
    case "nord":
      return false;
  }
  throw new Error("Unexpected argument passed to isThemeDarkMode: ", theme);
}

function getLcKey(isDarkMode?: boolean): string {
  return `preferred-${isDarkMode === undefined ? "" : isDarkMode ? "dark-" : "light-"}theme`;
}

export function setTheme(theme: DaisyUiTheme): void {
  // console.log(e.currentTarget.value, e.currentTarget.checked);
  const isDarkMode = isThemeDarkMode(theme);
  const payload = { theme, isDarkMode };
  DEBUG && console.log("Dispatching ThemeChangedEvent", payload);
  window.dispatchEvent(
    new CustomEvent<ThemeChangedEventPayload>("themeChanged", {
      detail: payload,
    }),
  );
  setLyricsTheme(isDarkMode);
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem(getLcKey(isDarkMode), theme);
  localStorage.setItem(getLcKey(), theme);
}

export function setLyricsTheme(isDarkMode: boolean): void {
  const payload = { isDarkMode };
  DEBUG && console.log("Dispatching LyricsThemeToggledEvent", payload);
  window.dispatchEvent(
    new CustomEvent<LyricsThemeToggledEventPayload>("lyricsThemeToggled", {
      detail: payload,
    }),
  );
}