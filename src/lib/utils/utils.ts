import { COLOURS } from "../../constants/colours";

export const validateColour = (colour: string) => {
  return (
    colour === "" || colour.match(/^#[0-9a-fA-F]{3,6}$/) || Object.keys(COLOURS).includes(colour)
  );
};

export function preprocessStringParams<T>(formData: T, keys: string[]): T {
  for (const key of keys) {
    //@ts-ignore
    if (!formData[key]) {
      // Falsy values include undefined, null, empty strings, false, and 0
      // We want to enforce these as strings
      //@ts-ignore
      formData[key] = "";
    }
    //@ts-ignore
    formData[key] = formData[key].trim();
  }
  return formData;
}

export function detonePinyin(romText: string, bShowUmlaut = false): string {
  romText = romText.replace(/[āáǎà]/gm, "a");
  romText = romText.replace(/[ĀÁǍÀ]/gm, "A");
  romText = romText.replace(/[īíǐì]/gm, "i");
  romText = romText.replace(/[ĪÍǏÌ]/gm, "I");
  romText = romText.replace(/[ūúǔù]/gm, "u");
  romText = romText.replace(/[ŪÚǓÙ]/gm, "U");
  romText = romText.replace(/[ēéěè]/gm, "e");
  romText = romText.replace(/[ĒÉĚÈ]/gm, "E");
  romText = romText.replace(/[ōóǒò]/gm, "o");
  romText = romText.replace(/[ŌÓǑÒ]/gm, "O");
  if (bShowUmlaut) {
    romText = romText.replace(/[ǖǘǚǜ]/gm, "ü");
    romText = romText.replace(/[ǕǗǙǛ]/gm, "Ü");
  } else {
    romText = romText.replace(/[ǖǘǚǜ]/gm, "v");
    romText = romText.replace(/[ǕǗǙǛ]/gm, "V");
  }
  return romText;
}