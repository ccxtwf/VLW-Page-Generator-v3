import { describe, expect, test } from "vite-plus/test";
import { mapLanguages } from "../../mapper";

import Song from "#src/lib/models/Song.svelte.ts";
import { generatePage } from "#src/lib/logic/songs.svelte.ts";

import LyricRow from "#src/lib/models/children/LyricsRow.svelte.ts";
import PlayLink from "#src/lib/models/children/PlayLink.svelte.ts";
import ExternalLink from "#src/lib/models/children/ExternalLink.svelte.ts";

import { ENUM_AI_WARNING_TYPE, ENUM_CW_STATES } from "#src/lib/models/enums.ts";

describe("Generate song pages", () => {
  test("Empty form state", () => {
    const formData = new Song();

    const [page, outputTitle] = generatePage(formData);

    const expected = `{{Infobox Song
|songtitle = "''''''"
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = N/A
|link = N/A
|language = 
}}

==Lyrics==
{{lyrics toggle|org:Original|rom:Romanized|iso-lang=}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|}`;

    expect(page).toEqual(expected);
    expect(outputTitle).toEqual("");
  });

  test("Should truncate lyrics", () => {
    const formData = new Song({
      lyrics: [
        { customStyle: "", original: "foo", romanized: "bar", english: "" },
        { customStyle: "", original: "", romanized: "", english: "" },
        { customStyle: "", original: "bar", romanized: "baz", english: "" },
        { customStyle: "", original: "", romanized: "", english: "" },
        { customStyle: "", original: "", romanized: "", english: "" },
        { customStyle: "", original: "", romanized: "", english: "" },
      ],
    });

    const [page, outputTitle] = generatePage(formData);

    const expected = `{{Infobox Song
|songtitle = "''''''"
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = N/A
|link = N/A
|language = 
}}

==Lyrics==
{{lyrics toggle|org:Original|rom:Romanized|iso-lang=}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|foo
|bar
|-
|<br />
|-
|bar
|baz
|}`;

    expect(page).toEqual(expected);
    expect(outputTitle).toEqual("");
  });

  test("Japanese song", () => {
    const formData = new Song({
      languages: mapLanguages("Japanese"),
      isoLangCode: "ja",
      origTitle: "ローリングガール",
      romTitle: "Rooringu Gaaru",
      engTitle: "Rolling Girl",
      titleIsOfficiallyTranslated: true,
      bgColour: "red",
      fgColour: "yellow",
      uploadDateRaw: "2010-02-14",
      isAlbumOnly: false,
      isUnavailable: false,
      singers: "[[Hatsune Miku (VOCALOID)]]",
      producers: "[[wowaka]] (music, lyrics)",
      description: "A song by wowaka",
      translator: "",
      isOfficialTranslation: true,
      categoriesRaw: "wowaka songs list",
      lyrics: [
        new LyricRow({ original: "あいうえお", romanized: "aiueo", english: "ABCD" }),
        new LyricRow({ original: "かきくけこ", romanized: "kakikukeko", english: "EFGH" }),
        new LyricRow({ original: "さしすせそ", romanized: "sasisuseso", english: "IJKL" }),
        new LyricRow({ original: "", romanized: "", english: "" }),
        new LyricRow({ original: "SHOUT!", romanized: "SHOUT!", english: "SHOUT!" }),
      ],
      playLinks: [
        new PlayLink({
          site: "YouTube",
          url: "https://www.youtube.com/watch?v=vnw8zURAxkU",
          viewCount: "1,000,000+",
        }),
      ],
      extLinks: [
        new ExternalLink({
          description: "Pixiv",
          url: "https://www.pixiv.net/artworks/10324371",
          isOfficial: true,
        }),
        new ExternalLink({
          description: "VocaDB",
          url: "https://vocadb.net/S/1501",
          isOfficial: false,
        }),
      ],
    });
    formData.preprocess();

    const [page, outputTitle] = generatePage(formData);

    const expected = `{{sort}}
{{Infobox Song
|songtitle = "'''ローリングガール'''"<br />Romaji: Rooringu Gaaru<br />Official English: Rolling Girl
|color = red; color:yellow
|original upload date = {{Date|2010|February|14}}
|singer = [[Hatsune Miku (VOCALOID)]]
|producer = [[wowaka]] (music, lyrics)
|#views = 1,000,000+
|link = {{#|https://www.youtube.com/watch?v=vnw8zURAxkU}}
|description = A song by wowaka
|language = Japanese
}}

==Lyrics==
{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}
{{OfficialEnglishNotify}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|ABCD
|-
|かきくけこ
|kakikukeko
|EFGH
|-
|さしすせそ
|sasisuseso
|IJKL
|-
|<br />
|-
| {{shared}} SHOUT!
|}

==External Links==
* [https://www.pixiv.net/artworks/10324371 Pixiv]
===Unofficial===
* {{VDB|S/1501}}

[[Category:wowaka songs list]]`;

    expect(page).toEqual(expected);
    expect(outputTitle).toEqual("ローリングガール (Rooringu Gaaru)");
  });

  test.each([
    {
      d: "Questionable CW",
      i: {
        cwState: ENUM_CW_STATES.questionable,
        cwText: "Theft",
      },
      o: "{{Questionable|Theft}}",
    },
    {
      d: "Verified AI warning",
      i: {
        aiCwState: ENUM_AI_WARNING_TYPE.verified,
        aiWarningText1: "music & lyrics",
        aiWarningText2: "video description",
      },
      o: "{{AIusage|music & lyrics|video description}}",
    },
    {
      d: "Suspected AI warning",
      i: {
        aiCwState: ENUM_AI_WARNING_TYPE.suspected,
        aiWarningText1: "illustration",
        aiWarningText2: "vibes are all over the place",
      },
      o: "{{AIusage|illustration|vibes are all over the place|unverified=1}}",
    },
    {
      d: "Both Questionable CW & AI CW",
      i: {
        cwState: ENUM_CW_STATES.questionable,
        cwText: "Theft",
        aiCwState: ENUM_AI_WARNING_TYPE.verified,
        aiWarningText1: "music & lyrics",
        aiWarningText2: "video description",
      },
      o: "{{Questionable|Theft}}{{AIusage|music & lyrics|video description}}",
    },
  ])("Japanese song with content warnings - $d", ({ i, o }) => {
    const formData = new Song({
      ...i,
      languages: mapLanguages("Japanese"),
      isoLangCode: "ja",
      origTitle: "AI最高",
      romTitle: "AI Saikou",
      bgColour: "black",
      fgColour: "white",
      uploadDateRaw: "2025-08-21",
      isAlbumOnly: false,
      isUnavailable: false,
      singers: "[[Hatsune Miku (VOCALOID)]]",
      producers: "Claude (music, lyrics)",
      description: "An AI-generated song",
      lyrics: [
        new LyricRow({ original: "あいうえお", romanized: "aiueo" }),
        new LyricRow({ original: "かきくけこ", romanized: "kakikukeko" }),
        new LyricRow({ original: "さしすせそ", romanized: "sasisuseso" }),
      ],
      playLinks: [
        new PlayLink({
          site: "YouTube",
          url: "https://www.youtube.com/watch?v=12345678901",
          viewCount: "1,000,000+",
        }),
      ],
    });
    formData.preprocess();

    const [page, _] = generatePage(formData);

    const expected = `{{sort}}${o}
{{Infobox Song
|songtitle = "'''AI最高'''"<br />Romaji: AI Saikou
|color = black; color:white
|original upload date = {{Date|2025|August|21}}
|singer = [[Hatsune Miku (VOCALOID)]]
|producer = Claude (music, lyrics)
|#views = 1,000,000+
|link = {{#|https://www.youtube.com/watch?v=12345678901}}
|description = An AI-generated song
|language = Japanese
}}

==Lyrics==
{{lyrics toggle|jp:Japanese|rom:Romaji}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|あいうえお
|aiueo
|-
|かきくけこ
|kakikukeko
|-
|さしすせそ
|sasisuseso
|}`;

    expect(page).toEqual(expected);
  });

  test("Chinese song with alt Traditional title", () => {
    const formData = new Song({
      languages: mapLanguages("Mandarin"),
      isoLangCode: "zh-Hans",
      origTitle: "过得好",
      romTitle: "Guò dé Hǎo",
      altChTitle: "過得好",
      altChIsTraditional: true,
      engTitle: "Doing Well",
      titleIsOfficiallyTranslated: false,
      bgColour: "red",
      fgColour: "yellow",
      uploadDateRaw: "2013-01-03",
      isAlbumOnly: false,
      isUnavailable: false,
      singers: "[[Luo Tianyi (VOCALOID)]]",
      producers: "[[李]] (music)\n[[苏]] (lyrics)",
      description: "This is a demo song.",
      translator: "",
      isOfficialTranslation: true,
      categoriesRaw: "李 songs list\n苏 songs list/Lyrics",
      lyrics: [
        new LyricRow({
          customStyle: "",
          original: "好一朵茉莉花,",
          romanized: "hǎo yī duo mòlìhuā,",
          english: "What a jasmine flower!",
        }),
        new LyricRow({
          customStyle: "",
          original: "滿園花開香也香不過她,",
          romanized: "mǎn yuán huā kāi xiāng yě xiāng bùguò tā,",
          english:
            "Of all the fragrant flowers and grasses in the garden, there is none as fragrant as it.",
        }),
        new LyricRow({
          customStyle: "",
          original: "我有心采一朵戴",
          romanized: "wǒ yǒuxīn cǎi yī duo dài",
          english: "I want to pluck one and wear it,",
        }),
        new LyricRow({
          customStyle: "",
          original: "又怕看花的人兒罵.",
          romanized: "yòu pà kàn huā de rén er mà.",
          english: "but the gardener would scold me.",
        }),
      ],
      playLinks: [
        new PlayLink({
          site: "YouTube",
          url: "https://www.youtube.com/watch?v=vnw8zURAxkU",
          viewCount: "1,000,000+",
        }),
      ],
      extLinks: [
        new ExternalLink({
          description: "Pixiv",
          url: "https://www.pixiv.net/artworks/10324371",
          isOfficial: true,
        }),
        new ExternalLink({
          description: "VocaDB",
          url: "https://vocadb.net/S/1501",
          isOfficial: false,
        }),
      ],
    });
    formData.preprocess();

    const [page, outputTitle] = generatePage(formData);

    const expected = `{{sort}}
{{Infobox Song
|songtitle = "'''过得好'''"<br />Traditional Chinese: 過得好<br />Pinyin: Guò dé Hǎo<br />English: Doing Well
|color = red; color:yellow
|original upload date = {{Date|2013|January|3}}
|singer = [[Luo Tianyi (VOCALOID)]]
|producer = [[李]] (music)<br />[[苏]] (lyrics)
|#views = 1,000,000+
|link = {{#|https://www.youtube.com/watch?v=vnw8zURAxkU}}
|description = This is a demo song.
|language = Mandarin
}}

==Lyrics==
{{lyrics toggle|cn:Mandarin|py:Pinyin|eng:English}}
{{OfficialEnglishNotify}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|好一朵茉莉花,
|hǎo yī duo mòlìhuā,
|What a jasmine flower!
|-
|滿園花開香也香不過她,
|mǎn yuán huā kāi xiāng yě xiāng bùguò tā,
|Of all the fragrant flowers and grasses in the garden, there is none as fragrant as it.
|-
|我有心采一朵戴
|wǒ yǒuxīn cǎi yī duo dài
|I want to pluck one and wear it,
|-
|又怕看花的人兒罵.
|yòu pà kàn huā de rén er mà.
|but the gardener would scold me.
|}

==External Links==
* [https://www.pixiv.net/artworks/10324371 Pixiv]
===Unofficial===
* {{VDB|S/1501}}

[[Category:李 songs list]]
[[Category:苏 songs list/Lyrics]]`;

    expect(page).toEqual(expected);
    expect(outputTitle).toEqual("过得好 (Guò dé Hǎo)");
  });

  test("Chinese song with alt Simplified title", () => {
    const formData = new Song({
      languages: mapLanguages("Mandarin"),
      isoLangCode: "zh-Hans",
      origTitle: "過得好",
      romTitle: "Guò dé Hǎo",
      altChTitle: "过得好",
      altChIsTraditional: false,
      engTitle: "Doing Well",
      titleIsOfficiallyTranslated: false,
      bgColour: "red",
      fgColour: "yellow",
      uploadDateRaw: "2013-01-03",
      isAlbumOnly: false,
      isUnavailable: false,
      singers: "[[Luo Tianyi (VOCALOID)]]",
      producers: "[[李]] (music)\n[[苏]] (lyrics)",
      description: "This is a demo song.",
      translator: "",
      isOfficialTranslation: true,
      categoriesRaw: "李 songs list\n苏 songs list/Lyrics",
      lyrics: [
        new LyricRow({
          customStyle: "",
          original: "好一朵茉莉花,",
          romanized: "hǎo yī duo mòlìhuā,",
          english: "What a jasmine flower!",
        }),
        new LyricRow({
          customStyle: "",
          original: "滿園花開香也香不過她,",
          romanized: "mǎn yuán huā kāi xiāng yě xiāng bùguò tā,",
          english:
            "Of all the fragrant flowers and grasses in the garden, there is none as fragrant as it.",
        }),
        new LyricRow({
          customStyle: "",
          original: "我有心采一朵戴",
          romanized: "wǒ yǒuxīn cǎi yī duo dài",
          english: "I want to pluck one and wear it,",
        }),
        new LyricRow({
          customStyle: "",
          original: "又怕看花的人兒罵.",
          romanized: "yòu pà kàn huā de rén er mà.",
          english: "but the gardener would scold me.",
        }),
      ],
      playLinks: [
        new PlayLink({
          site: "YouTube",
          url: "https://www.youtube.com/watch?v=vnw8zURAxkU",
          viewCount: "1,000,000+",
        }),
      ],
      extLinks: [
        new ExternalLink({
          description: "Pixiv",
          url: "https://www.pixiv.net/artworks/10324371",
          isOfficial: true,
        }),
        new ExternalLink({
          description: "VocaDB",
          url: "https://vocadb.net/S/1501",
          isOfficial: false,
        }),
      ],
    });
    formData.preprocess();

    const [page, outputTitle] = generatePage(formData);

    const expected = `{{sort}}
{{Infobox Song
|songtitle = "'''過得好'''"<br />Simplified Chinese: 过得好<br />Pinyin: Guò dé Hǎo<br />English: Doing Well
|color = red; color:yellow
|original upload date = {{Date|2013|January|3}}
|singer = [[Luo Tianyi (VOCALOID)]]
|producer = [[李]] (music)<br />[[苏]] (lyrics)
|#views = 1,000,000+
|link = {{#|https://www.youtube.com/watch?v=vnw8zURAxkU}}
|description = This is a demo song.
|language = Mandarin
}}

==Lyrics==
{{lyrics toggle|cn:Mandarin|py:Pinyin|eng:English}}
{{OfficialEnglishNotify}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|好一朵茉莉花,
|hǎo yī duo mòlìhuā,
|What a jasmine flower!
|-
|滿園花開香也香不過她,
|mǎn yuán huā kāi xiāng yě xiāng bùguò tā,
|Of all the fragrant flowers and grasses in the garden, there is none as fragrant as it.
|-
|我有心采一朵戴
|wǒ yǒuxīn cǎi yī duo dài
|I want to pluck one and wear it,
|-
|又怕看花的人兒罵.
|yòu pà kàn huā de rén er mà.
|but the gardener would scold me.
|}

==External Links==
* [https://www.pixiv.net/artworks/10324371 Pixiv]
===Unofficial===
* {{VDB|S/1501}}

[[Category:李 songs list]]
[[Category:苏 songs list/Lyrics]]`;

    expect(page).toEqual(expected);
    expect(outputTitle).toEqual("過得好 (Guò dé Hǎo)");
  });

  test("Indonesian song", () => {
    const formData = new Song({
      languages: mapLanguages("Indonesian"),
      isoLangCode: "id",
      origTitle: "Bengawan Solo",
      engTitle: "Solo River",
      titleIsOfficiallyTranslated: true,
      bgColour: "black",
      fgColour: "white",
      uploadDateRaw: "2000-01-01",
      isAlbumOnly: false,
      isUnavailable: false,
      singers: "[[Hatsune Miku (VOCALOID)]]",
      producers: "[[Budi Promono]] (music, lyrics)",
      description: "Budaya nusantara",
      translator: "",
      isOfficialTranslation: true,
      categoriesRaw: "Budi Promono songs list",
      lyrics: [
        new LyricRow({ original: "aiueo", english: "ABCD" }),
        new LyricRow({ original: "kakikukeko", english: "EFGH" }),
        new LyricRow({ original: "sasisuseso", english: "IJKL" }),
        new LyricRow({ original: "", romanized: "", english: "" }),
        new LyricRow({ original: "SHOUT!", romanized: "SHOUT!", english: "SHOUT!" }),
      ],
      playLinks: [
        new PlayLink({
          site: "YouTube",
          url: "https://www.youtube.com/watch?v=vnw8zURAxkU",
          viewCount: "1,000,000+",
        }),
      ],
      extLinks: [
        new ExternalLink({
          description: "Pixiv",
          url: "https://www.pixiv.net/artworks/10324371",
          isOfficial: true,
        }),
        new ExternalLink({
          description: "VocaDB",
          url: "https://vocadb.net/S/1501",
          isOfficial: false,
        }),
      ],
    });
    formData.preprocess();

    const [page, outputTitle] = generatePage(formData);

    const expected = `{{Infobox Song
|songtitle = "'''Bengawan Solo'''"<br />Official English: Solo River
|color = black; color:white
|original upload date = {{Date|2000|January|1}}
|singer = [[Hatsune Miku (VOCALOID)]]
|producer = [[Budi Promono]] (music, lyrics)
|#views = 1,000,000+
|link = {{#|https://www.youtube.com/watch?v=vnw8zURAxkU}}
|description = Budaya nusantara
|language = Indonesian
}}

==Lyrics==
{{lyrics toggle|id:Indonesian|eng:English}}
{{OfficialEnglishNotify}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|aiueo
|ABCD
|-
|kakikukeko
|EFGH
|-
|sasisuseso
|IJKL
|-
|<br />
|-
| {{shared}} SHOUT!
|}

==External Links==
* [https://www.pixiv.net/artworks/10324371 Pixiv]
===Unofficial===
* {{VDB|S/1501}}

[[Category:Budi Promono songs list]]`;

    expect(page).toEqual(expected);
    expect(outputTitle).toEqual("Bengawan Solo");
  });

  test("English song", () => {
    const formData = new Song({
      languages: mapLanguages("English"),
      isoLangCode: "eng",
      origTitle: "ECHO the World",
      bgColour: "black",
      fgColour: "white",
      uploadDateRaw: "2000-01-01",
      isAlbumOnly: false,
      isUnavailable: false,
      singers: "[[Hatsune Miku (VOCALOID)]]",
      producers: "[[Jane Doe]] (music, lyrics)",
      description: "A song by J.Doe",
      categoriesRaw: "Jane Doe songs list",
      lyrics: [
        new LyricRow({ original: "ABCD" }),
        new LyricRow({ original: "EFGH" }),
        new LyricRow({ original: "IJKL" }),
      ],
      playLinks: [
        new PlayLink({
          site: "YouTube",
          url: "https://www.youtube.com/watch?v=vnw8zURAxkU",
          viewCount: "1,000,000+",
        }),
      ],
      extLinks: [
        new ExternalLink({
          description: "Pixiv",
          url: "https://www.pixiv.net/artworks/10324371",
          isOfficial: true,
        }),
        new ExternalLink({
          description: "VocaDB",
          url: "https://vocadb.net/S/1501",
          isOfficial: false,
        }),
      ],
    });
    formData.preprocess();

    const [page, outputTitle] = generatePage(formData);

    const expected = `{{Infobox Song
|songtitle = "'''ECHO the World'''"
|color = black; color:white
|original upload date = {{Date|2000|January|1}}
|singer = [[Hatsune Miku (VOCALOID)]]
|producer = [[Jane Doe]] (music, lyrics)
|#views = 1,000,000+
|link = {{#|https://www.youtube.com/watch?v=vnw8zURAxkU}}
|description = A song by J.Doe
|language = English
}}

==Lyrics==
<poem>ABCD
EFGH
IJKL</poem>

==External Links==
* [https://www.pixiv.net/artworks/10324371 Pixiv]
===Unofficial===
* {{VDB|S/1501}}

[[Category:Jane Doe songs list]]`;

    expect(page).toEqual(expected);
    expect(outputTitle).toEqual("ECHO the World");
  });
});
