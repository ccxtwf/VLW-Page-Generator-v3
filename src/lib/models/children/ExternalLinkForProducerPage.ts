import ExternalLink from "./ExternalLink";

export default class ExternalLinkForProducerPage extends ExternalLink {
  constructor(
    public url: string,
    public description: string,
    public isOfficial: boolean,
    public isMedia: boolean,
    public isInactive: boolean,
  ) {
    super(url, description, isOfficial, isInactive);
  }

  static createDefault() {
    return new ExternalLinkForProducerPage("", "", false, false, false);
  }

  preprocess() {
    super.preprocess();
    this.isMedia = this.isMedia || false;
    this.isInactive = this.isInactive || false;
  }
}
