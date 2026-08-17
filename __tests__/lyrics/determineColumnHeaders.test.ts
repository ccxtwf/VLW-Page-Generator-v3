import { describe, expect, test } from "vite-plus/test";
import { determineColumnHeaders } from "../../src/lib/utils/lyricsUtils";

describe("determineColumnHeaders", () => {
  test.each([
    {
      d: "Japanese song with translation",
      i: "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}",
      o: ["Japanese", "Romaji", "English"],
    },
    {
      d: "Japanese song without translation",
      i: "{{lyrics toggle|jp:Japanese|rom:Romaji}}",
      o: ["Japanese", "Romaji"],
    },
    {
      d: "Japanese/Chinese song with translation",
      i: "{{lyrics toggle|cn:Japanese/Mandarin|rom:Romaji/Pinyin|eng:English}}",
      o: ["Japanese/Mandarin", "Romaji/Pinyin", "English"],
    },
    {
      d: "Japanese/Chinese song without translation",
      i: "{{lyrics toggle|cn:Japanese/Mandarin|rom:Romaji/Pinyin}}",
      o: ["Japanese/Mandarin", "Romaji/Pinyin"],
    },
    {
      d: "Spanish song with translation",
      i: "{{lyrics toggle|sp:Spanish|eng:English}}",
      o: ["Spanish", "English"],
    },
    {
      d: "Spanish song without translation",
      i: "{{lyrics toggle|sp:Spanish}}",
      o: ["Spanish"],
    },
    {
      d: "English song",
      i: "{{lyrics toggle|eng:English}}",
      o: ["English"],
    },
    {
      d: "Japanese song with translation without semantic IDs",
      i: "{{lyrics toggle|Japanese|Romaji|English}}",
      o: ["Japanese", "Romaji", "English"],
    },
    {
      d: "Columns with more than one :",
      i: "{{lyrics toggle|jp:Japanese:Reversed|rom:Romaji:Reversed|eng:English}}",
      o: ["Japanese:Reversed", "Romaji:Reversed", "English"],
    },
    {
      d: "Japanese song with translation and additional columns",
      i: "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English|eng2:English 2|eng3:English 3}}",
      o: ["Japanese", "Romaji", "English", "English 2", "English 3"],
    },
  ])("$d", ({ i, o }) => {
    expect(determineColumnHeaders(i)).toEqual(o);
  });
});