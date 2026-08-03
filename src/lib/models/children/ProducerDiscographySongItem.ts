import { preprocessStringParams } from "../../utils/utils";

export default class ProducerDiscographySongItem {
  constructor(
    public page: string,
    public additionalParameters: string,
  ) {}

  static createDefault() {
    return new ProducerDiscographySongItem("", "");
  }

  preprocess(): void {
    preprocessStringParams(this, ["page", "additionalParameters"]);
  }

  _getWikitext(tname: string): string {
    let params = this.additionalParameters;
    if (params !== "" && !params.startsWith("|")) {
      params = `|${params}`;
    }
    return `{{${tname}|${this.page}${params}}}`;
  }

  getWikitext(): string {
    return this._getWikitext("pwt row");
  }
}
