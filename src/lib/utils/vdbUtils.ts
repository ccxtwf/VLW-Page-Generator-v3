import sqlite3InitModule from "@sqlite.org/sqlite-wasm";
import type { Database } from "@sqlite.org/sqlite-wasm";

import { VOCADB_ENTRYPOINT } from "../../config";
import { SYNTHS } from "../../constants";
import { escapeRegExp } from "./utils";

import { VdbArtistRole, VdbPvService, type VdbPageType } from "../../schemas/vocadb.d";
import { InvalidArgumentError } from "../logic/exceptions";

let db: Database | null = null;

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
  const rxVdb = new RegExp(`^${escapeRegExp(VOCADB_ENTRYPOINT)}${mode}\\/(\\d+)`);
  const tryMatch = rxVdb.exec(url.trim());
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
  // From ready cache
  let idx = (SYNTHS.dict as Record<number, number>)[vdbId];
  if (idx) {
    const o = SYNTHS.synths[idx]!;
    return {
      category: o.cat,
      baseName: o.base,
      engine: o.eng,
    };
  }

  // From synths.db
  try {
    const _db = await getDb();
    const vb = _db.selectObject(
      "SELECT wikicat_name, basevb_name, engine_id FROM synths WHERE vdb_id = ? ;",
      [vdbId],
    );
    if (vb) {
      return {
        category: vb.wikicat_name!.toString(),
        baseName: vb.basevb_name!.toString(),
        engine: vb.engine_id! as number,
      };
    }
  } catch (err) {
    console.error("Failed to fetch data from synths.db");
    console.error(err);
  }

  return null;
}

const __dictConvertArtistRole = {
  [VdbArtistRole.default]: "music, lyrics",
  [VdbArtistRole.composer]: "music",
  [VdbArtistRole.lyricist]: "lyrics",
  [VdbArtistRole.arranger]: "arrangement",
  [VdbArtistRole.mixer]: "mix",
  [VdbArtistRole.mastering]: "mastering",
  [VdbArtistRole.voicemanipulator]: "tuning",
  [VdbArtistRole.instrumentalist]: "instruments",
  [VdbArtistRole.illustrator]: "illustration",
  [VdbArtistRole.animator]: "PV",
  [VdbArtistRole.encoder]: "encoding",
  [VdbArtistRole.vocalist]: "vocalist",
  [VdbArtistRole.chorus]: "chorus",
  [VdbArtistRole.other]: "other",
  [VdbArtistRole.distributor]: "publisher",
  [VdbArtistRole.publisher]: "publisher",
};

const __dictConvertPvServiceName = {
  [VdbPvService.yt]: "YouTube",
  [VdbPvService.nnd]: "Niconico",
  [VdbPvService.bb]: "bilibili",
  [VdbPvService.pp]: "piapro",
  [VdbPvService.sc]: "SoundCloud",
  [VdbPvService.bc]: "Bandcamp",
  [VdbPvService.vm]: "Vimeo",
};

/**
 *
 * @param role
 * @returns
 */
export function convertArtistRole(role: VdbArtistRole): string | null {
  return (__dictConvertArtistRole as Record<VdbArtistRole, string>)[role] || null;
}

/**
 *
 * @param service
 * @returns
 */
export function convertPvService(service: VdbPvService): string | null {
  return (__dictConvertPvServiceName as Record<VdbPvService, string>)[service] || null;
}

/**
 *
 * @returns
 */
async function getDbBuffer(): Promise<ArrayBuffer> {
  const res = await fetch("/synths.db");
  if (!res.ok) {
    throw new Error(`Got unexpected response from server: ${res.status} ${res.statusText}`);
  }
  const buffer = await res.arrayBuffer();
  return buffer;
}

/**
 * Loads synths.db onto an in-memory database.
 *
 * Note that this sqlite is run on the main thread.
 * Using a web worker may be an avenue you could take, but knowing
 * that the db file is 300 kB at most this is prolly not necessary.
 *
 * @returns
 */
async function getDb() {
  if (db) {
    return db;
  }

  const [sqlite3, buffer] = await Promise.all([sqlite3InitModule(), getDbBuffer()]);

  const bytes = new Uint8Array(buffer);
  const p = sqlite3.wasm.allocFromTypedArray(bytes);
  const _db = new sqlite3.oo1.DB();

  const rc = sqlite3.capi.sqlite3_deserialize(
    _db.pointer!,
    "main",
    p,
    bytes.length,
    bytes.length,
    sqlite3.capi.SQLITE_DESERIALIZE_FREEONCLOSE | sqlite3.capi.SQLITE_DESERIALIZE_RESIZEABLE,
  );
  _db.checkRc(rc);
  db = _db; // Finally save the database to be fetched on the ready
  return db;
}