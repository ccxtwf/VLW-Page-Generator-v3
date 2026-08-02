import { describe, expect, test } from "vitest";
import {
  renderTableCellWikitext,
  renderLyricsRowWikitext,
  generateSingerPartsElement,
} from "../../src/lib/utils/lyricsUtils";
import { LyricRowData } from "../../src/schemas/form";

describe("renderTableCellWikitext", () => {
  test.each([
    { i: "foo bar", o: "|foo bar\n" },
    { i: "-foo bar", o: "|<nowiki>-</nowiki>foo bar\n" },
    { i: "~~~~~~whimsy", o: "|<nowiki>~~~~~~</nowiki>whimsy\n" },
    { i: "<nowiki>~~~</nowiki>whimsy", o: "|<nowiki>~~~</nowiki>whimsy\n" },
    { i: "<nowiki>~~~~~~</nowiki>whimsy", o: "|<nowiki>~~~~~~</nowiki>whimsy\n" },
  ])("wikitext", ({ i, o }) => {
    expect(renderTableCellWikitext(i)).toBe(o);
  });

  test("html", () => {
    expect(
      renderTableCellWikitext(
        '<div style="color: red;">Lorem ipsum dolor sit amet.</div><div style="color: yellow;">It will all be over you know</div>',
      ),
    ).toBe(
      '|<div style="color: red;">Lorem ipsum dolor sit amet.</div><div style="color: yellow;">It will all be over you know</div>\n',
    );
  });
});

describe("renderLyricsRowWikitext", () => {
  test("simple case", () => {
    const lyrics: LyricRowData = {
      customStyle: "",
      original: "ありがとうございます",
      romanized: "Arigatou gozaimasu",
      english: "Thankees",
    };
    const options = {
      needsRomanization: true,
      needsTranslation: true,
      hasTranslation: true,
      showEnglishColumn: true,
    };
    const res = renderLyricsRowWikitext(lyrics, options);
    expect(res).toBe(`|-\n|ありがとうございます\n|Arigatou gozaimasu\n|Thankees\n`);
  });

  test("with styling", () => {
    const lyrics: LyricRowData = {
      customStyle: "color: red;",
      original: "ありがとうございます",
      romanized: "Arigatou gozaimasu",
      english: "Thankees",
    };
    const options = {
      needsRomanization: true,
      needsTranslation: true,
      hasTranslation: true,
      showEnglishColumn: true,
    };
    const res = renderLyricsRowWikitext(lyrics, options);
    expect(res).toBe(
      `|- style="color: red;"\n|ありがとうございます\n|Arigatou gozaimasu\n|Thankees\n`,
    );
  });

  test.each([
    {
      needsRomanization: true,
      needsTranslation: true,
      hasTranslation: true,
      showEnglishColumn: true,
    },
    {
      needsRomanization: true,
      needsTranslation: true,
      hasTranslation: false,
      showEnglishColumn: true,
    },
    {
      needsRomanization: true,
      needsTranslation: false,
      hasTranslation: false,
      showEnglishColumn: false,
    },
    {
      needsRomanization: false,
      needsTranslation: true,
      hasTranslation: true,
      showEnglishColumn: true,
    },
    {
      needsRomanization: false,
      needsTranslation: true,
      hasTranslation: false,
      showEnglishColumn: true,
    },
    {
      needsRomanization: false,
      needsTranslation: true,
      hasTranslation: false,
      showEnglishColumn: false,
    },
    {
      needsRomanization: false,
      needsTranslation: false,
      hasTranslation: false,
      showEnglishColumn: false,
    },
  ])("line break", (options) => {
    const lyrics: LyricRowData = {
      customStyle: "",
      original: "",
      romanized: "",
    };
    expect(renderLyricsRowWikitext(lyrics, options)).toBe(`|-\n|<br />\n`);
  });

  test("not in need of romanization", () => {
    const lyrics: LyricRowData = {
      customStyle: "",
      original: "Ti amo",
      romanized: "",
      english: "I love you",
    };
    const options = {
      needsRomanization: false,
      needsTranslation: true,
      hasTranslation: true,
      showEnglishColumn: true,
    };
    const res = renderLyricsRowWikitext(lyrics, options);
    expect(res).toBe(`|-\n|Ti amo\n|I love you\n`);
  });

  test("not in need of translation", () => {
    const lyrics: LyricRowData = {
      customStyle: "",
      original: "らりらりらほほ",
      romanized: "rarirarirahoho",
    };
    const options = {
      needsRomanization: true,
      needsTranslation: false,
      hasTranslation: false,
      showEnglishColumn: false,
    };
    const res = renderLyricsRowWikitext(lyrics, options);
    expect(res).toBe(`|-\n|らりらりらほほ\n|rarirarirahoho\n`);
  });

  /**
   * This should not be called in this case
   */
  test("English-only lyrics", () => {
    const lyrics: LyricRowData = {
      customStyle: "",
      original: "This is my last resort",
    };
    const options = {
      needsRomanization: false,
      needsTranslation: false,
      hasTranslation: false,
      showEnglishColumn: false,
    };
    const res = renderLyricsRowWikitext(lyrics, options);
    expect(res).toBe(`|-\n| {{shared}} This is my last resort\n`);
  });

  test("without translation (show empty English column)", () => {
    const lyrics: LyricRowData = {
      customStyle: "",
      original: "ありがとうございます",
      romanized: "Arigatou gozaimasu",
    };
    const options = {
      needsRomanization: true,
      needsTranslation: true,
      hasTranslation: false,
      showEnglishColumn: true,
    };
    const res = renderLyricsRowWikitext(lyrics, options);
    expect(res).toBe(`|-\n|ありがとうございます\n|Arigatou gozaimasu\n|\n`);
  });

  test("without translation (hide empty English column)", () => {
    const lyrics: LyricRowData = {
      customStyle: "",
      original: "ありがとうございます",
      romanized: "Arigatou gozaimasu",
    };
    const options = {
      needsRomanization: true,
      needsTranslation: true,
      hasTranslation: false,
      showEnglishColumn: false,
    };
    const res = renderLyricsRowWikitext(lyrics, options);
    expect(res).toBe(`|-\n|ありがとうございます\n|Arigatou gozaimasu\n`);
  });

  test("shared", () => {
    const lyrics: LyricRowData = {
      customStyle: "",
      original: "SHOUT!!",
      romanized: "SHOUT!!",
      english: "SHOUT!!",
    };
    const options = {
      needsRomanization: true,
      needsTranslation: true,
      hasTranslation: true,
      showEnglishColumn: true,
    };
    const res = renderLyricsRowWikitext(lyrics, options);
    expect(res).toBe(`|-\n| {{shared}} SHOUT!!\n`);
  });

  test("shared (not in need of romanization)", () => {
    const lyrics: LyricRowData = {
      customStyle: "",
      original: "SHOUT!!",
      romanized: "",
      english: "SHOUT!!",
    };
    const options = {
      needsRomanization: false,
      needsTranslation: true,
      hasTranslation: true,
      showEnglishColumn: true,
    };
    const res = renderLyricsRowWikitext(lyrics, options);
    expect(res).toBe(`|-\n| {{shared}} SHOUT!!\n`);
  });
});

describe("generateSingerPartsElement", () => {
  test("grey text + normal text", () => {
    const s = new Set<string>(["", "grey"]);
    const res = generateSingerPartsElement(s, "black", "white");
    expect(res).toBe(
      `{| border="1" cellpadding="4" style="border-collapse:collapse; border:1px groove; line-height:1.5"\n!style="background-color:black; color:white;"|Singer\n|<span style="color:grey;">Singer</span>\n|All\n|}\n`,
    );
  });

  test("two colours", () => {
    const s = new Set<string>(["red", "green"]);
    const res = generateSingerPartsElement(s, "black", "white");
    expect(res).toBe(
      `{| border="1" cellpadding="4" style="border-collapse:collapse; border:1px groove; line-height:1.5"\n!style="background-color:black; color:white;"|Singer\n|<span style="color:red;">Singer</span>\n|<span style="color:green;">Singer</span>\n|}\n`,
    );
  });
});
