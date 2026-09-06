import { describe, expect, test } from "vite-plus/test";
import type { ILyricsRow } from "#src/lib/models/schema.d.ts";
import LyricsRow from "#src/lib/models/children/LyricsRow.svelte.ts";

describe("test state management logic for LyricsRow", () => {
  test("toJSON", () => {
    const o: ILyricsRow = {
      customStyle: "color:red;",
      original: "HELLO",
      romanized: "WORLD",
      english: "RADIANT",
      additionalColumns: ["foo"],
    };
    const rw = new LyricsRow(o);
    expect(rw.toJSON()).toMatchObject(o);
  });
});