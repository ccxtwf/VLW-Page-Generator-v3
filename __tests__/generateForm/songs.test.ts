import { describe, expect, test } from "vite-plus/test";
import Song from "../../src/lib/models/Song.svelte";
import { generatePage } from "../../src/lib/logic/songs.svelte";
import { LANGUAGES } from "../../src/constants";
import { type MultiSelectItem } from "../../src/schemas/form";
import LyricRow from "../../src/lib/models/children/LyricsRow.svelte";
import PlayLink from "../../src/lib/models/children/PlayLink.svelte";
import ExternalLink from "../../src/lib/models/children/ExternalLink.svelte";
import { ENUM_AI_WARNING_TYPE, ENUM_CW_STATES } from "../../src/lib/models/enums";

const mapLanguages = (...languages: string[]): MultiSelectItem[] => {
  return languages.map((l) => ({
    label: l,
    value: LANGUAGES.findIndex((o) => o.name === l),
  }));
};

describe("Generate song pages", () => {
  test("Japanese song", () => {
    const formData = new Song({
      languages: mapLanguages("Japanese"),
      isoLangCode: "ja",
      origTitle: "ローリングガール",
      romTitle: "Rooringu Gaaru",
      engTitle: "Rolling Girl",
      titleIsOfficiallyTranslated: true,
      bgColour: "black",
      fgColour: "white",
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

    const page = generatePage(formData);

    const expected = `{{sort}}
{{Infobox Song
|songtitle = "'''ローリングガール'''"<br />Romaji: Rooringu Gaaru<br />Official English: Rolling Girl
|color = black; color:white
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
|}

==External Links==
* [https://www.pixiv.net/artworks/10324371 Pixiv]
===Unofficial===
* {{VDB|S/1501}}

[[Category:wowaka songs list]]`;

    expect(page).toEqual(expected);
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

    const page = generatePage(formData);

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

    const page = generatePage(formData);

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
|}

==External Links==
* [https://www.pixiv.net/artworks/10324371 Pixiv]
===Unofficial===
* {{VDB|S/1501}}

[[Category:Budi Promono songs list]]`;

    expect(page).toEqual(expected);
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

    const page = generatePage(formData);

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
  });
});