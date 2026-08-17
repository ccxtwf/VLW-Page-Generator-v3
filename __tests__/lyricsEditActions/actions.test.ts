import { describe, expect, test } from "vite-plus/test";
import {
  consolidateCellInlineColourFormatting,
  decapitalizeRomanization,
  detonePinyinLyrics,
  standardizeHepburnRomanization,
} from "../../src/lib/utils/lyricsEditFormActions";

describe("lyricsEditActions", () => {
  test("consolidateCellInlineColourFormatting", () => {
    const input = [
      [
        "",
        '<span style="color:grey;">あいうえお</span>',
        '<span style="color:grey;">aiueo</span>',
        '<span style="color:grey;">ABCD</span>',
      ],
      [
        "",
        '<span style="color:yellow;">かきくけこ</span><span style="color:red">あいうえお</span>',
        '<span style="color:yellow;">kakikukeko</span><span style="color:red">aiueo</span>',
        '<span style="color:yellow;">EFGH</span><span style="color:red">ABCD</span>',
      ],
      [
        "",
        '<span style="color:yellow;">かきくけこ<span style="color:red">あいうえお</span></span>',
        '<span style="color:yellow;">kakikukeko<span style="color:red">aiueo</span></span>',
        '<span style="color:yellow;">EFGH<span style="color:red">ABCD</span></span>',
      ],
      ["", "かきくけこ", "kakikukeko", "HIJKLMN"],
    ];
    const expected = [
      ["color:grey;", "あいうえお", "aiueo", "ABCD"],
      [
        "",
        '<span style="color:yellow;">かきくけこ</span><span style="color:red">あいうえお</span>',
        '<span style="color:yellow;">kakikukeko</span><span style="color:red">aiueo</span>',
        '<span style="color:yellow;">EFGH</span><span style="color:red">ABCD</span>',
      ],
      [
        "",
        '<span style="color:yellow;">かきくけこ<span style="color:red">あいうえお</span></span>',
        '<span style="color:yellow;">kakikukeko<span style="color:red">aiueo</span></span>',
        '<span style="color:yellow;">EFGH<span style="color:red">ABCD</span></span>',
      ],
      ["", "かきくけこ", "kakikukeko", "HIJKLMN"],
    ];
    expect(consolidateCellInlineColourFormatting(input)).toStrictEqual(expected);
  });

  test("decapitalizeRomanization", () => {
    const input = [
      ["", "あいうえお あいうえお", "Aiueo aiueo", "ABCDEFG"],
      ["", "かきくけこ かきくけこ", "Kakikukeko Kakikukeko", "HIJKLMN"],
      [
        "",
        "庭には二羽鶏がいるの？庭にいるんですよ。そう、",
        "Niwa ni wa niwatori ga iru no? Niwa ni irun desu yo. Sou,",
        "OPQRST",
      ],
    ];
    const expected = [
      ["", "あいうえお あいうえお", "aiueo aiueo", "ABCDEFG"],
      ["", "かきくけこ かきくけこ", "kakikukeko Kakikukeko", "HIJKLMN"],
      [
        "",
        "庭には二羽鶏がいるの？庭にいるんですよ。そう、",
        "niwa ni wa niwatori ga iru no? niwa ni irun desu yo. sou,",
        "OPQRST",
      ],
    ];
    expect(decapitalizeRomanization(input)).toStrictEqual(expected);
  });

  test("detonePinyinLyrics", () => {
    const input = [
      ["", "好一朵美丽的茉莉花", "hǎo yī duǒ měilì de mòlihuā", "ABCDEFG"],
      ["", "芬芳美丽满枝桠", "fēn fāng měilì mǎn zhī yā", "HIJKLMN"],
      ["", "又香又白人人夸", "yòu xiāng yòu bái rén rén kuā", "OPQRST"],
      ["", "女娲补天", "Nǚ wā bǔ tiān", "UVWXYZ"],
    ];
    const expected = [
      ["", "好一朵美丽的茉莉花", "hao yi duo meili de molihua", "ABCDEFG"],
      ["", "芬芳美丽满枝桠", "fen fang meili man zhi ya", "HIJKLMN"],
      ["", "又香又白人人夸", "you xiang you bai ren ren kua", "OPQRST"],
      ["", "女娲补天", "Nü wa bu tian", "UVWXYZ"],
    ];
    expect(detonePinyinLyrics(input)).toStrictEqual(expected);
  });

  test("standardizeHepburnRomanization", () => {
    const input = [
      ["", "命がずっと続くのさ。", "inochi ga zutto tsudzuku no sa.", "ABCDEFG"],
      ["", "夢の彼方へ", "yume no kanata he", "HIJKLMN"],
      ["", "思い出を！", "omoide wo!", "OPQRST"],
    ];
    const expected = [
      ["", "命がずっと続くのさ。", "inochi ga zutto tsuzuku no sa.", "ABCDEFG"],
      ["", "夢の彼方へ", "yume no kanata e", "HIJKLMN"],
      ["", "思い出を！", "omoide o!", "OPQRST"],
    ];
    expect(standardizeHepburnRomanization(input)).toStrictEqual(expected);
  });
});