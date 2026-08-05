import { describe, expect, test } from "vitest";
import { generateLyricsToggle } from "../../src/lib/utils/lyricsUtils";

describe("generateLyricsToggle", () => {
  test("Toggle for Japanese-only songs - show English", () => {
    const toggle = generateLyricsToggle(["Japanese", "Romaji", "English"], true, true, "ja");
    expect(toggle).toBe("{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}");
  });

  test("Toggle for Japanese-only songs - hide English", () => {
    const toggle = generateLyricsToggle(["Japanese", "Romaji", "English"], true, false, "ja");
    expect(toggle).toBe("{{lyrics toggle|jp:Japanese|rom:Romaji}}");
  });

  test("Toggle for Mandarin-only songs - show English", () => {
    const toggle = generateLyricsToggle(["Mandarin", "Pinyin", "English"], true, true, "zh-Hans");
    expect(toggle).toBe("{{lyrics toggle|cn:Mandarin|py:Pinyin|eng:English}}");
  });

  test("Toggle for Mandarin-only songs - hide English", () => {
    const toggle = generateLyricsToggle(["Mandarin", "Pinyin", "English"], true, false, "zh-Hans");
    expect(toggle).toBe("{{lyrics toggle|cn:Mandarin|py:Pinyin}}");
  });

  test("Toggle for Spanish-only songs - show English", () => {
    const toggle = generateLyricsToggle(["Spanish", "", "English"], false, true, "es");
    expect(toggle).toBe("{{lyrics toggle|sp:Spanish|eng:English}}");
  });

  test("Toggle for Spanish-only songs - hide English", () => {
    const toggle = generateLyricsToggle(["Spanish", "", "English"], false, false, "es");
    expect(toggle).toBe("{{lyrics toggle|sp:Spanish}}");
  });

  test("Toggle for Japanese & Chinese songs - show English", () => {
    const toggle = generateLyricsToggle(
      ["Japanese/Mandarin", "Romaji/Pinyin", "English"],
      true,
      true,
      "ja",
    );
    expect(toggle).toBe(
      "{{lyrics toggle|org:Japanese/Mandarin|rom:Romaji/Pinyin|eng:English|iso-lang=ja}}",
    );
  });

  test("Toggle for Japanese-only songs - custom ISO language code", () => {
    const toggle = generateLyricsToggle(
      ["Japanese/Mandarin", "Romaji/Pinyin", "English"],
      true,
      true,
      "qqx",
    );
    expect(toggle).toBe(
      "{{lyrics toggle|org:Japanese/Mandarin|rom:Romaji/Pinyin|eng:English|iso-lang=qqx}}",
    );
  });
});
