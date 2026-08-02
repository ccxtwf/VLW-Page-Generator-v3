import { registerRenderer } from "handsontable/renderers";

import { urlRenderer, vlwUrlPageRenderer, vlwInternalLinkRenderer } from "./utils";

registerRenderer("url", urlRenderer);
registerRenderer("vlw-page", vlwUrlPageRenderer);
registerRenderer("vlw-internal-link", vlwInternalLinkRenderer);