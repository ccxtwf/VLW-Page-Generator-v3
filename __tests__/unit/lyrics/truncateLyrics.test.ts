import { describe, expect, test } from "vite-plus/test";
import { truncateLyrics } from "#src/lib/utils/lyricsUtils.ts";

describe("truncateLyrics", () => {
  test.each([
    {
      d: "Empty state",
      i: [
        { customStyle: "", original: "", romanized: "", english: "" },
        { customStyle: "", original: "", romanized: "", english: "" },
        { customStyle: "", original: "", romanized: "", english: "" },
      ],
      o: [],
    },
    {
      d: "Only keep one line",
      i: [
        { customStyle: "", original: "foo", romanized: "bar", english: "baz" },
        { customStyle: "", original: "", romanized: "", english: "" },
        { customStyle: "", original: "", romanized: "", english: "" },
      ],
      o: [{ customStyle: "", original: "foo", romanized: "bar", english: "baz" }],
    },
    {
      d: "Only one line is given",
      i: [{ customStyle: "", original: "foo", romanized: "bar", english: "baz" }],
      o: [{ customStyle: "", original: "foo", romanized: "bar", english: "baz" }],
    },
    {
      d: "Truncate at index (without line break)",
      i: [
        { customStyle: "", original: "foo", romanized: "bar", english: "baz" },
        { customStyle: "", original: "bar", romanized: "baz", english: "foo" },
        { customStyle: "", original: "", romanized: "", english: "" },
      ],
      o: [
        { customStyle: "", original: "foo", romanized: "bar", english: "baz" },
        { customStyle: "", original: "bar", romanized: "baz", english: "foo" },
      ],
    },
    {
      d: "Truncate at index (with line break)",
      i: [
        { customStyle: "", original: "foo", romanized: "bar", english: "baz" },
        { customStyle: "", original: "", romanized: "", english: "" },
        { customStyle: "", original: "bar", romanized: "baz", english: "foo" },
        { customStyle: "", original: "", romanized: "", english: "" },
        { customStyle: "", original: "", romanized: "", english: "" },
        { customStyle: "", original: "", romanized: "", english: "" },
      ],
      o: [
        { customStyle: "", original: "foo", romanized: "bar", english: "baz" },
        { customStyle: "", original: "", romanized: "", english: "" },
        { customStyle: "", original: "bar", romanized: "baz", english: "foo" },
      ],
    },
    {
      d: "Expect to not truncate",
      i: [
        { customStyle: "", original: "foo", romanized: "bar", english: "baz" },
        { customStyle: "", original: "", romanized: "", english: "" },
        { customStyle: "", original: "", romanized: "", english: "" },
        { customStyle: "", original: "bar", romanized: "baz", english: "foo" },
      ],
      o: [
        { customStyle: "", original: "foo", romanized: "bar", english: "baz" },
        { customStyle: "", original: "", romanized: "", english: "" },
        { customStyle: "", original: "", romanized: "", english: "" },
        { customStyle: "", original: "bar", romanized: "baz", english: "foo" },
      ],
    },
  ])("$d", ({ i, o }) => {
    expect(truncateLyrics(i)).toEqual(o);
  });
});