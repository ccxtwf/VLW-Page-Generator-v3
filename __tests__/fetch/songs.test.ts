import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fetchDataFromVocaDb } from "../../src/lib/logic/songs.svelte";
import {
  ENUM_AI_WARNING_TYPE,
  ENUM_CW_STATES,
  ENUM_IMAGE_EMBED_SOURCE_TYPE,
} from "../../src/lib/models/enums";
import { mapLanguages } from "../mapper";
import PlayLink from "../../src/lib/models/children/PlayLink.svelte";
import ExternalLink from "../../src/lib/models/children/ExternalLink.svelte";

// Mock import
vi.mock("../../src/lib/utils/dbBufferUtils", async () => {
  return {
    getDbBuffer: vi.fn().mockImplementation(async () => {
      const dbFile = readFileSync(resolve(__dirname, "../../public/synths.db"));
      const arrayBuffer = dbFile.buffer.slice(
        dbFile.byteOffset,
        dbFile.byteOffset + dbFile.byteLength,
      );
      return arrayBuffer;
    }),
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

declare const __dirname: string;

describe("fetchDataFromVocaDb - songs", () => {
  test("case 1", async () => {
    const json = readFileSync(resolve(__dirname, "./testDataVdbSong1.json"), {
      encoding: "utf-8",
      flag: "r",
    });
    const fetchMock = vi.fn().mockResolvedValue(new Response(json));

    vi.stubGlobal("fetch", fetchMock);

    const entity = await fetchDataFromVocaDb("https://vocadb.net/S/1501");
    const expected = {
      aiCwState: ENUM_AI_WARNING_TYPE.none,
      aiWarningText1: "",
      aiWarningText2: "",
      cwState: ENUM_CW_STATES.noWarnings,
      cwText: "",
      hasEpilepsyWarning: false,
      languages: mapLanguages("Japanese"),
      isoLangCode: "",
      origTitle: "ローリンガール",
      altChTitle: "",
      altChIsTraditional: false,
      romTitle: "",
      engTitle: "Rollin' Girl",
      titleIsOfficiallyTranslated: false,
      uploadDateRaw: "2010-02-14",
      isAlbumOnly: false,
      isUnavailable: false,
      singers: "[[Hatsune Miku (VOCALOID)]]\n<small>[[GUMI (VOCALOID)]]</small>",
      producers: "wowaka (music, lyrics, illustration)",
      description: "",
      translator: "",
      isOfficialTranslation: false,
      categoriesRaw: "",
      lyrics: [],
      playLinks: [
        new PlayLink({
          site: "Niconico",
          url: "https://www.nicovideo.jp/watch/sm9714351",
          isReprint: false,
          isAutogen: false,
          isDeleted: false,
        }),
        new PlayLink({
          site: "YouTube",
          url: "https://www.youtube.com/watch?v=vnw8zURAxkU",
          isReprint: false,
          isAutogen: false,
          isDeleted: false,
        }),
        new PlayLink({
          site: "SoundCloud",
          url: "https://soundcloud.com/hatsune_uke/hatsune-miku-rolling-girl",
          isReprint: true,
          isAutogen: false,
          isDeleted: false,
        }),
      ],
      extLinks: [
        new ExternalLink({
          url: "https://vocadb.net/S/1501",
          description: "VocaDB",
          isOfficial: false,
        }),
        new ExternalLink({
          url: "https://dic.nicovideo.jp/v/sm9714351",
          description: "NicoNicoPedia",
          isOfficial: false,
        }),
        new ExternalLink({
          url: "http://utaitedb.net/S/2860",
          description: "UtaiteDB",
          isOfficial: false,
        }),
        new ExternalLink({
          url: "https://w.atwiki.jp/hmiku/pages/8759.html",
          description: "Hatsune Miku Wiki",
          isOfficial: false,
        }),
        new ExternalLink({
          url: "https://vocaloid.fandom.com/wiki/ローリンガール_(Rolling_Girl)",
          description: "Vocaloid Wiki",
          isOfficial: false,
        }),
        new ExternalLink({
          url: "https://vocaloidlyrics.miraheze.org/wiki/ローリンガール_(Rolling_Girl)",
          description: "Vocaloid Lyrics Wiki",
          isOfficial: false,
        }),
        new ExternalLink({
          url: "https://dic.pixiv.net/a/ローリンガール",
          description: "Pixiv Encyclopedia",
          isOfficial: false,
        }),
        new ExternalLink({
          url: "https://www.pixiv.net/artworks/10324371",
          description: "Pixiv (Illustration)",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://zh.moegirl.org/Rolling_Girl",
          description: "Moegirlpedia",
          isOfficial: false,
        }),
        new ExternalLink({
          url: "https://musicbrainz.org/recording/fc4d953f-ba3e-4b28-a08d-e8c41099dca5",
          description: "MusicBrainz (recording)",
          isOfficial: false,
        }),
        new ExternalLink({
          url: "https://namu.wiki/w/롤링 걸",
          description: "Namu Wiki",
          isOfficial: false,
        }),
        new ExternalLink({
          url: "https://projectsekai.fandom.com/wiki/Rolling_Girl",
          description: "Project SEKAI Wiki",
          isOfficial: false,
        }),
        new ExternalLink({
          url: "https://www.sekaipedia.org/wiki/Rollin'_Girl",
          description: "Sekaipedia",
          isOfficial: false,
        }),
        new ExternalLink({
          url: "https://remywiki.com/Rolling_girl",
          description: "RemyWiki",
          isOfficial: false,
        }),
        new ExternalLink({
          url: "https://piapro.jp/content/oxbdzzrokaaqzcwp",
          description: "Piapro (Instrumental)",
          isOfficial: true,
          isInactive: true,
        }),
      ],
      images: [
        {
          type: ENUM_IMAGE_EMBED_SOURCE_TYPE.nn,
          src: `https://nicovideo.cdn.nimg.jp/thumbnails/9714351/9714351.L`,
          alt: "Niconico thumbnail",
        },
        {
          type: ENUM_IMAGE_EMBED_SOURCE_TYPE.yt,
          src: `https://i.ytimg.com/vi/vnw8zURAxkU/maxresdefault.jpg`,
          alt: "YouTube thumbnail",
        },
      ],
    };

    expect(entity).toMatchObject(expected);
    expect(entity.playLinks.map((el) => el.toJSON())).toEqual(
      expected.playLinks.map((el) => el.toJSON()),
    );
    expect(entity.extLinks.map((el) => el.toJSON())).toEqual(
      expected.extLinks.map((el) => el.toJSON()),
    );

    expect(fetchMock).toHaveBeenCalledWith(
      `https://vocadb.net/api/songs/1501?fields=Artists%2CNames%2CPVs%2CWebLinks%2CCultureCodes&lang=English&origin=${process.env.VITE_REFER_FROM_ORIGIN}`,
    );
  });

  test("case 2", async () => {
    const json = readFileSync(resolve(__dirname, "./testDataVdbSong2.json"), {
      encoding: "utf-8",
      flag: "r",
    });
    const fetchMock = vi.fn().mockResolvedValue(new Response(json));

    vi.stubGlobal("fetch", fetchMock);

    const entity = await fetchDataFromVocaDb("https://vocadb.net/S/276852");
    const expected = {
      aiCwState: ENUM_AI_WARNING_TYPE.none,
      aiWarningText1: "",
      aiWarningText2: "",
      cwState: ENUM_CW_STATES.noWarnings,
      cwText: "",
      hasEpilepsyWarning: false,
      languages: mapLanguages("Mandarin"),
      isoLangCode: "",
      origTitle: "木兰行",
      altChTitle: "",
      altChIsTraditional: false,
      romTitle: "Mùlán Háng",
      engTitle: "Ballad of Mulan",
      titleIsOfficiallyTranslated: false,
      uploadDateRaw: "2020-04-01",
      isAlbumOnly: false,
      isUnavailable: false,
      singers: "[[Cangqiong (Synthesizer V)]]\n<small>[[Chiyu]]</small>",
      producers:
        "Coordinate-P (tuning)\nMzf Xiaomu (arrangement)\nMOCHI IMAGE (PV)\nErhu Mei (instruments)\nKBShinya (music)\n酒绛子 (illustration)\n喜八斤 (illustration)\n囚牛 (instruments)\nRiyo (instruments)\n原生不在 (illustration)\n骆栖淮 (lyrics)\nMr. Cengjing (mix)",
      description: "",
      translator: "",
      isOfficialTranslation: false,
      categoriesRaw: "",
      lyrics: [],
      playLinks: [
        new PlayLink({
          site: "bilibili",
          url: "https://www.bilibili.com/video/BV1Gg4y1a7vg",
          isReprint: false,
          isAutogen: false,
          isDeleted: false,
        }),
        new PlayLink({
          site: "YouTube",
          url: "https://www.youtube.com/watch?v=c-ySybwtJxc",
          isReprint: true,
          isAutogen: false,
          isDeleted: false,
        }),
      ],
      extLinks: [
        new ExternalLink({
          url: "https://vocadb.net/S/276852",
          description: "VocaDB",
          isOfficial: false,
        }),
        new ExternalLink({
          url: "https://music.163.com/#/song?id=1436879629",
          description: "NCM Song Release",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://open.spotify.com/track/2Imuj7wNo9J1EVdNWcXXmB",
          description: "Spotify",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://music.163.com/#/song?id=1436879980",
          description: "NCM Song Release (Instrumental)",
          isOfficial: true,
        }),
      ],
      images: [],
    };

    expect(entity).toMatchObject(expected);
    expect(entity.playLinks.map((el) => el.toJSON())).toEqual(
      expected.playLinks.map((el) => el.toJSON()),
    );
    expect(entity.extLinks.map((el) => el.toJSON())).toEqual(
      expected.extLinks.map((el) => el.toJSON()),
    );

    expect(fetchMock).toHaveBeenCalledWith(
      `https://vocadb.net/api/songs/276852?fields=Artists%2CNames%2CPVs%2CWebLinks%2CCultureCodes&lang=English&origin=${process.env.VITE_REFER_FROM_ORIGIN}`,
    );
  });
});