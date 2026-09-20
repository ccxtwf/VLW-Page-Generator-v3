import type { DaisyUiTheme, HandsontableTheme } from "../lib/utils/themeUtils";

export interface ThemeChangedEventPayload {
  theme: DaisyUiTheme;
  isDarkMode: boolean;
}

export interface LyricsThemeToggledEventPayload {
  isDarkMode: boolean;
}

export interface ParsedLyricsPayload {
  toggleText: string;
  lyrics: string[][];
  translator: string;
  isOfficialTranslation: boolean;
}

declare global {
  interface WindowEventMap {
    themeChanged: CustomEvent<ThemeChangedEventPayload>;
    lyricsThemeToggled: CustomEvent<LyricsThemeToggledEventPayload>;
    parsedLyrics: CustomEvent<ParsedLyricsPayload>;
  }
}