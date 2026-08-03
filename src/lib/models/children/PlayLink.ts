import { preprocessStringParams } from "../../utils/utils";

export default class PlayLink {
  constructor(
    public site: string,
    public url: string,
    public isReprint: boolean,
    public isAutogen: boolean,
    public isDeleted: boolean,
    public viewCount: string,
  ) {}

  static createDefault(): PlayLink {
    return new PlayLink("", "", false, false, false, "");
  }

  preprocess(): void {
    preprocessStringParams(this, ["site", "url", "viewCount"]);
    this.isReprint = this.isReprint || false;
    this.isAutogen = this.isAutogen || false;
    this.isDeleted = this.isDeleted || false;
  }

  getPlayLinkWikitext(): string {
    const { url, isAutogen, isReprint, isDeleted } = this;

    let res = `{{#|${url}`;
    if (isAutogen) {
      res += `|auto=y`;
    }
    const annotations: string[] = [];
    if (isReprint) {
      annotations.push("reprint");
    }
    if (isDeleted) {
      annotations.push("deleted");
    }
    if (annotations.length) {
      res += `|label=${annotations.join(", ")}`;
    }
    res += "}}";
    return res;
  }

  getFormattedViewCount(): string {
    let viewCountStr = this.viewCount.trim();
    viewCountStr = viewCountStr.replace(/[,.]\s?(?=\d{3})/g, "");
    viewCountStr = viewCountStr.replace(/\+/g, "");

    //Round down view count number if numeric
    if (viewCountStr !== "" && !isNaN(+viewCountStr)) {
      let viewCount = parseInt(viewCountStr);
      let div = 1;
      if (viewCount < 1000) {
        div = 10 ** Math.trunc(Math.log10(viewCount));
      } else {
        div = 10 ** (Math.trunc(Math.log10(viewCount)) - 1);
      }
      viewCount = Math.floor(viewCount / div) * div;
      return viewCount.toLocaleString("en-US") + "+";
    }

    //Show view count number as text if non-numeric
    return this.viewCount;
  }
}
