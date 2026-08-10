import { registerRenderer } from "handsontable/renderers";
import { registerTheme, mainTheme } from "handsontable/themes";

import { urlRenderer, vlwUrlPageRenderer, vlwInternalLinkRenderer } from "./renderers/url";
import { customStyleRenderer, lyricsRenderer } from "./renderers/lyrics";

registerTheme("auto", mainTheme).setColorScheme("auto").setDensityType("compact");
registerTheme("light", mainTheme).setColorScheme("light").setDensityType("compact");
registerTheme("dark", mainTheme).setColorScheme("dark").setDensityType("compact");

registerRenderer("url", urlRenderer);
registerRenderer("vlw-page", vlwUrlPageRenderer);
registerRenderer("vlw-internal-link", vlwInternalLinkRenderer);
registerRenderer("lyrics-custom-style", customStyleRenderer);
registerRenderer("lyrics", lyricsRenderer);