import modSanitizeHtml from "sanitize-html";
import { COLOURS } from "../../constants";

/**
 *
 * @param colour
 * @returns
 */
export function validateColour(colour: string) {
  return (
    colour === "" || colour.match(/^#[0-9a-fA-F]{3,6}$/) || Object.keys(COLOURS).includes(colour)
  );
}

/**
 *
 * @param dateIsoFormat
 * @returns
 */
export function parseDateAsUtc(dateIsoFormat: string) {
  const d = new Date(dateIsoFormat);
  return `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1).toString().padStart(2, "0")}-${d
    .getUTCDate()
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Replaceable by RegExp.escape(), which is newly baseline.
 *
 * @param text
 * @returns
 */
export function escapeRegExp(text: string) {
  // Source - https://stackoverflow.com/a/9310752
  // Posted by Mathias Bynens, modified by community. See post 'Timeline' for change history
  // Retrieved 2026-07-31, License - CC BY-SA 4.0
  return text.replaceAll(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

/**
 *
 * @param list
 * @returns
 */
export function renderAsCommaSeparatedList(list: string[]): string {
  let res = "";
  if (list.length <= 1) {
    res += list.join("");
  } else {
    res += list.slice(0, -1).join(", ") + " and " + list.at(-1);
  }
  return res;
}

/**
 * For a given Record object, standardize the given fields of the object so that
 * each of the specified fields is trimmed, and have an empty string in place of
 * undefined or null.
 *
 * @param formData
 * @param keys
 * @returns
 */
export function preprocessStringParams<T extends Record<string, any>>(
  formData: T,
  keys: string[],
): T {
  for (const key of keys) {
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

const rxListSeparator = /(,\s*(?!and\b)|,?\s+and\s+|\s+&\s+)/;

/**
 * Render items in a list as MediaWiki internal links
 *
 * e.g. Apple, Bananas, and Coconut -> [[Apple]], [[Bananas]], and [[Coconut]]
 *
 * @param s
 * @returns
 */
export function renderListInWikiInternalLinkMarkup(s: string) {
  let ao = s.split(rxListSeparator);
  s = "";
  for (let ss of ao) {
    if (!ss.match(rxListSeparator) && ss !== "") {
      ss = `[[${ss}]]`;
    }
    s += ss;
  }
  return s;
}

/**
 *
 * @param s
 * @returns
 */
export function sanitizeHtml(s: string) {
  return modSanitizeHtml(s, {
    allowedTags: [
      "b",
      "i",
      "u",
      "br",
      "span",
      "div",
      "p",
      "ul",
      "ol",
      "li",
      "detail",
      "summary",
      "s",
      "small",
      "sub",
      "sup",
      "strong",
      "em",
      "mark",
      "ruby",
      "rp",
      "rt",
      "code",
      "pre",
      "nowiki",
      "ref",
    ],
    allowedAttributes: {
      span: ["style", "class"],
      div: ["style", "class"],
      p: ["style", "class"],
      ref: ["name", "group", "class"],
    },
    selfClosing: ["br", "nowiki", "ref"],
    disallowedTagsMode: "escape",
    allowedSchemes: false,
    allowedSchemesByTag: {},
    allowedSchemesAppliedToAttributes: [],
    allowVulnerableTags: false,
    transformTags: {
      nowiki: "span",
      ref: () => ({
        tagName: "span",
        attribs: {
          class: "ref",
        },
      }),
    },
  });
}
