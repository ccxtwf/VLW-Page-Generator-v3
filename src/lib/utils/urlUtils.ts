import { PV_SERVICE_PROVIDER, RECOGNIZED_LINKS } from "../../constants";
import { escapeRegExp } from "./utils";

/**
 *
 * @param url
 */
export function isValidUrl(url: string): boolean {
  return /^https?:\/\/[^ ]$/.test(url);
}

/**
 * Convert a bilibili service URL from legacy av format to new Bv format
 *
 * @param url
 * @returns
 */
export function convertAvidToBvId(url: string): string {
  let id: string | RegExpMatchArray | null = url.match(
    /^https?:\/\/www\.bilibili\.com\/video\/av(\d+)/,
  );
  if (id === null) {
    return url;
  }
  id = id[1];
  const XOR_CODE = 23442827791579n;
  const MAX_AID = 1n << 51n;
  const BASE = 58n;
  const data = "FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf";
  const bytes = ["B", "V", "1", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
  let bvIndex = bytes.length - 1;
  let tmp = (MAX_AID | BigInt(id)) ^ XOR_CODE;
  while (tmp > 0) {
    bytes[bvIndex] = data[Number(tmp % BigInt(BASE))];
    tmp = tmp / BASE;
    bvIndex -= 1;
  }
  [bytes[3], bytes[9]] = [bytes[9], bytes[3]];
  [bytes[4], bytes[7]] = [bytes[7], bytes[4]];
  return `https://www.bilibili.com/video/${bytes.join("")}`;
}

/**
 * Standardize a given YouTube domain, while also removing data tracking URL
 * fragments and other query parameters
 *
 * @param url
 * @returns
 */
export function standardizeYoutubeLink(url: string) {
  const matchDomain = /^https?:\/\/(?:(?:www\.|)youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/;
  const m = url.match(matchDomain);
  if (m === null) return url;
  return `https://www.youtube.com/watch?v=${m[1]}`;
}

/**
 * Use HTTPS over insecure HTTP
 *
 * @param url
 * @returns
 */
export function upgradeInsecureHttpLink(url: string) {
  return url.replace(/^http:\/\//, "https://");
}

/**
 * Convert a given Twitter link (now X)
 *
 * @param url
 * @returns
 */
export function convertTwitterLink(url: string) {
  const matchDomain = /^https?:\/\/(?:www\.|)twitter\.com\/(.*)$/;
  const m = url.match(matchDomain);
  if (m === null) return url;
  return `https://x.com/${m[1]}`;
}

/**
 *
 * @param url
 * @param articlePath
 */
export function getOtherMediaWikiPageName(url: string, articlePath: string): string | null {
  const rx = new RegExp(`${escapeRegExp(articlePath)}([^?]+)`);
  const m = rx.exec(url);
  if (!m || !m.groups) {
    return null;
  }
  return m.groups[1];
}

/**
 * A wrapper function to process external links that were fetched from VocaDB
 *
 * @param url
 * @returns
 */
export function processExternalLinkFromVocaDb(url: string) {
  const referUrl = RECOGNIZED_LINKS.find(({ re }) => {
    return url.match(re) !== null;
  });
  if (referUrl) {
    if (referUrl.site === PV_SERVICE_PROVIDER.xitter) {
      url = convertTwitterLink(url);
    }
    if (referUrl.site === PV_SERVICE_PROVIDER.youtube) {
      url = standardizeYoutubeLink(url);
    }
    if (referUrl.site === PV_SERVICE_PROVIDER.bilibili) {
      url = convertAvidToBvId(url);
    }
    if ((Object.values(PV_SERVICE_PROVIDER) as string[]).includes(referUrl.site || "")) {
      url = upgradeInsecureHttpLink(url);
    }
  }
  return url;
}