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

/**
 *
 * @param romText
 * @param showUmlaut
 * @returns
 */
export function detonePinyin(romText: string, showUmlaut = false): string {
  const a1 = "āáǎàīíǐìūúǔùēéěèōóǒòĀÁǍÀĪÍǏÌŪÚǓÙĒÉĚÈŌÓǑÒ";
  const a2 = "aaaaiiiiuuuueeeeooooAAAAIIIIUUUUEEEEOOOO";
  const b1 = "ǖǘǚǜ";
  const b2 = "ǕǗǙǛ";

  const dictConversion = Object.fromEntries(
    Array.from(a1).map((from, index) => {
      return [from, a2[index]];
    }),
  );
  for (let i = 0; i < b1.length; i++) {
    dictConversion[b1[i]] = showUmlaut ? "ü" : "v";
  }
  for (let i = 0; i < b2.length; i++) {
    dictConversion[b2[i]] = showUmlaut ? "Ü" : "V";
  }

  const rx = new RegExp(`[${a1}${b1}${b2}]`, "g");
  romText = romText.replaceAll(rx, (m) => dictConversion[m]);
  return romText;
}