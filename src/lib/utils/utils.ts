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