import { registerRenderer } from "handsontable/renderers";

import { urlRenderer, vlwUrlPageRenderer, vlwInternalLinkRenderer } from "./renderers/url";

registerRenderer("url", urlRenderer);
registerRenderer("vlw-page", vlwUrlPageRenderer);
registerRenderer("vlw-internal-link", vlwInternalLinkRenderer);
