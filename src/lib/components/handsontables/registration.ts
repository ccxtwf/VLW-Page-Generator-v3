import { registerRenderer } from "handsontable/renderers";
import { registerTheme, mainTheme, getTheme } from "handsontable/themes";

import { urlRenderer, vlwUrlPageRenderer, vlwInternalLinkRenderer } from "./renderers/url";
import { customStyleRenderer, lyricsRenderer } from "./renderers/lyrics";
import type { ThemeChangedEventPayload } from "../../../schemas/events";

registerTheme(mainTheme).setColorScheme("auto");

registerRenderer("url", urlRenderer);
registerRenderer("vlw-page", vlwUrlPageRenderer);
registerRenderer("vlw-internal-link", vlwInternalLinkRenderer);
registerRenderer("lyrics-custom-style", customStyleRenderer);
registerRenderer("lyrics", lyricsRenderer);

/**
 * Listen to changes set upon the page's theme
 */
window.addEventListener("themeChanged", (event: CustomEvent<ThemeChangedEventPayload>) => {
  getTheme("main")?.setColorScheme(event.detail.theme);
});