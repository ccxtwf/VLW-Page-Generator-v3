import { describe, expect, test } from "vite-plus/test";
import { generateLyricsSegment } from "../../src/lib/utils/lyricsUtils";
import type { ILyricsRow } from "../../src/lib/models/schema.d";

describe("generateLyricsSegment - English columns", () => {
  test("Japanese song with fanmade translation", () => {
    const lyrics: ILyricsRow[] = [
      { customStyle: "", original: "あいうえお", romanized: "aiueo", english: "ABCDEFG" },
      { customStyle: "", original: "かきくけこ", romanized: "kakikukeko", english: "HIJKLMN" },
    ];
    const options = {
      headers: ["Japanese", "Romaji", "English"],
      needsRomanization: true,
      needsTranslation: true,
      isoLangCode: "ja",
      translator: "John Doe",
      isOfficialTranslation: false,
      bgColour: "black",
      fgColour: "white",
    };
    const res = generateLyricsSegment(lyrics, options);

    const expectedLyricsToggle = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}`;
    const expectedLyricsTable = `{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|ABCDEFG
|-
|かきくけこ
|kakikukeko
|HIJKLMN
|}`;
    const expected = `${expectedLyricsToggle}
${expectedLyricsTable}
{{Translator|John Doe}}`;
    expect(res).toBe(expected);
  });

  test("Japanese song with translation by anonymous", () => {
    const lyrics: ILyricsRow[] = [
      { customStyle: "", original: "あいうえお", romanized: "aiueo", english: "ABCDEFG" },
      { customStyle: "", original: "かきくけこ", romanized: "kakikukeko", english: "HIJKLMN" },
    ];
    const options = {
      headers: ["Japanese", "Romaji", "English"],
      needsRomanization: true,
      needsTranslation: true,
      isoLangCode: "ja",
      translator: "",
      isOfficialTranslation: false,
      bgColour: "black",
      fgColour: "white",
    };
    const res = generateLyricsSegment(lyrics, options);

    const expectedLyricsToggle = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}`;
    const expectedLyricsTable = `{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|ABCDEFG
|-
|かきくけこ
|kakikukeko
|HIJKLMN
|}`;
    const expected = `${expectedLyricsToggle}
${expectedLyricsTable}
{{Translator|Anonymous}}`;
    expect(res).toBe(expected);
  });

  test("Japanese song with official translation", () => {
    const lyrics: ILyricsRow[] = [
      { customStyle: "", original: "あいうえお", romanized: "aiueo", english: "ABCDEFG" },
      { customStyle: "", original: "かきくけこ", romanized: "kakikukeko", english: "HIJKLMN" },
    ];
    const options = {
      headers: ["Japanese", "Romaji", "English"],
      needsRomanization: true,
      needsTranslation: true,
      isoLangCode: "ja",
      translator: "John Doe",
      isOfficialTranslation: true,
      bgColour: "black",
      fgColour: "white",
    };
    const res = generateLyricsSegment(lyrics, options);

    const expectedLyricsToggle = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}`;
    const expectedNotifications = `{{OfficialEnglishNotify}}`;
    const expectedLyricsTable = `{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|ABCDEFG
|-
|かきくけこ
|kakikukeko
|HIJKLMN
|}`;
    const expected = `${expectedLyricsToggle}
${expectedNotifications}
${expectedLyricsTable}
{{Translator|John Doe}}`;
    expect(res).toBe(expected);
  });

  test("Japanese song with official translation by anonymous", () => {
    const lyrics: ILyricsRow[] = [
      { customStyle: "", original: "あいうえお", romanized: "aiueo", english: "ABCDEFG" },
      { customStyle: "", original: "かきくけこ", romanized: "kakikukeko", english: "HIJKLMN" },
    ];
    const options = {
      headers: ["Japanese", "Romaji", "English"],
      needsRomanization: true,
      needsTranslation: true,
      isoLangCode: "ja",
      translator: "",
      isOfficialTranslation: true,
      bgColour: "black",
      fgColour: "white",
    };
    const res = generateLyricsSegment(lyrics, options);

    const expectedLyricsToggle = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}`;
    const expectedNotifications = `{{OfficialEnglishNotify}}`;
    const expectedLyricsTable = `{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|ABCDEFG
|-
|かきくけこ
|kakikukeko
|HIJKLMN
|}`;
    const expected = `${expectedLyricsToggle}
${expectedNotifications}
${expectedLyricsTable}`;
    expect(res).toBe(expected);
  });

  test("Japanese song with no translation (column is hidden)", () => {
    const lyrics: ILyricsRow[] = [
      { customStyle: "", original: "あいうえお", romanized: "aiueo" },
      { customStyle: "", original: "かきくけこ", romanized: "kakikukeko" },
    ];
    const options = {
      headers: ["Japanese", "Romaji", "English"],
      needsRomanization: true,
      needsTranslation: true,
      isoLangCode: "ja",
      bgColour: "black",
      fgColour: "white",
    };
    const res = generateLyricsSegment(lyrics, options);

    const expectedLyricsToggle = `{{lyrics toggle|jp:Japanese|rom:Romaji}}`;
    const expectedLyricsTable = `{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|-
|かきくけこ
|kakikukeko
|}`;
    const expected = `${expectedLyricsToggle}
${expectedLyricsTable}`;
    expect(res).toBe(expected);
  });

  test("Japanese song with no translation (but with a translator added in error)", () => {
    const lyrics: ILyricsRow[] = [
      { customStyle: "", original: "あいうえお", romanized: "aiueo" },
      { customStyle: "", original: "かきくけこ", romanized: "kakikukeko" },
    ];
    const options = {
      headers: ["Japanese", "Romaji", "English"],
      needsRomanization: true,
      needsTranslation: true,
      isoLangCode: "ja",
      translator: "John Doe",
      bgColour: "black",
      fgColour: "white",
    };
    const res = generateLyricsSegment(lyrics, options);

    const expectedLyricsToggle = `{{lyrics toggle|jp:Japanese|rom:Romaji}}`;
    const expectedLyricsTable = `{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|-
|かきくけこ
|kakikukeko
|}`;
    const expected = `${expectedLyricsToggle}
${expectedLyricsTable}`;
    expect(res).toBe(expected);
  });

  test("Japanese song with no translation (column is shown)", () => {
    const lyrics: ILyricsRow[] = [
      { customStyle: "", original: "あいうえお", romanized: "aiueo" },
      { customStyle: "", original: "かきくけこ", romanized: "kakikukeko" },
    ];
    const options = {
      headers: ["Japanese", "Romaji", "English"],
      needsRomanization: true,
      needsTranslation: true,
      showEnglishColumn: true,
      isoLangCode: "ja",
      bgColour: "black",
      fgColour: "white",
    };
    const res = generateLyricsSegment(lyrics, options);

    const expectedLyricsToggle = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}`;
    const expectedLyricsTable = `{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|
|-
|かきくけこ
|kakikukeko
|
|}`;
    const expected = `${expectedLyricsToggle}
${expectedLyricsTable}`;
    expect(res).toBe(expected);
  });

  test("Japanese song with translation notes", () => {
    const lyrics: ILyricsRow[] = [
      {
        customStyle: "",
        original: "あいうえお",
        romanized: "aiueo",
        english: "ABCDEFG<ref>This is a song about Japanese syllabaries</ref>",
      },
      { customStyle: "", original: "かきくけこ", romanized: "kakikukeko", english: "HIJKLMN" },
    ];
    const options = {
      headers: ["Japanese", "Romaji", "English"],
      needsRomanization: true,
      needsTranslation: true,
      isoLangCode: "ja",
      translator: "John Doe",
      isOfficialTranslation: false,
      bgColour: "black",
      fgColour: "white",
    };
    const res = generateLyricsSegment(lyrics, options);

    const expectedLyricsToggle = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}`;
    const expectedLyricsTable = `{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|ABCDEFG<ref>This is a song about Japanese syllabaries</ref>
|-
|かきくけこ
|kakikukeko
|HIJKLMN
|}`;
    const expected = `${expectedLyricsToggle}
${expectedLyricsTable}
{{Translator|John Doe}}

==Translation Notes==
{{Reflist}}`;
    expect(res).toBe(expected);
  });

  test("Japanese song by a translator with a license", () => {
    const lyrics: ILyricsRow[] = [
      { customStyle: "", original: "あいうえお", romanized: "aiueo", english: "ABCDEFG" },
      { customStyle: "", original: "かきくけこ", romanized: "kakikukeko", english: "HIJKLMN" },
    ];
    const options = {
      headers: ["Japanese", "Romaji", "English"],
      needsRomanization: true,
      needsTranslation: true,
      isoLangCode: "ja",
      translator: "CoolMikeHatsune22",
      isOfficialTranslation: false,
      bgColour: "black",
      fgColour: "white",
    };
    const res = generateLyricsSegment(lyrics, options);

    const expectedLyricsToggle = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}`;
    const expectedTranslatorLicense = `{{TranslatorLicense|CoolMikeHatsune22}}`;
    const expectedLyricsTable = `{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|ABCDEFG
|-
|かきくけこ
|kakikukeko
|HIJKLMN
|}`;
    const expected = `${expectedLyricsToggle}
${expectedTranslatorLicense}
${expectedLyricsTable}
{{Translator|CoolMikeHatsune22}}`;
    expect(res).toBe(expected);
  });

  test("Indonesian song with fanmade translation", () => {
    const lyrics: ILyricsRow[] = [
      { customStyle: "", original: "Bengawan Solo", english: "Solo River" },
      {
        customStyle: "",
        original: "Riwayatmu ini sedari dulu jadi",
        english: "As of now, your fate has",
      },
    ];
    const options = {
      headers: ["Indonesian", "", "English"],
      needsRomanization: false,
      needsTranslation: true,
      isoLangCode: "id",
      translator: "John Doe",
      isOfficialTranslation: false,
      bgColour: "black",
      fgColour: "white",
    };
    const res = generateLyricsSegment(lyrics, options);

    const expectedLyricsToggle = `{{lyrics toggle|id:Indonesian|eng:English}}`;
    const expectedLyricsTable = `{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|Bengawan Solo
|Solo River
|-
|Riwayatmu ini sedari dulu jadi
|As of now, your fate has
|}`;
    const expected = `${expectedLyricsToggle}
${expectedLyricsTable}
{{Translator|John Doe}}`;
    expect(res).toBe(expected);
  });

  test("Indonesian song with no translation", () => {
    const lyrics: ILyricsRow[] = [
      { customStyle: "", original: "Bengawan Solo" },
      {
        customStyle: "",
        original: "Riwayatmu ini sedari dulu jadi",
      },
    ];
    const options = {
      headers: ["Indonesian", "", "English"],
      needsRomanization: false,
      needsTranslation: true,
      isoLangCode: "id",
      bgColour: "black",
      fgColour: "white",
    };
    const res = generateLyricsSegment(lyrics, options);

    const expectedLyricsToggle = `{{lyrics toggle|id:Indonesian}}`;
    const expectedLyricsTable = `{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|Bengawan Solo
|-
|Riwayatmu ini sedari dulu jadi
|}`;
    const expected = `${expectedLyricsToggle}
${expectedLyricsTable}`;
    expect(res).toBe(expected);
  });

  test("Indonesian song with no translation (but with a translator added in error)", () => {
    const lyrics: ILyricsRow[] = [
      { customStyle: "", original: "Bengawan Solo" },
      {
        customStyle: "",
        original: "Riwayatmu ini sedari dulu jadi",
      },
    ];
    const options = {
      headers: ["Indonesian", "", "English"],
      needsRomanization: false,
      needsTranslation: true,
      isoLangCode: "id",
      translator: "John Doe",
      bgColour: "black",
      fgColour: "white",
    };
    const res = generateLyricsSegment(lyrics, options);

    const expectedLyricsToggle = `{{lyrics toggle|id:Indonesian}}`;
    const expectedLyricsTable = `{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|Bengawan Solo
|-
|Riwayatmu ini sedari dulu jadi
|}`;
    const expected = `${expectedLyricsToggle}
${expectedLyricsTable}`;
    expect(res).toBe(expected);
  });
});

describe("generateLyricsSegment - integrated", () => {
  test("lyrics table", () => {
    /**
     * Translation of "Iroha" by an anonymous contributor on Wikipedia
     * Distributed under CC-BY-SA-4.0
     */
    const lyrics: ILyricsRow[] = [
      {
        customStyle: "",
        original: "いろはにほへと",
        romanized: "iroha nioedo",
        english: "Even the blossoming flowers",
      },
      {
        customStyle: "",
        original: "ちりぬるを",
        romanized: "chirinuru o",
        english: "Will eventually scatter",
      },
      {
        customStyle: "",
        original: "わかよたれそ",
        romanized: "wa ga yo dare zo",
        english: "Who in our world",
      },
      {
        customStyle: "",
        original: "つねならむ",
        romanized: "tsune naran",
        english: "Shall always be?",
      },
      { customStyle: "", original: "", romanized: "", english: "" },
      {
        customStyle: "",
        original: "うゐのおくやま",
        romanized: "ui no okuyama",
        english: "The deep mountains of conditions—",
      },
      {
        customStyle: "",
        original: "けふこえて",
        romanized: "kyou koete",
        english: "We cross them today",
      },
      {
        customStyle: "",
        original: "あさきゆめみし",
        romanized: "asaki yume miji",
        english: "And we shall not have shallow dreams",
      },
      {
        customStyle: "",
        original: "ゑひもせす",
        romanized: "yoi mo sezu",
        english: "Nor be intoxicated.",
      },
    ];
    const options = {
      headers: ["Japanese", "Romaji", "English"],
      needsRomanization: true,
      needsTranslation: true,
      isoLangCode: "ja",
      translator: "John Doe",
      isOfficialTranslation: false,
      bgColour: "black",
      fgColour: "white",
    };
    const res = generateLyricsSegment(lyrics, options);

    const expectedLyricsToggle = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}`;
    const expectedLyricsTable = `{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|いろはにほへと
|iroha nioedo
|Even the blossoming flowers
|-
|ちりぬるを
|chirinuru o
|Will eventually scatter
|-
|わかよたれそ
|wa ga yo dare zo
|Who in our world
|-
|つねならむ
|tsune naran
|Shall always be?
|-
|<br />
|-
|うゐのおくやま
|ui no okuyama
|The deep mountains of conditions—
|-
|けふこえて
|kyou koete
|We cross them today
|-
|あさきゆめみし
|asaki yume miji
|And we shall not have shallow dreams
|-
|ゑひもせす
|yoi mo sezu
|Nor be intoxicated.
|}`;
    const expected = `${expectedLyricsToggle}
${expectedLyricsTable}
{{Translator|John Doe}}`;
    expect(res).toBe(expected);
  });

  test("lyrics table (with formatting)", () => {
    const lyrics: ILyricsRow[] = [
      {
        customStyle: "font-weight: bold;",
        original: "いろはにほへと",
        romanized: "iroha nioedo",
        english: "Even the blossoming flowers",
      },
      {
        customStyle: "font-weight: bold;",
        original: "ちりぬるを",
        romanized: "chirinuru o",
        english: "Will eventually scatter",
      },
      {
        customStyle: "font-weight: bold;",
        original: "わかよたれそ",
        romanized: "wa ga yo dare zo",
        english: "Who in our world",
      },
      {
        customStyle: "font-weight: bold;",
        original: "つねならむ",
        romanized: "tsune naran",
        english: "Shall always be?",
      },
      { customStyle: "", original: "", romanized: "", english: "" },
      {
        customStyle: "",
        original: "うゐのおくやま",
        romanized: "ui no okuyama",
        english: "The deep mountains of conditions—",
      },
      {
        customStyle: "",
        original: "けふこえて",
        romanized: "kyou koete",
        english: "We cross them today",
      },
      {
        customStyle: "",
        original: "あさきゆめみし",
        romanized: "asaki yume miji",
        english: "And we shall not have shallow dreams",
      },
      {
        customStyle: "",
        original: "ゑひもせす",
        romanized: "yoi mo sezu",
        english: "Nor be intoxicated.",
      },
    ];
    const options = {
      headers: ["Japanese", "Romaji", "English"],
      needsRomanization: true,
      needsTranslation: true,
      isoLangCode: "ja",
      translator: "John Doe",
      isOfficialTranslation: false,
      bgColour: "black",
      fgColour: "white",
    };
    const res = generateLyricsSegment(lyrics, options);

    const expectedLyricsToggle = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}`;
    const expectedLyricsTable = `{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|- style="font-weight: bold;"
|いろはにほへと
|iroha nioedo
|Even the blossoming flowers
|- style="font-weight: bold;"
|ちりぬるを
|chirinuru o
|Will eventually scatter
|- style="font-weight: bold;"
|わかよたれそ
|wa ga yo dare zo
|Who in our world
|- style="font-weight: bold;"
|つねならむ
|tsune naran
|Shall always be?
|-
|<br />
|-
|うゐのおくやま
|ui no okuyama
|The deep mountains of conditions—
|-
|けふこえて
|kyou koete
|We cross them today
|-
|あさきゆめみし
|asaki yume miji
|And we shall not have shallow dreams
|-
|ゑひもせす
|yoi mo sezu
|Nor be intoxicated.
|}`;
    const expected = `${expectedLyricsToggle}
${expectedLyricsTable}
{{Translator|John Doe}}`;
    expect(res).toBe(expected);
  });

  test("poem", () => {
    const lyrics: ILyricsRow[] = [
      {
        customStyle: "",
        original: "Even the blossoming flowers",
      },
      {
        customStyle: "",
        original: "Will eventually scatter",
      },
      {
        customStyle: "",
        original: "Who in our world",
      },
      {
        customStyle: "",
        original: "Shall always be?",
      },
      { customStyle: "", original: "" },
      {
        customStyle: "",
        original: "The deep mountains of conditions—",
      },
      {
        customStyle: "",
        original: "We cross them today",
      },
      {
        customStyle: "",
        original: "And we shall not have shallow dreams",
      },
      {
        customStyle: "",
        original: "Nor be intoxicated.",
      },
    ];
    const options = {
      headers: ["English", "", ""],
      needsRomanization: false,
      needsTranslation: false,
      isoLangCode: "en",
      bgColour: "black",
      fgColour: "white",
    };
    const res = generateLyricsSegment(lyrics, options);

    const expectedLyricsToggle = "";
    const expectedLyricsPoem = `<poem>Even the blossoming flowers
Will eventually scatter
Who in our world
Shall always be?

The deep mountains of conditions—
We cross them today
And we shall not have shallow dreams
Nor be intoxicated.</poem>`;
    const expected = `${expectedLyricsToggle}${expectedLyricsPoem}`;
    expect(res).toBe(expected);
  });

  test("poem (with formatting)", () => {
    const lyrics: ILyricsRow[] = [
      {
        customStyle: "font-weight: bold;",
        original: "Even the blossoming flowers",
      },
      {
        customStyle: "font-weight: bold;",
        original: "Will eventually scatter",
      },
      {
        customStyle: "font-weight: bold;",
        original: "Who in our world",
      },
      {
        customStyle: "font-weight: bold;",
        original: "Shall always be?",
      },
      { customStyle: "", original: "" },
      {
        customStyle: "",
        original: "The deep mountains of conditions—",
      },
      {
        customStyle: "",
        original: "We cross them today",
      },
      {
        customStyle: "",
        original: "And we shall not have shallow dreams",
      },
      {
        customStyle: "",
        original: "Nor be intoxicated.",
      },
    ];
    const options = {
      headers: ["English", "", ""],
      needsRomanization: false,
      needsTranslation: false,
      isoLangCode: "en",
      bgColour: "black",
      fgColour: "white",
    };
    const res = generateLyricsSegment(lyrics, options);

    const expectedLyricsToggle = "";
    const expectedLyricsPoem = `<poem><span style="font-weight: bold;">Even the blossoming flowers
Will eventually scatter
Who in our world
Shall always be?</span>

The deep mountains of conditions—
We cross them today
And we shall not have shallow dreams
Nor be intoxicated.</poem>`;
    const expected = `${expectedLyricsToggle}${expectedLyricsPoem}`;
    expect(res).toBe(expected);
  });
});

describe("generateLyricsSegment - with toggle element", () => {
  test("3 columns", () => {
    const lyrics: ILyricsRow[] = [
      { customStyle: "", original: "あいうえお", romanized: "aiueo", english: "ABCDEFG" },
      { customStyle: "", original: "かきくけこ", romanized: "kakikukeko", english: "HIJKLMN" },
    ];
    const options = {
      toggleElement: "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}",
      headers: [],
      needsRomanization: true,
      needsTranslation: true,
      translator: "John Doe",
      isOfficialTranslation: false,
      bgColour: "black",
      fgColour: "white",
    };
    const res = generateLyricsSegment(lyrics, options);

    const expectedLyricsToggle = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}`;
    const expectedLyricsTable = `{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|ABCDEFG
|-
|かきくけこ
|kakikukeko
|HIJKLMN
|}`;
    const expected = `${expectedLyricsToggle}
${expectedLyricsTable}
{{Translator|John Doe}}`;
    expect(res).toBe(expected);
  });

  test("5 columns", () => {
    const lyrics: ILyricsRow[] = [
      {
        customStyle: "",
        original: "あいうえお",
        romanized: "aiueo",
        english: "ABCDEFG",
        additionalColumns: ["Eggs", "Bacon"],
      },
      {
        customStyle: "",
        original: "かきくけこ",
        romanized: "kakikukeko",
        english: "HIJKLMN",
        additionalColumns: ["Ham", "Cheese"],
      },
    ];
    const options = {
      toggleElement:
        "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English|eng2:English 2|eng3:English 3}}",
      headers: [],
      needsRomanization: true,
      needsTranslation: true,
      translator: "John Doe",
      isOfficialTranslation: false,
      bgColour: "black",
      fgColour: "white",
    };
    const res = generateLyricsSegment(lyrics, options);

    const expectedLyricsToggle = `{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English|eng2:English 2|eng3:English 3}}`;
    const expectedLyricsTable = `{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|ABCDEFG
|Eggs
|Bacon
|-
|かきくけこ
|kakikukeko
|HIJKLMN
|Ham
|Cheese
|}`;
    const expected = `${expectedLyricsToggle}
${expectedLyricsTable}
{{Translator|John Doe}}`;
    expect(res).toBe(expected);
  });

  test("2 columns (no English)", () => {
    const lyrics: ILyricsRow[] = [
      { customStyle: "", original: "あいうえお", romanized: "aiueo" },
      { customStyle: "", original: "かきくけこ", romanized: "kakikukeko" },
    ];
    const options = {
      toggleElement: "{{lyrics toggle|jp:Japanese|rom:Romaji}}",
      headers: [],
      needsRomanization: true,
      needsTranslation: true,
      bgColour: "black",
      fgColour: "white",
    };
    const res = generateLyricsSegment(lyrics, options);

    const expectedLyricsToggle = `{{lyrics toggle|jp:Japanese|rom:Romaji}}`;
    const expectedLyricsTable = `{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|-
|かきくけこ
|kakikukeko
|}`;
    const expected = `${expectedLyricsToggle}
${expectedLyricsTable}`;
    expect(res).toBe(expected);
  });

  test("2 columns (no English) (with a translator added in error)", () => {
    const lyrics: ILyricsRow[] = [
      { customStyle: "", original: "あいうえお", romanized: "aiueo" },
      { customStyle: "", original: "かきくけこ", romanized: "kakikukeko" },
    ];
    const options = {
      toggleElement: "{{lyrics toggle|jp:Japanese|rom:Romaji}}",
      headers: [],
      needsRomanization: true,
      needsTranslation: true,
      translator: "John Doe",
      bgColour: "black",
      fgColour: "white",
    };
    const res = generateLyricsSegment(lyrics, options);

    const expectedLyricsToggle = `{{lyrics toggle|jp:Japanese|rom:Romaji}}`;
    const expectedLyricsTable = `{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|-
|かきくけこ
|kakikukeko
|}`;
    const expected = `${expectedLyricsToggle}
${expectedLyricsTable}`;
    expect(res).toBe(expected);
  });

  test("2 columns (with English)", () => {
    const lyrics: ILyricsRow[] = [
      { customStyle: "", original: "Bengawan Solo", english: "Solo River" },
      {
        customStyle: "",
        original: "Riwayatmu ini sedari dulu jadi",
        english: "As of now, your fate has",
      },
    ];
    const options = {
      toggleElement: "{{lyrics toggle|id:Indonesian|eng:English}}",
      headers: [],
      needsRomanization: false,
      needsTranslation: true,
      translator: "John Doe",
      isOfficialTranslation: false,
      bgColour: "black",
      fgColour: "white",
    };
    const res = generateLyricsSegment(lyrics, options);

    const expectedLyricsToggle = `{{lyrics toggle|id:Indonesian|eng:English}}`;
    const expectedLyricsTable = `{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|Bengawan Solo
|Solo River
|-
|Riwayatmu ini sedari dulu jadi
|As of now, your fate has
|}`;
    const expected = `${expectedLyricsToggle}
${expectedLyricsTable}
{{Translator|John Doe}}`;
    expect(res).toBe(expected);
  });

  test("1 column (no English)", () => {
    const lyrics: ILyricsRow[] = [
      { customStyle: "", original: "Bengawan Solo" },
      {
        customStyle: "",
        original: "Riwayatmu ini sedari dulu jadi",
      },
    ];
    const options = {
      toggleElement: "{{lyrics toggle|id:Indonesian}}",
      headers: [],
      needsRomanization: false,
      needsTranslation: true,
      bgColour: "black",
      fgColour: "white",
    };
    const res = generateLyricsSegment(lyrics, options);

    const expectedLyricsToggle = `{{lyrics toggle|id:Indonesian}}`;
    const expectedLyricsTable = `{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|Bengawan Solo
|-
|Riwayatmu ini sedari dulu jadi
|}`;
    const expected = `${expectedLyricsToggle}
${expectedLyricsTable}`;
    expect(res).toBe(expected);
  });

  test("1 column (no English) (with a translator added in error)", () => {
    const lyrics: ILyricsRow[] = [
      { customStyle: "", original: "Bengawan Solo" },
      {
        customStyle: "",
        original: "Riwayatmu ini sedari dulu jadi",
      },
    ];
    const options = {
      toggleElement: "{{lyrics toggle|id:Indonesian}}",
      headers: [],
      needsRomanization: false,
      needsTranslation: true,
      translator: "John Doe",
      bgColour: "black",
      fgColour: "white",
    };
    const res = generateLyricsSegment(lyrics, options);

    const expectedLyricsToggle = `{{lyrics toggle|id:Indonesian}}`;
    const expectedLyricsTable = `{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|Bengawan Solo
|-
|Riwayatmu ini sedari dulu jadi
|}`;
    const expected = `${expectedLyricsToggle}
${expectedLyricsTable}`;
    expect(res).toBe(expected);
  });
});