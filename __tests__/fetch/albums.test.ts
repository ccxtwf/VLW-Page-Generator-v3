import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fetchDataFromVocaDb } from "../../src/lib/logic/albums.svelte";
import { mapEngines, mapAlbumBroadcastLink } from "../mapper";
import ExternalLink from "../../src/lib/models/children/ExternalLink.svelte";
import { ENUM_IMAGE_EMBED_SOURCE_TYPE } from "../../src/lib/models/enums";
import AlbumTrackData from "../../src/lib/models/children/AlbumTrackData.svelte";

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

describe("fetchDataFromVocaDb - albums", () => {
  test("case 1", async () => {
    const json = readFileSync(resolve(__dirname, "./testDataVdbAlbum1.json"), {
      encoding: "utf-8",
      flag: "r",
    });
    const fetchMock = vi.fn().mockResolvedValue(new Response(json));

    vi.stubGlobal("fetch", fetchMock);

    const entity = await fetchDataFromVocaDb("https://vocadb.net/Al/21149");
    const expected = {
      origTitle: "Comic and Cosmic",
      romTitle: "",
      engTitle: "Comic and Cosmic",
      label: "KARENT",
      description: "an album by PinocchioP",
      isCompilationAlbum: false,
      publishedYear: "2016",
      publishedMonth: "December",
      publishedDay: "31",
      engines: mapEngines("VOCALOID", "AquesTone/AquesTalk"),
      vdbAlbumId: "21149",
      vocaWikiPage: "Comic and Cosmic",
      categoriesRaw: "",
      tracklist: [
        new AlbumTrackData({
          discNo: 1,
          trackNo: 1,
          pageTitle: "Floating Shelter",
          producerCredit: "PinocchioP",
          singerCredit: "[[Hatsune Miku (VOCALOID)]]",
        }),
        new AlbumTrackData({
          discNo: 1,
          trackNo: 2,
          pageTitle: "からっぽのまにまに",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 1,
          trackNo: 3,
          pageTitle: "ユメネコ",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku and [[Yuzuki Yukari (VOCALOID)]]",
        }),
        new AlbumTrackData({
          discNo: 1,
          trackNo: 4,
          pageTitle: "tel tel",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 1,
          trackNo: 5,
          pageTitle: "OZ",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 1,
          trackNo: 6,
          pageTitle: "腐れ外道とチョコレゐト",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 1,
          trackNo: 7,
          pageTitle: "とうめい",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 1,
          trackNo: 8,
          pageTitle: "人間なんか大嫌い",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 1,
          trackNo: 9,
          pageTitle: "恋するミュータント",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 1,
          trackNo: 10,
          pageTitle: "はっぴーべりーはっぴー",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 1,
          trackNo: 11,
          pageTitle: "Paraíso",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 1,
          trackNo: 12,
          pageTitle: "アイマイナ",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 1,
          trackNo: 13,
          pageTitle: "さよなら、たましいさん",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 1,
          trackNo: 14,
          pageTitle: "どうしてちゃんのテーマ",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 1,
          trackNo: 15,
          pageTitle: "マンネリズム",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        /* DISC 2 */
        new AlbumTrackData({
          discNo: 2,
          trackNo: 1,
          pageTitle: "ぼくも屑だから",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku and [[AquesTalk Josei 1]]",
        }),
        new AlbumTrackData({
          discNo: 2,
          trackNo: 2,
          pageTitle: "胸いっぱいのダメを",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 2,
          trackNo: 3,
          pageTitle: "ニナ",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 2,
          trackNo: 4,
          pageTitle: "週刊少年バイバイ",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 2,
          trackNo: 5,
          pageTitle: "m/es",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 2,
          trackNo: 6,
          pageTitle: "アッカンベーダ -miku ver.-",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 2,
          trackNo: 7,
          pageTitle: "こどものしくみ",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 2,
          trackNo: 8,
          pageTitle: "ストレンジアニマル",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 2,
          trackNo: 9,
          pageTitle: "かえるたちのうた",
          producerCredit: "PinocchioP",
          singerCredit: "[[Kagamine Rin (VOCALOID)]]",
        }),
        new AlbumTrackData({
          discNo: 2,
          trackNo: 10,
          pageTitle: "遊星まっしらけ",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 2,
          trackNo: 11,
          pageTitle: "ひとりぼっちのユーエフオー",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 2,
          trackNo: 12,
          pageTitle: "忘れちゃったのどうして",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 2,
          trackNo: 13,
          pageTitle: "ゲームスペクター2",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 2,
          trackNo: 14,
          pageTitle: "スケベニンゲン",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 2,
          trackNo: 15,
          pageTitle: "たのしいホームワーク",
          producerCredit: "PinocchioP",
          singerCredit: "Hatsune Miku",
        }),
      ],
      broadcastLinks: mapAlbumBroadcastLink(
        { key: "nn-xfade", url: "https://www.nicovideo.jp/watch/sm30228946" },
        { key: "yt-xfade", url: "https://www.youtube.com/watch?v=in90fSCxGKs" },
        { key: "sp-embed", url: "https://open.spotify.com/album/3Ydz6UhhXxgsoj36DKSv9L" },
        {
          key: "yt-playlist",
          url: "https://music.youtube.com/playlist?list=OLAK5uy_lEg6rOZGRgRKv5_aXH7mI2jwdL6xDJEB4",
        },
      ),
      extLinks: [
        new ExternalLink({
          url: "https://www.nicovideo.jp/watch/sm30228946",
          description: "Album crossfade - Niconico",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://www.youtube.com/watch?v=in90fSCxGKs",
          description: "Album crossfade - YouTube",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "http://pinocchiop.com/news/287",
          description: "Website (Announcement)",
          isOfficial: false,
        }),
        new ExternalLink({
          url: "https://www.amazon.co.jp/dp/B01NAKFKSA/",
          description: "Amazon",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://pinocchiop.booth.pm/items/390002",
          description: "BOOTH",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "http://karent.jp/album/2019",
          description: "KARENT",
          isOfficial: true,
          isInactive: true,
        }),
        new ExternalLink({
          url: "https://itunes.apple.com/jp/album/comic-and-cosmic/id1202806805?app=itunes",
          description: "iTunes (JP)",
          isOfficial: true,
          isInactive: true,
        }),
        new ExternalLink({
          url: "https://www.amazon.co.jp/%E3%83%94%E3%83%8E%E3%82%AD%E3%82%AA%E3%83%94%E3%83%BC/dp/B079JYF54G/",
          description: "AmazonMP3",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "http://pinocchiop.com/discography/300",
          description: "Website",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://linkco.re/qg9GzCa3",
          description: "TuneCore",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://itunes.apple.com/jp/album/1343834465",
          description: "iTunes (JP)",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://itunes.apple.com/us/album/1343834465",
          description: "iTunes (US)",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://open.spotify.com/album/3Ydz6UhhXxgsoj36DKSv9L",
          description: "Spotify",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://music.youtube.com/playlist?list=OLAK5uy_lEg6rOZGRgRKv5_aXH7mI2jwdL6xDJEB4",
          description: "YouTube Music",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://pinocchiop.bandcamp.com/album/comic-and-cosmic",
          description: "Bandcamp",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://vocaloid.fandom.com/wiki/Comic_and_Cosmic",
          description: "VOCALOID Wiki",
          isOfficial: false,
        }),
        new ExternalLink({
          url: "https://music.line.me/webapp/album/mb00000000015cb0ba",
          description: "LINE MUSIC",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://www.amazon.com/music/player/albums/B079K4V8N9",
          description: "Amazon (US)",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://music.oricon.co.jp/php/cd/CdTop.php?cd=SPC01931081",
          description: "ORICON MUSIC",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://www.kkbox.com/tw/tc/album/8qOCVLvFOgKctLgRxP",
          description: "KKBOX",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://dmusic.docomo.ne.jp/album/A2001164597",
          description: "dmusic.docomo",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://music.tower.jp/album/detail/1009476937",
          description: "TOWER RECORDS MUSIC",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://recochoku.jp/album/A2001164597",
          description: "recochoku",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://www.deezer.com/en/album/78951802",
          description: "Deezer",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://s.awa.fm/album/09d394f32c13d2d07b76",
          description: "AWA",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://ototoy.jp/_/default/p/94998",
          description: "OTOTOY",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://musicstore.auone.jp/s/album/2001164597/ALBUM",
          description: "Music Store",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://mysound.jp/album/202514/",
          description: "MySound",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://mora.jp/package/43000074/TCJPR0000418438/",
          description: "mora",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://dhits.docomo.ne.jp/music/1009476938",
          description: "dhits.docomo",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://open.spotify.com/album/0rclMLKSwOEJ9I7xauRFbF",
          description: "Spotify",
          isOfficial: true,
        }),
        new ExternalLink({
          url: "https://tidal.com/album/321058292",
          description: "TIDAL",
          isOfficial: true,
        }),
      ],
      image: {
        type: ENUM_IMAGE_EMBED_SOURCE_TYPE.vdb,
        src: "https://static.vocadb.net/img/Album/mainOrig/21149.jpg?v=37",
        alt: "Album cover image on VocaDB",
      },
    };

    expect(entity).toEqual(expected);
    expect(entity.tracklist.map((el) => el.toJSON())).toEqual(
      expected.tracklist.map((el) => el.toJSON()),
    );
    expect(entity.broadcastLinks.map((el) => el.toJSON())).toEqual(
      expected.broadcastLinks.map((el) => el.toJSON()),
    );
    expect(entity.extLinks.map((el) => el.toJSON())).toEqual(
      expected.extLinks.map((el) => el.toJSON()),
    );

    expect(fetchMock).toHaveBeenCalledWith(
      `https://vocadb.net/api/albums/21149?fields=MainPicture%2CNames%2CPVs%2CArtists%2CTracks%2CWebLinks&songFields=Artists&lang=English&origin=${process.env.VITE_REFER_FROM_ORIGIN}`,
    );
  });

  test("case 2", async () => {
    const json = readFileSync(resolve(__dirname, "./testDataVdbAlbum2.json"), {
      encoding: "utf-8",
      flag: "r",
    });
    const fetchMock = vi.fn().mockResolvedValue(new Response(json));

    vi.stubGlobal("fetch", fetchMock);

    const entity = await fetchDataFromVocaDb("https://vocadb.net/Al/51089");
    const expected = {
      origTitle: "初音ミク「マジカルミライ 2025」ライブ音源CD",
      romTitle: 'Hatsune Miku "Magical Mirai 2025" Live Ongen CD',
      engTitle: "Hatsune Miku Magical Mirai 2025 Live CD",
      label: "Crypton Future Media",
      description: "a compilation album",
      isCompilationAlbum: true,
      publishedYear: "2026",
      publishedMonth: "February",
      publishedDay: "4",
      engines: mapEngines("VOCALOID", "Piapro Studio"),
      vdbAlbumId: "51089",
      vocaWikiPage: "",
      categoriesRaw: "",
      tracklist: [
        new AlbumTrackData({
          discNo: 1,
          trackNo: 1,
          pageTitle: "メテオ",
          producerCredit: "John",
          singerCredit: "[[Hatsune Miku (VOCALOID)]]",
        }),
        new AlbumTrackData({
          discNo: 1,
          trackNo: 2,
          pageTitle: "Flyway",
          producerCredit: "halyosy",
          singerCredit: "[[Kagamine Len (VOCALOID)]] and [[KAITO]]",
        }),
        new AlbumTrackData({
          discNo: 1,
          trackNo: 3,
          pageTitle: "黙ってロックをやれって言ってんの！",
          producerCredit: "Nekotachi Kotatsu",
          singerCredit:
            "[[Hatsune Miku (Piapro Studio)]], [[Megurine Luka]], [[MEIKO]] and [[Kagamine Rin (VOCALOID)]]",
        }),
        new AlbumTrackData({
          discNo: 1,
          trackNo: 4,
          pageTitle: "ストリートライト",
          producerCredit: "Negi ShowerP",
          singerCredit: "Hatsune Miku, Megurine Luka, Kagamine Rin, Kagamine Len, KAITO and MEIKO",
        }),
        new AlbumTrackData({
          discNo: 1,
          trackNo: 5,
          pageTitle: "ラストラス",
          producerCredit: "*Luna",
          singerCredit: "Hatsune Miku",
        }),
      ],
      broadcastLinks: mapAlbumBroadcastLink(),
      extLinks: [
        new ExternalLink({
          url: "https://x.com/magicalmirai/status/1995055199832969385/photo/1",
          description: "X (Twitter)",
          isOfficial: true,
        }),
      ],
      image: {
        type: ENUM_IMAGE_EMBED_SOURCE_TYPE.vdb,
        src: "https://static.vocadb.net/img/Album/mainOrig/51089.jpg?v=9",
        alt: "Album cover image on VocaDB",
      },
    };

    expect(entity).toEqual(expected);
    expect(entity.tracklist.map((el) => el.toJSON())).toEqual(
      expected.tracklist.map((el) => el.toJSON()),
    );
    expect(entity.broadcastLinks.map((el) => el.toJSON())).toEqual(
      expected.broadcastLinks.map((el) => el.toJSON()),
    );
    expect(entity.extLinks.map((el) => el.toJSON())).toEqual(
      expected.extLinks.map((el) => el.toJSON()),
    );

    expect(fetchMock).toHaveBeenCalledWith(
      `https://vocadb.net/api/albums/51089?fields=MainPicture%2CNames%2CPVs%2CArtists%2CTracks%2CWebLinks&songFields=Artists&lang=English&origin=${process.env.VITE_REFER_FROM_ORIGIN}`,
    );
  });
});