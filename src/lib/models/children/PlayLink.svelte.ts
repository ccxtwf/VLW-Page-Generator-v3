import { preprocessStringParams } from "../../utils/utils";
import type { IPlayLink } from "../schema";

export default class PlayLink implements IPlayLink {
  site: string = $state("");
  url: string = $state("");
  isReprint: boolean = $state(false);
  isAutogen: boolean = $state(false);
  isDeleted: boolean = $state(false);
  viewCount: string = $state("");

  constructor({
    site = "",
    url = "",
    isReprint = false,
    isAutogen = false,
    isDeleted = false,
    viewCount = "",
  }: {
    site?: string;
    url?: string;
    isReprint?: boolean;
    isAutogen?: boolean;
    isDeleted?: boolean;
    viewCount?: string;
  } = {}) {
    this.site = site;
    this.url = url;
    this.isReprint = isReprint;
    this.isAutogen = isAutogen;
    this.isDeleted = isDeleted;
    this.viewCount = viewCount;
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

  toJSON(): IPlayLink {
    const { site, url, isReprint, isAutogen, isDeleted, viewCount } = this;
    return {
      site,
      url,
      isReprint,
      isAutogen,
      isDeleted,
      viewCount,
    };
  }
}