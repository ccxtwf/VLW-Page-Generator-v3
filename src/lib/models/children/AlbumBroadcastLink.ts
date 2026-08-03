import { preprocessStringParams } from "../../utils/utils";

export default class AlbumBroadcastLink {
  constructor(
    public idx: number | null,
    public site: string,
    public url: string,
  ) {}

  static createDefault(): AlbumBroadcastLink {
    return new AlbumBroadcastLink(null, "", "");
  }

  preprocess(): void {
    preprocessStringParams(this, ["site", "url"]);
  }
}
