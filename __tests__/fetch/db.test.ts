import { afterEach, describe, expect, test, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getDbBuffer } from "../../src/lib/utils/dbBufferUtils";
import { getDb } from "../../src/lib/utils/dbUtils";
import { getVocalistBasedOnVdbId } from "../../src/lib/utils/vdbUtils";

// Mock import
vi.mock("../../src/lib/utils/dbBufferUtils", async () => {
  return {
    getDbBuffer: vi.fn().mockImplementation(async () => {
      const dbFile = readFileSync(resolve(__dirname, "../../public/synths.db"));
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
});
