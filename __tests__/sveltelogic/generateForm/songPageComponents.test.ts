import { describe, expect, test } from "vite-plus/test";

import Song from "../../../src/lib/models/Song.svelte";
import { buildSongPageComponents } from "../../../src/lib/logic/songs.svelte";

import PlayLink from "../../../src/lib/models/children/PlayLink.svelte";

import { ENUM_AI_WARNING_TYPE, ENUM_CW_STATES } from "../../../src/lib/models/enums";
import { getLanguageMetadata } from "../../../src/lib/utils/lyricsUtils";
import { mapLanguages } from "../../mapper";

describe("Generate song page components", () => {
  test("Empty state", () => {
    const song = new Song();
    const langMetadata = {
      headers: ["Original", "Romanized", "English"],
      needsRomanization: true,
      needsTranslation: true,
      isChinese: false,
      isoLangCode: null,
    };
    const res = buildSongPageComponents(song, langMetadata);
    expect(res).toEqual({
      displayTitle: "",
      sort: "",
      unavailable: "",
      cw: "",
      infobox: `{{Infobox Song
|songtitle = "''''''"
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = N/A
|link = N/A
|language = 
}}`,
    });
  });

  test.each([
    {
      d: "Questionable CW without no overview",
      i: {
        cwState: ENUM_CW_STATES.questionable,
        cwText: "",
      },
      o: {
        cw: "{{Questionable}}",
      },
    },
    {
      d: "Questionable CW with overview",
      i: {
        cwState: ENUM_CW_STATES.questionable,
        cwText: "suicidal themes",
      },
      o: {
        cw: "{{Questionable|suicidal themes}}",
      },
    },
    {
      d: "Epileptic CW",
      i: {
        hasEpilepsyWarning: true,
      },
      o: {
        cw: "{{Epilepsy}}",
      },
    },
    {
      d: "Epileptic CW + Questionable CW",
      i: {
        cwState: ENUM_CW_STATES.questionable,
        cwText: "suicidal themes",
        hasEpilepsyWarning: true,
      },
      o: {
        cw: "{{Epilepsy}}{{Questionable|suicidal themes}}",
      },
    },
    {
      d: "GenAI content - empty overview",
      i: {
        aiCwState: ENUM_AI_WARNING_TYPE.verified,
        aiWarningText1: "",
        aiWarningText2: "",
      },
      o: {
        cw: "{{AIusage||}}",
      },
    },
    {
      d: "Verified GenAI content",
      i: {
        aiCwState: ENUM_AI_WARNING_TYPE.verified,
        aiWarningText1: "music & lyrics",
        aiWarningText2: "video description",
      },
      o: {
        cw: "{{AIusage|music & lyrics|video description}}",
      },
    },
    {
      d: "Suspected GenAI content",
      i: {
        aiCwState: ENUM_AI_WARNING_TYPE.suspected,
        aiWarningText1: "illustration",
        aiWarningText2: "vibes are all over the place",
      },
      o: {
        cw: "{{AIusage|illustration|vibes are all over the place|unverified=1}}",
      },
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
      o: {
        cw: "{{Questionable|Theft}}{{AIusage|music & lyrics|video description}}",
      },
    },
  ])("Render content warnings - $d", ({ i, o: { cw: expectedCw } }) => {
    const song = new Song(i);
    const langMetadata = {
      headers: ["Original", "Romanized", "English"],
      needsRomanization: true,
      needsTranslation: true,
      isChinese: false,
      isoLangCode: null,
    };
    const res = buildSongPageComponents(song, langMetadata);
    expect(res).toEqual({
      displayTitle: "",
      sort: "",
      unavailable: "",
      cw: expectedCw,
      // no change in infobox
      infobox: `{{Infobox Song
|songtitle = "''''''"
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = N/A
|link = N/A
|language = 
}}`,
    });
  });

  test.each([
    {
      d: '"Is Unavailable?" option is checked',
      i: {
        isUnavailable: true,
      },
      o: {
        unavailable: "{{Unavailable}}",
      },
    },
  ])("Render unavailable content notice - $d", ({ i, o: { unavailable: expectedUnavailable } }) => {
    const song = new Song(i);
    const langMetadata = {
      headers: ["Original", "Romanized", "English"],
      needsRomanization: true,
      needsTranslation: true,
      isChinese: false,
      isoLangCode: null,
    };
    const res = buildSongPageComponents(song, langMetadata);
    expect(res).toEqual({
      displayTitle: "",
      sort: "",
      unavailable: expectedUnavailable,
      cw: "",
      // no change in infobox
      infobox: `{{Infobox Song
|songtitle = "''''''"
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = N/A
|link = N/A
|language = 
}}`,
    });
  });

  test.each([
    {
      d: "No language set (with romanization + English translation)",
      i: {
        origTitle: "あいうえお",
        romTitle: "Aiueo",
        engTitle: "ABCD",
        titleIsOfficiallyTranslated: false,
        languages: [],
      },
      o: {
        displayTitle: "",
        sort: "{{sort}}",
        infobox: `{{Infobox Song
|songtitle = "'''あいうえお'''"<br />Romanized: Aiueo<br />English: ABCD
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = N/A
|link = N/A
|language = 
}}`,
      },
    },
    {
      d: "No language set (with romanization + official English translation)",
      i: {
        origTitle: "あいうえお",
        romTitle: "Aiueo",
        engTitle: "ABCD",
        titleIsOfficiallyTranslated: true,
        languages: [],
      },
      o: {
        displayTitle: "",
        sort: "{{sort}}",
        infobox: `{{Infobox Song
|songtitle = "'''あいうえお'''"<br />Romanized: Aiueo<br />Official English: ABCD
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = N/A
|link = N/A
|language = 
}}`,
      },
    },
    {
      d: "No language set (with romanization)",
      i: {
        origTitle: "あいうえお",
        romTitle: "Aiueo",
        engTitle: "",
        languages: [],
      },
      o: {
        displayTitle: "",
        sort: "{{sort}}",
        infobox: `{{Infobox Song
|songtitle = "'''あいうえお'''"<br />Romanized: Aiueo
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = N/A
|link = N/A
|language = 
}}`,
      },
    },
    {
      d: "No language set (with English translation)",
      i: {
        origTitle: "あいうえお",
        romTitle: "",
        engTitle: "ABCD",
        languages: [],
      },
      o: {
        displayTitle: "",
        sort: "",
        infobox: `{{Infobox Song
|songtitle = "'''あいうえお'''"<br />English: ABCD
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = N/A
|link = N/A
|language = 
}}`,
      },
    },
    {
      d: "No language set (original title only)",
      i: {
        origTitle: "あいうえお",
        romTitle: "",
        engTitle: "",
        languages: [],
      },
      o: {
        displayTitle: "",
        sort: "",
        infobox: `{{Infobox Song
|songtitle = "'''あいうえお'''"
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = N/A
|link = N/A
|language = 
}}`,
      },
    },
    {
      d: "Title is lowercase first",
      i: {
        origTitle: "aiueo",
        romTitle: "",
        engTitle: "",
        languages: [],
      },
      o: {
        displayTitle: "{{Lowercase}}",
        sort: "",
        infobox: `{{Infobox Song
|songtitle = "'''aiueo'''"
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = N/A
|link = N/A
|language = 
}}`,
      },
    },
    {
      d: "Japanese language set with translated title",
      i: {
        origTitle: "あいうえお",
        romTitle: "Aiueo",
        engTitle: "ABCD",
        languages: mapLanguages("Japanese"),
      },
      o: {
        displayTitle: "",
        sort: "{{sort}}",
        infobox: `{{Infobox Song
|songtitle = "'''あいうえお'''"<br />Romaji: Aiueo<br />English: ABCD
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = N/A
|link = N/A
|language = Japanese
}}`,
      },
    },
    {
      d: "Japanese language set without translated title",
      i: {
        origTitle: "あいうえお",
        romTitle: "Aiueo",
        engTitle: "",
        languages: mapLanguages("Japanese"),
      },
      o: {
        displayTitle: "",
        sort: "{{sort}}",
        infobox: `{{Infobox Song
|songtitle = "'''あいうえお'''"<br />Romaji: Aiueo
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = N/A
|link = N/A
|language = Japanese
}}`,
      },
    },
    {
      d: "Indonesian language set with translated title",
      i: {
        origTitle: "Aiueo",
        romTitle: "MUST NOT SHOW",
        engTitle: "ABCD",
        languages: mapLanguages("Indonesian"),
      },
      o: {
        displayTitle: "",
        sort: "",
        infobox: `{{Infobox Song
|songtitle = "'''Aiueo'''"<br />English: ABCD
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = N/A
|link = N/A
|language = Indonesian
}}`,
      },
    },
    {
      d: "Indonesian language set without translated title",
      i: {
        origTitle: "Aiueo",
        romTitle: "MUST NOT SHOW",
        engTitle: "",
        languages: mapLanguages("Indonesian"),
      },
      o: {
        displayTitle: "",
        sort: "",
        infobox: `{{Infobox Song
|songtitle = "'''Aiueo'''"
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = N/A
|link = N/A
|language = Indonesian
}}`,
      },
    },
    {
      d: "English language set",
      i: {
        origTitle: "Aiueo",
        romTitle: "MUST NOT SHOW",
        engTitle: "MUST NOT SHOW HERE",
        languages: mapLanguages("English"),
      },
      o: {
        displayTitle: "",
        sort: "",
        infobox: `{{Infobox Song
|songtitle = "'''Aiueo'''"
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = N/A
|link = N/A
|language = English
}}`,
      },
    },
    {
      d: "Chinese language set with translated title",
      i: {
        origTitle: "好好好",
        romTitle: "Hǎo Hǎo Hǎo",
        engTitle: "ABCD",
        languages: mapLanguages("Mandarin"),
      },
      o: {
        displayTitle: "",
        sort: "{{sort}}",
        infobox: `{{Infobox Song
|songtitle = "'''好好好'''"<br />Pinyin: Hǎo Hǎo Hǎo<br />English: ABCD
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = N/A
|link = N/A
|language = Mandarin
}}`,
      },
    },
    {
      d: "Chinese language set with alt Traditional script",
      i: {
        origTitle: "过得好",
        altChTitle: "過得好",
        altChIsTraditional: true,
        romTitle: "Guò dé Hǎo",
        engTitle: "ABCD",
        languages: mapLanguages("Mandarin"),
      },
      o: {
        displayTitle: "",
        sort: "{{sort}}",
        infobox: `{{Infobox Song
|songtitle = "'''过得好'''"<br />Traditional Chinese: 過得好<br />Pinyin: Guò dé Hǎo<br />English: ABCD
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = N/A
|link = N/A
|language = Mandarin
}}`,
      },
    },
    {
      d: "Chinese language set with alt Simplified script",
      i: {
        origTitle: "過得好",
        altChTitle: "过得好",
        altChIsTraditional: false,
        romTitle: "Guò dé Hǎo",
        engTitle: "ABCD",
        languages: mapLanguages("Mandarin"),
      },
      o: {
        displayTitle: "",
        sort: "{{sort}}",
        infobox: `{{Infobox Song
|songtitle = "'''過得好'''"<br />Simplified Chinese: 过得好<br />Pinyin: Guò dé Hǎo<br />English: ABCD
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = N/A
|link = N/A
|language = Mandarin
}}`,
      },
    },
    {
      d: "Multiple languages set",
      i: {
        origTitle: "あいうえお",
        romTitle: "Aiueo",
        engTitle: "ABCD",
        languages: mapLanguages("Japanese", "English", "Spanish"),
      },
      o: {
        displayTitle: "",
        sort: "{{sort}}",
        infobox: `{{Infobox Song
|songtitle = "'''あいうえお'''"<br />Romaji: Aiueo<br />English: ABCD
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = N/A
|link = N/A
|language = Japanese;English;Spanish
}}`,
      },
    },
  ])(
    "Render title components & languages - $d",
    ({
      i,
      o: { displayTitle: expectedDisplayTitle, sort: expectedSort, infobox: expectedInfobox },
    }) => {
      const song = new Song(i);
      const langMetadata = getLanguageMetadata(i.languages);
      const res = buildSongPageComponents(song, langMetadata);
      expect(res).toEqual({
        displayTitle: expectedDisplayTitle,
        sort: expectedSort,
        unavailable: "",
        cw: "",
        infobox: expectedInfobox,
      });
    },
  );

  test.each([
    {
      d: "Simple case",
      i: {
        playLinks: [
          new PlayLink({
            site: "YouTube",
            url: "https://www.youtube.com/watch?v=12345678901",
            viewCount: "1000",
          }),
        ],
      },
      o: {
        infobox: `{{Infobox Song
|songtitle = "''''''"
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = 1,000+
|link = {{#|https://www.youtube.com/watch?v=12345678901}}
|language = 
}}`,
      },
    },
    {
      d: "Reprint",
      i: {
        playLinks: [
          new PlayLink({
            site: "YouTube",
            url: "https://www.youtube.com/watch?v=12345678901",
            viewCount: "1000",
            isReprint: true,
          }),
        ],
      },
      o: {
        infobox: `{{Infobox Song
|songtitle = "''''''"
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = N/A
|link = {{#|https://www.youtube.com/watch?v=12345678901|label=reprint}}
|language = 
}}`,
      },
    },
    {
      d: "Autogenerated topic by YT",
      i: {
        playLinks: [
          new PlayLink({
            site: "YouTube",
            url: "https://www.youtube.com/watch?v=12345678901",
            viewCount: "1000",
            isAutogen: true,
          }),
        ],
      },
      o: {
        infobox: `{{Infobox Song
|songtitle = "''''''"
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = 1,000+
|link = {{#|https://www.youtube.com/watch?v=12345678901|auto=y}}
|language = 
}}`,
      },
    },
    {
      d: "Removed",
      i: {
        playLinks: [
          new PlayLink({
            site: "YouTube",
            url: "https://www.youtube.com/watch?v=12345678901",
            viewCount: "1000",
            isDeleted: true,
          }),
        ],
      },
      o: {
        infobox: `{{Infobox Song
|songtitle = "''''''"
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = 1,000+
|link = {{#|https://www.youtube.com/watch?v=12345678901|label=deleted}}
|language = 
}}`,
      },
    },
    {
      d: "Deleted reprint",
      i: {
        playLinks: [
          new PlayLink({
            site: "YouTube",
            url: "https://www.youtube.com/watch?v=12345678901",
            viewCount: "1000",
            isReprint: true,
            isDeleted: true,
          }),
        ],
      },
      o: {
        infobox: `{{Infobox Song
|songtitle = "''''''"
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = N/A
|link = {{#|https://www.youtube.com/watch?v=12345678901|label=reprint, deleted}}
|language = 
}}`,
      },
    },
    {
      d: "Two links",
      i: {
        playLinks: [
          new PlayLink({
            site: "Niconico",
            url: "https://www.nicovideo.jp/watch/sm9714351",
            viewCount: "3000",
          }),
          new PlayLink({
            site: "YouTube",
            url: "https://www.youtube.com/watch?v=12345678901",
            viewCount: "2000",
          }),
        ],
      },
      o: {
        infobox: `{{Infobox Song
|songtitle = "''''''"
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = 3,000+ (NN), 2,000+ (YT)
|link = {{#|https://www.nicovideo.jp/watch/sm9714351}} {{#|https://www.youtube.com/watch?v=12345678901}}
|language = 
}}`,
      },
    },
    {
      d: "More complexity",
      i: {
        playLinks: [
          new PlayLink({
            site: "Niconico",
            url: "https://www.nicovideo.jp/watch/sm9714351",
            viewCount: "3000",
            isDeleted: true,
          }),
          new PlayLink({
            site: "YouTube",
            url: "https://www.youtube.com/watch?v=12345678901",
            viewCount: "2000",
            isAutogen: true,
          }),
          new PlayLink({
            site: "YouTube",
            url: "https://www.youtube.com/watch?v=12345678902",
            viewCount: "4000",
            isReprint: true,
          }),
        ],
      },
      o: {
        infobox: `{{Infobox Song
|songtitle = "''''''"
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = 
|producer = 
|#views = 3,000+ (NN), 2,000+ (YT)
|link = {{#|https://www.nicovideo.jp/watch/sm9714351|label=deleted}} {{#|https://www.youtube.com/watch?v=12345678901|auto=y}} {{#|https://www.youtube.com/watch?v=12345678902|label=reprint}}
|language = 
}}`,
      },
    },
  ])("Render links - $d", ({ i, o: { infobox: expectedInfobox } }) => {
    const song = new Song(i);
    const langMetadata = {
      headers: ["Original", "Romanized", "English"],
      needsRomanization: true,
      needsTranslation: true,
      isChinese: false,
      isoLangCode: null,
    };
    const res = buildSongPageComponents(song, langMetadata);
    expect(res).toEqual({
      displayTitle: "",
      sort: "",
      unavailable: "",
      cw: "",
      infobox: expectedInfobox,
    });
  });

  test("general information", () => {
    const song = new Song({
      singers: "[[Hatsune Miku (VOCALOID)]]\n<small>[[Kagamine Rin (VOCALOID)]]</small>",
      producers: "[[John Doe]] (music)\n[[Jack Doe]] (lyrics)\n[[Jane Doe]] (video)",
      description: "Line 1\nLine 2\n\nLine 3",
    });
    const langMetadata = {
      headers: ["Original", "Romanized", "English"],
      needsRomanization: true,
      needsTranslation: true,
      isChinese: false,
      isoLangCode: null,
    };
    const res = buildSongPageComponents(song, langMetadata);
    expect(res).toEqual({
      displayTitle: "",
      sort: "",
      unavailable: "",
      cw: "",
      infobox: `{{Infobox Song
|songtitle = "''''''"
|color = black; color:white
|original upload date = {{DateUnknown}}
|singer = [[Hatsune Miku (VOCALOID)]]<br /><small>[[Kagamine Rin (VOCALOID)]]</small>
|producer = [[John Doe]] (music)<br />[[Jack Doe]] (lyrics)<br />[[Jane Doe]] (video)
|#views = N/A
|link = N/A
|description = Line 1<br />Line 2<br /><br />Line 3
|language = 
}}`,
    });
  });
});