import { preprocessStringParams } from "../../utils/utils";
import type { PreprocessorMixin } from "../base";
import type { IAlbumBroadcastLink } from "../schema";

export default class AlbumBroadcastLink implements IAlbumBroadcastLink {
  idx: number | null = $state(null);
  site: string = $state("");
  url: string = $state("");

  constructor({
    idx = null,
    site = "",
    url = "",
  }: {
    idx?: number | null;
    site?: string;
    url?: string;
  } = {}) {
    this.idx = idx;
    this.site = site;
    this.url = url;
  }

  preprocess(): void {
    preprocessStringParams(this, ["site", "url"]);
  }

  toJSON(): IAlbumBroadcastLink & PreprocessorMixin {
    const { idx, site, url } = this;
    const res = {
      idx,
      site,
      url,
      preprocess: this.preprocess,
    };
    return res;
  }
}
