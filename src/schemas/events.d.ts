export interface ThemeChangedEventPayload {
  theme: "auto" | "light" | "dark";
}

declare global {
  interface WindowEventMap {
    themeChanged: CustomEvent<ThemeChangedEventPayload>;
  }
}