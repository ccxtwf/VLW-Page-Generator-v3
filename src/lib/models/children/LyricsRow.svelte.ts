import { preprocessStringParams } from "../../utils/utils";
import type { ILyricsRow } from "../schema";

export default class LyricRow implements ILyricsRow {
  customStyle: string = $state("");
  original: string = $state("");
  romanized?: string = $state("");
  english?: string = $state("");
  additionalColumns?: string[] = $state([]);

  constructor({
    customStyle = "",
    original = "",
    romanized = "",
    english = "",
    additionalColumns = [],
  }: {
    customStyle?: string;
    original?: string;
    romanized?: string;
    english?: string;
    additionalColumns?: string[];
  } = {}) {
    this.customStyle = customStyle;
    this.original = original;
    this.romanized = romanized;
    this.english = english;
    this.additionalColumns = additionalColumns;
  }

  preprocess(): void {
    preprocessStringParams(this, ["customStyle", "original", "romanized", "english"]);
    // Elements in additionalColumns may possibly be undefined at the time of handling
  }

  toJSON(): ILyricsRow {
    const { customStyle, original, romanized, english, additionalColumns } = this;
    return {
      customStyle,
      original,
      romanized,
      english,
      additionalColumns,
    };
  }
}
