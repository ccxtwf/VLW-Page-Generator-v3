import { registerRenderer } from "handsontable/renderers";

import { urlRenderer, vlwUrlPageRenderer, vlwInternalLinkRenderer } from "./renderers/url";
import { customStyleRenderer, lyricsRenderer } from "./renderers/lyrics";

registerRenderer("url", urlRenderer);
registerRenderer("vlw-page", vlwUrlPageRenderer);
registerRenderer("vlw-internal-link", vlwInternalLinkRenderer);
registerRenderer("lyrics-custom-style", customStyleRenderer);
registerRenderer("lyrics", lyricsRenderer);
