import { preprocessStringParams } from "../../utils/utils";
import type { IProducerDiscographySongItem } from "../schema";

export default class ProducerDiscographySongItem implements IProducerDiscographySongItem {
  page: string = $state("");
  additionalParameters: string = $state("");

  constructor({
    page = "",
    additionalParameters = "",
  }: { page?: string; additionalParameters?: string } = {}) {
    this.page = page;
    this.additionalParameters = additionalParameters;
  }

  preprocess(): void {
    preprocessStringParams(this, ["page", "additionalParameters"]);
  }

  static _getWikitext(tname: string, page: string, params: string): string {
    if (params !== "" && !params.startsWith("|")) {
      params = `|${params}`;
    }
    return `{{${tname}|${page}${params}}}`;
  }

  getWikitext(): string {
    return ProducerDiscographySongItem._getWikitext(
      "pwt row",
      this.page,
      this.additionalParameters,
    );
  }

  toJSON(): IProducerDiscographySongItem {
    const { page, additionalParameters } = this;
    const res = {
      page,
      additionalParameters,
    };
    return res;
  }
}