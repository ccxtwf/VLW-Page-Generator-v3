import type { ThemeChangedEventPayload } from "../../../src/schemas/events.d";

export type DaisyUiTheme = "corporate" | "dark" | "gato";
export type HandsontableTheme = "auto" | "light" | "dark";
export type ThemeChangedEvent = CustomEvent<ThemeChangedEventPayload>;

export const THEMES: { theme: DaisyUiTheme; labelKey: string }[] = [
  { theme: "corporate", labelKey: "themes.light" },
  { theme: "dark", labelKey: "themes.dark" },
  { theme: "gato", labelKey: "themes.dark-lc" },
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

export function getActiveTheme(): DaisyUiTheme {
  return isAutoDarkMode() ? getActiveDarkTheme() : getActiveLightTheme();
}

export function isThemeDarkMode(theme: DaisyUiTheme): boolean {
  switch (theme) {
    case "dark":
    case "gato":
      return true;
    case "corporate":
      return false;
  }
  throw new Error("Unexpected argument passed to isThemeDarkMode: ", theme);
}

function getLcKey(isDarkMode: boolean): string {
  return `preferred-${isDarkMode ? "dark" : "light"}-theme`;
}

export async function setTheme(theme: DaisyUiTheme): Promise<void> {
  // console.log(e.currentTarget.value, e.currentTarget.checked);
  const isDarkMode = isThemeDarkMode(theme);
  const htTheme = (isThemeDarkMode(theme) ? "dark" : "light") as HandsontableTheme;
  const payload = { theme, htTheme, isDarkMode };
  DEBUG && console.log("Dispatching ThemeChangedEvent", payload);
  window.dispatchEvent(
    new CustomEvent<ThemeChangedEventPayload>("themeChanged", {
      detail: payload,
    }),
  );
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem(getLcKey(isDarkMode), theme);
}