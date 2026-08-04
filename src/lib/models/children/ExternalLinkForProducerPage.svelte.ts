import type { IExternalLinkForProducerPage } from "../schema";
import ExternalLink from "./ExternalLink.svelte";

export default class ExternalLinkForProducerPage
  extends ExternalLink
  implements IExternalLinkForProducerPage
{
  isMedia: boolean = $state(false);

  constructor({
    url = "",
    description = "",
    isOfficial = false,
    isInactive = false,
    isMedia = false,
  }: {
    url?: string;
    description?: string;
    isOfficial?: boolean;
    isInactive?: boolean;
    isMedia?: boolean;
  } = {}) {
    super({ url, description, isOfficial, isInactive });
    this.isMedia = isMedia;
  }

  preprocess() {
    super.preprocess();
    this.isMedia = this.isMedia || false;
    this.isInactive = this.isInactive || false;
  }

  toJSON(): IExternalLinkForProducerPage {
    const { url, description, isInactive, isOfficial, isMedia } = this;
    return {
      url,
      description,
      isInactive,
      isOfficial,
      isMedia,
    };
  }
}
