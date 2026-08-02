import { type CellProperties, type HotInstance } from "handsontable";
import type { PredefinedMenuItemKey } from "handsontable/plugins/contextMenu";
import { VOCALOID_LYRICS_WIKI_ARTICLE_ENTRYPOINT } from "../../../config";

import {
  convertAvidToBvId,
  convertTwitterLink,
  isValidUrl,
  standardizeYoutubeLink,
  upgradeInsecureHttpLink,
} from "../../utils/urlUtils";
import { PV_SERVICE_PROVIDER } from "../../../constants";

/**
 * Cast a column data type as a trimmed string.
 *
 * @param v
 * @returns
 */
export function stringValueFormatter(v: unknown): string {
  return ("" + v).trim();
}

/**
 * Renders a HotTable table cell as an external link.
 *
 * Example:
 * `https://example.com` -> [https://example.com](https://example.com)
 *
 * @param instance
 * @param td
 * @param row
 * @param col
 * @param prop
 * @param value
 * @param cellProperties
 * @returns
 */
export function urlRenderer(
  hotInstance: HotInstance,
  td: HTMLTableCellElement,
  row: number,
  col: number,
  prop: string | number,
  value: unknown,
  cellProperties: CellProperties,
): HTMLTableCellElement {
  let v = (value = value as unknown as string); // cast as string
  if (!v) {
    return td;
  }
  if (isValidUrl(v)) {
    td.innerHTML = renderAsAnchorElement({ url: v }).outerHTML;
  }
  return td;
}

/**
 * Renders a HotTable table cell as a link to the live wiki.
 *
 * Example:
 * `Some page` -> [Some page](https://vocaloidlyrics.miraheze.org/wiki/Some_page)
 *
 * @param instance
 * @param td
 * @param row
 * @param col
 * @param prop
 * @param value
 * @param cellProperties
 * @returns
 */
export function vlwUrlPageRenderer(
  hotInstance: HotInstance,
  td: HTMLTableCellElement,
  row: number,
  col: number,
  prop: string | number,
  value: unknown,
  cellProperties: CellProperties,
): HTMLTableCellElement {
  let v = (value = value as unknown as string); // cast as string
  if (!v) {
    return td;
  }
  let url = `${VOCALOID_LYRICS_WIKI_ARTICLE_ENTRYPOINT}${encodeURIComponent(v)}`;
  td.innerHTML = renderAsAnchorElement({ url, caption: v }).outerHTML;
  return td;
}

/**
 * Renders a HotTable table cell as an internal link to the live wiki.
 *
 * Example:
 * `[[Some page]]` -> [&lbrack;&lbrack;Some page&rbrack;&rbrack;](https://vocaloidlyrics.miraheze.org/wiki/Some_page)
 *
 * @param hotInstance
 * @param td
 * @param row
 * @param col
 * @param prop
 * @param value
 * @param cellProperties
 * @returns
 */
export function vlwInternalLinkRenderer(
  hotInstance: HotInstance,
  td: HTMLTableCellElement,
  row: number,
  col: number,
  prop: string | number,
  value: unknown,
  cellProperties: CellProperties,
) {
  let v = (value = value as unknown as string); // cast as string
  if (!v) {
    return td;
  }
  const m = v.match(
    /^(?:\[\[(?!fandom:|wikia:|mh:|m:|meta:|metawiki:|commons:|w:))(?:([^|]*)(?:|\|.*))\]\]$/i,
  );
  if (m) {
    let url = `${VOCALOID_LYRICS_WIKI_ARTICLE_ENTRYPOINT}${encodeURIComponent(m.groups![1])}`;
    td.innerHTML = renderAsAnchorElement({ url, caption: v }).outerHTML;
  }
  return td;
}

/**
 * Safe way of rendering an element as an anchor link
 *
 * @param url
 * @param caption
 * @param rel
 * @param target
 * @returns
 */
function renderAsAnchorElement({
  url,
  caption,
  rel = "noopener noreferrer",
  target = "_blank",
}: {
  url: string;
  caption?: string;
  rel?: string;
  target?: string;
}): HTMLAnchorElement {
  const node = document.createElement("a");
  node.text = caption || url;
  node.setAttribute("href", url);
  node.setAttribute("rel", rel);
  node.setAttribute("target", target);
  return node;
}

/**
 * Shared context menu for various Handsontable elements
 */
export const sharedContextMenuOptions: PredefinedMenuItemKey[] = [
  "copy",
  "cut",
  "---------",
  "undo",
  "redo",
  "---------",
  "row_above",
  "row_below",
  "remove_row",
  "clear_column",
];

/**
 * Automatically process an inserted link.
 *
 * @param s
 * @param referUrl
 * @param options
 * @returns
 */
export function processInsertedLink(
  s: string,
  referUrl: { site?: string },
  { bilibili = true }: { bilibili?: boolean } = {},
) {
  if (referUrl.site === PV_SERVICE_PROVIDER.youtube) {
    s = standardizeYoutubeLink(s);
  }
  if (referUrl.site === PV_SERVICE_PROVIDER.xitter) {
    s = convertTwitterLink(s);
  }
  if (bilibili && referUrl.site === PV_SERVICE_PROVIDER.bilibili) {
    s = convertAvidToBvId(s);
  }
  if ((Object.values(PV_SERVICE_PROVIDER) as string[]).includes(referUrl.site || "")) {
    s = upgradeInsecureHttpLink(s);
  }
  return s;
}