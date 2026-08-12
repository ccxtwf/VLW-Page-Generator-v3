import sqlite3InitModule from "@sqlite.org/sqlite-wasm";
import type { Database } from "@sqlite.org/sqlite-wasm";
import { getDbBuffer } from "./dbBufferUtils";

let db: Database | null = null;

/**
 * Loads synths.db onto an in-memory database.
 *
 * Note that this sqlite is run on the main thread.
 * Using a web worker may be an avenue you could take, but knowing
 * that the db file is 300 kB at most this is prolly not necessary.
 *
 * @returns
 */
export async function getDb() {
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