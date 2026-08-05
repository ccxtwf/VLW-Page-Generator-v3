import { ALBUM_STREAMING_LINKS } from "../../../constants";
import { preprocessStringParams } from "../../utils/utils";
import type { IAlbumBroadcastLink } from "../schema";

export default class AlbumBroadcastLink implements IAlbumBroadcastLink {
  idx: number = $state(-1);
  site: string = $state("");
  url: string = $state("");
  __computed: { paramKey: string | null; isValid: boolean; embedid: string | null } = {
    paramKey: null,
    isValid: true,
    embedid: null,
  };

  constructor({ idx, site, url = "" }: { idx: number; site: string; url?: string }) {
    this.idx = idx;
    this.site = site;
    this.url = url;
  }

  preprocess(): void {
    preprocessStringParams(this, ["site", "url"]);
    const c = ALBUM_STREAMING_LINKS[this.idx];
    const m = c.regex.exec(this.url);
    const isValid = this.url ? !!m : true;
    const embedid = m ? m.groups!["embedid"] : null;
    const paramKey = c.paramKey;
    this.__computed = { paramKey, isValid, embedid };
  }

  toJSON(): IAlbumBroadcastLink {
    const { idx, site, url } = this;
    const res = {
      idx,
      site,
      url,
    };
    return res;
  }
}
