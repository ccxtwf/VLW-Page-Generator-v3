import { VOCADB_ENTRYPOINT } from "../../config";
import { SYNTHS } from "../../constants";
import { escapeRegExp } from "./utils";

import type { VdbPageType } from "../../schemas/vocadb";
import { InvalidArgumentError } from "../logic/exceptions";

/**
 * Get the VocaDB page ID from the given URL.
 * Also checks the URL against the given page type (Song, Album, Artist)
 *
 * @param url
 * @param mode
 * @returns
 */
export function getVdbPageId(url: string, mode: VdbPageType): string | null {
  // Enforce this restriction during run-time
  if (!mode.match(/^(S|Ar|Al)$/)) {
    throw new InvalidArgumentError();
  }
  const rxVdb = new RegExp(`^\\s*${escapeRegExp(VOCADB_ENTRYPOINT)}${mode}\\/(\\d+)`);
  console.log(rxVdb);
  const tryMatch = rxVdb.exec(url);
  if (tryMatch === null) {
    return null;
  }
  return tryMatch[1];
}

/**
 *
 * @param vdbId
 * @param fallbackName
 * @returns
 */
export async function getVocalistBasedOnVdbId(vdbId: number): Promise<{
  category: string;
  baseName: string;
  engine: number;
} | null> {
  let idx = (SYNTHS.dict as Record<number, number>)[vdbId];
  if (idx) {
    const o = SYNTHS.synths[idx]!;
    return {
      category: o.cat,
      baseName: o.base,
      engine: o.eng,
    };
  }

  return null;
}

// async function fetchSynthsDb(): Promise {}