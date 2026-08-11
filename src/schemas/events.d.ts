export interface ThemeChangedEventPayload {
  theme: "auto" | "light" | "dark";
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