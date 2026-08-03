import { preprocessStringParams } from "../../utils/utils";

export default class LyricRow {
  additionalColumns?: string[];

  constructor(
    public customStyle: string,
    public original: string,
    public romanized?: string,
    public english?: string,
    additionalColumns?: string[],
  ) {
    this.additionalColumns = additionalColumns || [];
  }

  static createDefault(): LyricRow {
    return new LyricRow("", "", "", "");
  }

  preprocess(): void {
    preprocessStringParams(this, ["customStyle", "original", "romanized", "english"]);
    // Elements in additionalColumns may possibly be undefined at the time of handling
  }
}
