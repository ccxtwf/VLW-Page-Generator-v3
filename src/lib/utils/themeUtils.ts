import type { ThemeChangedEventPayload } from "../../../src/schemas/events.d";

export type DaisyUiTheme = "corporate" | "dark";
export type HandsontableTheme = "auto" | "light" | "dark";
export type ThemeChangedEvent = CustomEvent<ThemeChangedEventPayload>;

export const THEMES: { theme: DaisyUiTheme; labelKey: string }[] = [
  { theme: "corporate", labelKey: "themes.light" },
  { theme: "dark", labelKey: "themes.dark" },
];

/**
 * Returns true if the browser is set to prefer dark mode.
 *
 * @returns
 */
export function isAutoDarkMode(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * TODO: Possibly extend this function to choose between multiple light mode themes.
 */
export function getActiveLightTheme(): DaisyUiTheme {
  return "corporate";
}

/**
 * TODO: Possibly extend this function to choose between multiple dark mode themes, e.g. the
 * "default" dark mode theme (`dark`) and a darker, low contrast theme.
 */
export function getActiveDarkTheme(): DaisyUiTheme {
  return "dark";
}

export function isThemeDarkMode(theme: DaisyUiTheme): boolean {
  switch (theme) {
    case "dark":
      return true;
    case "corporate":
      return false;
  }
  throw new Error("Unexpected argument passed to isThemeDarkMode: ", theme);
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
}