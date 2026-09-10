import type { DaisyUiTheme, HandsontableTheme } from "../lib/utils/themeUtils";

export interface ThemeChangedEventPayload {
  theme: DaisyUiTheme;
  htTheme: HandsontableTheme;
  isDarkMode: boolean;
}

export interface LyricsParsePayload {
  toggleText: string;
  lyrics: string[][];
  translator: string;
  isOfficialTranslation: boolean;
}

declare global {
  interface WindowEventMap {
    themeChanged: CustomEvent<ThemeChangedEventPayload>;
    parsedLyrics: CustomEvent<LyricsParsePayload>;
  }
}