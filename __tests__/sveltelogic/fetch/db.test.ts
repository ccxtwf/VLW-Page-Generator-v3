import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getDbBuffer } from "#src/lib/utils/dbBufferUtils.ts";
import { getDb } from "#src/lib/utils/dbUtils.ts";
import { getVocalistBasedOnVdbId } from "#src/lib/utils/vdbUtils.ts";

// Mock import
vi.mock("#src/lib/utils/dbBufferUtils.ts", async () => {
  return {
    getDbBuffer: vi.fn().mockImplementation(async () => {
      const dbFile = readFileSync(resolve(__dirname, "../../../public/synths.db"));
      const arrayBuffer = dbFile.buffer.slice(
        dbFile.byteOffset,
        dbFile.byteOffset + dbFile.byteLength,
      );
      return arrayBuffer;
    }),
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

declare const __dirname: string;

describe("dbUtils", () => {
  test("should successfully load synths.db", async () => {
    const db = await getDb();
    expect(db).toBeTruthy();
    expect(getDbBuffer).toHaveBeenCalled();
  });

  test("should successfully query synths.db", async () => {
    const vdbId = 43295;
    const res = await getVocalistBasedOnVdbId(vdbId);
    expect(res).toEqual({
      category: "Dongfang Zhizi (UTAU)",
      baseName: "Dongfang Zhizi",
      engine: 2,
    });
  });

  test("should return null when a match is not found", async () => {
    const vdbId = 28;
    const res = await getVocalistBasedOnVdbId(vdbId);
    expect(res).toBeNull();
  });
});