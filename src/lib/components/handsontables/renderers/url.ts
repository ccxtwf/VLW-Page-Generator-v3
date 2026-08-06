import { type CellProperties, type HotInstance } from "handsontable";
import { VOCALOID_LYRICS_WIKI_ARTICLE_ENTRYPOINT } from "../../../../config";

import { isValidUrl } from "../../../utils/urlUtils";
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
  _hotInstance: HotInstance,
  td: HTMLTableCellElement,
  _row: number,
  _col: number,
  _prop: string | number,
  value: unknown,
  _cellProperties: CellProperties,
): HTMLTableCellElement {
  let v = (value = value as unknown as string); // cast as string
  if (v && isValidUrl(v)) {
    td.innerHTML = renderAsAnchorElement({ url: v }).outerHTML;
  } else {
    td.innerText = v || "";
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
  _hotInstance: HotInstance,
  td: HTMLTableCellElement,
  _row: number,
  _col: number,
  _prop: string | number,
  value: unknown,
  _cellProperties: CellProperties,
): HTMLTableCellElement {
  let v = (value = value as unknown as string); // cast as string
  if (!v) {
    td.innerText = "";
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
  _hotInstance: HotInstance,
  td: HTMLTableCellElement,
  _row: number,
  _col: number,
  _prop: string | number,
  value: unknown,
  _cellProperties: CellProperties,
) {
  let v = (value = value as unknown as string); // cast as string
  if (!v) {
    td.innerText = "";
    return td;
  }
  const m = v.match(
    /^(?:\[\[(?!fandom:|wikia:|mh:|m:|meta:|metawiki:|commons:|w:))(?:([^|]*)(?:|\|.*))\]\]$/i,
  );
  if (m) {
    let url = `${VOCALOID_LYRICS_WIKI_ARTICLE_ENTRYPOINT}${encodeURIComponent(m.groups![1])}`;
    td.innerHTML = renderAsAnchorElement({ url, caption: v }).outerHTML;
  } else {
    td.innerText = v;
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
