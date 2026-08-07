import type { CellProperties, HotInstance } from "handsontable";
import { sanitizeHtml } from "../../../utils/utils";

/**
 *
 * @param _hotInstance
 * @param td
 * @param _row
 * @param _col
 * @param _prop
 * @param value
 * @param _cellProperties
 * @returns
 */
export function customStyleRenderer(
  _hotInstance: HotInstance,
  td: HTMLTableCellElement,
  _row: number,
  _col: number,
  _prop: string | number,
  value: unknown,
  _cellProperties: CellProperties,
) {
  td.innerText = ""; // reset
  if (!value) {
    return td;
  }
  const kvPairs = (value as string).matchAll(/([a-zA-Z\-0-9]+)\s*:\s*([^;<>]*)/g);
  for (const [_, k, v] of kvPairs) {
    const span = document.createElement("span");
    span.style.setProperty(k, v);
    span.innerText = v;
    td.append(span, "; ");
  }
  return td;
}

/**
 * Renders lyrics based on
 *
 * @param _hotInstance
 * @param td
 * @param _row
 * @param _col
 * @param _prop
 * @param value
 * @param _cellProperties
 */
export function lyricsRenderer(
  hotInstance: HotInstance,
  td: HTMLTableCellElement,
  row: number,
  _col: number,
  _prop: string | number,
  value: unknown,
  _cellProperties: CellProperties,
) {
  if (value === null) {
    td.innerHTML = "";
    return td;
  }
  const customStyle = hotInstance.getDataAtRowProp(row, "customStyle");
  let c = (value as string).replace(/^[^|{}\n]*?\|/, "");
  // value = (value as string).replace(/<br\s*\/?\s*>/, "\n");
  // value = (value as string).replace(/<ref\s*[^>]*\/>/gi, "*");
  // value = (value as string).replace(/<ref\s*[^>]*>(.*)<\/ref>/gis, "*");
  c = c.replace(/'{3}(.*?)'{3}/g, "<b>$1</b>");
  c = c.replace(/'{2}(.*?)'{2}/g, "<i>$1</i>");
  c = c.replace(
    /\{\{(?:[Tt]emplate|)[Rr]uby\|([^|]*)\|([^}]*)\}\}/g,
    "<ruby>$1 <rp>(</rp><rt>$2</rt><rp>)</rp></ruby>",
  );
  if (customStyle) {
    c = `<span style="${customStyle}">${c}</span>`;
  }
  c = sanitizeHtml(c);
  td.innerHTML = c;
  return td;
}
