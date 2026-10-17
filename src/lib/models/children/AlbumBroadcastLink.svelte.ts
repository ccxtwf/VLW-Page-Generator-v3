import { ALBUM_STREAMING_LINKS } from "../../../constants";
import { preprocessStringParams } from "../../utils/utils";
import type { IAlbumBroadcastLink } from "../schema";
import { translate } from "../../../i18n";

export default class AlbumBroadcastLink implements IAlbumBroadcastLink {
  idx: number = $state(-1);
  paramKey: string | null = $state(null);
  url: string = $state("");
  __computed: { isValid: boolean; embedid: string | null } = {
    isValid: true,
    embedid: null,
  };

  constructor(data: { idx: number; paramKey: string | null; url?: string }) {
    Object.assign(this, data);
  }

  preprocess(): void {
    preprocessStringParams(this, ["paramKey", "url"]);
    if (this.idx < 0) {
      this.__computed = { isValid: true, embedid: null };
      return;
    }
    const c = ALBUM_STREAMING_LINKS[this.idx];
    const m = c.regex.exec(this.url);
    const isValid = this.url ? !!m : true;
    const embedid = m ? m.groups!["embedid"] : null;
    this.__computed = { isValid, embedid };
  }

  getService(): string {
    return translate("albumGenForm.officialLinks.items." + this.paramKey!);
  }

  toJSON(): IAlbumBroadcastLink {
    const { idx, paramKey, url } = this;
    const res = {
      idx,
      paramKey,
      url,
    };
    return res;
  }
}