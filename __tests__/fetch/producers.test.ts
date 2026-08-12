import { afterEach, describe, expect, test, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fetchDataFromVocaDb } from "../../src/lib/logic/producers.svelte";
import ExternalLinkForProducerPage from "../../src/lib/models/children/ExternalLinkForProducerPage.svelte";
import { ENUM_IMAGE_EMBED_SOURCE_TYPE } from "../../src/lib/models/enums";

afterEach(() => {
  vi.restoreAllMocks();
});

declare const __dirname: string;

describe("fetchDataFromVocaDb - producers", () => {
  test("case 1", async () => {
    const json = readFileSync(resolve(__dirname, "./testDataVdbProducer1.json"), {
      encoding: "utf-8",
      flag: "r",
    });
    const fetchMock = vi.fn().mockResolvedValue(new Response(json));

    vi.stubGlobal("fetch", fetchMock);

    const entity = await fetchDataFromVocaDb("https://vocadb.net/Ar/28");
    const expected = {
      prodCategory: "PinocchioP",
      splitAlbum: false,
      prodAliases: "",
      affiliations: "GASCONRO\nFunuke",
      labels: "KARENT\nU/M/A/A",
      languages: [],
      engines: [],
      description: "'''PinocchioP''' is a vocal synth producer.",
      roles: {
        composer: false,
        lyricist: false,
        tuner: false,
        illustrator: false,
        animator: false,
        arranger: false,
        instrumentalist: false,
        mixer: false,
        masterer: false,
      },
      extLinks: [
        new ExternalLinkForProducerPage({
          url: "https://vocadb.net/Ar/28",
          description: "VocaDB",
          isOfficial: false,
          isMedia: false,
        }),
        new ExternalLinkForProducerPage({
          url: "https://w.atwiki.jp/hmiku/pages/4671.html",
          description: "Hatsune Miku Wiki",
          isOfficial: false,
          isMedia: false,
        }),
        new ExternalLinkForProducerPage({
          url: "https://www.nicovideo.jp/mylist/11284855",
          description: "NND MyList",
          isOfficial: true,
          isMedia: true,
        }),
        new ExternalLinkForProducerPage({
          url: "https://www.nicovideo.jp/mylist/14716117",
          description: "NND MyList (collabs)",
          isOfficial: true,
          isMedia: true,
        }),
        new ExternalLinkForProducerPage({
          url: "https://piapro.jp/pinokiop",
          description: "Piapro",
          isOfficial: true,
          isMedia: true,
        }),
        new ExternalLinkForProducerPage({
          url: "https://karent.jp/artist/pp000236",
          description: "KARENT",
          isOfficial: true,
          isMedia: true,
        }),
        new ExternalLinkForProducerPage({
          url: "https://x.com/pinocchiop",
          description: "Twitter",
          isOfficial: true,
          isMedia: false,
        }),
        new ExternalLinkForProducerPage({
          url: "https://www.pixiv.net/member.php?id=1746464",
          description: "Pixiv",
          isOfficial: true,
          isMedia: true,
        }),
        new ExternalLinkForProducerPage({
          url: "https://www.nicovideo.jp/user/865591",
          description: "NND Account",
          isOfficial: true,
          isMedia: true,
        }),
        new ExternalLinkForProducerPage({
          url: "https://utaitedb.net/Ar/1525",
          description: "UtaiteDB",
          isOfficial: false,
          isMedia: false,
        }),
        new ExternalLinkForProducerPage({
          url: "https://www.facebook.com/pinocchiop.official",
          description: "Facebook",
          isOfficial: true,
          isMedia: false,
        }),
        new ExternalLinkForProducerPage({
          url: "https://dic.nicovideo.jp/a/ピノキオP",
          description: "NicoNicoPedia",
          isOfficial: false,
          isMedia: false,
        }),
        new ExternalLinkForProducerPage({
          url: "https://vocaloid.wikia.com/wiki/Pinocchio-P",
          description: "Vocaloid Wiki",
          isOfficial: false,
          isMedia: false,
        }),
        new ExternalLinkForProducerPage({
          url: "https://pinocchiop.com/",
          description: "Website",
          isOfficial: true,
          isMedia: false,
        }),
        new ExternalLinkForProducerPage({
          url: "https://pinocchiop.booth.pm/",
          description: "BOOTH",
          isOfficial: true,
          isMedia: true,
        }),
        new ExternalLinkForProducerPage({
          url: "https://space.bilibili.com/203655966/#!/",
          description: "Bilibili",
          isOfficial: true,
          isMedia: true,
        }),
        new ExternalLinkForProducerPage({
          url: "https://weibo.com/u/6356534323",
          description: "Weibo",
          isOfficial: true,
          isMedia: false,
        }),
        new ExternalLinkForProducerPage({
          url: "https://play.spotify.com/artist/3b7jPCedJ2VH4l4rcOTvNC",
          description: "Spotify",
          isOfficial: true,
          isMedia: true,
        }),
        new ExternalLinkForProducerPage({
          url: "https://www.youtube.com/user/pinocchiopchannel",
          description: "YouTube Channel (Custom - user)",
          isOfficial: true,
          isMedia: true,
        }),
        new ExternalLinkForProducerPage({
          url: "https://www.instagram.com/pinocchiop_official/",
          description: "Instagram",
          isOfficial: true,
          isMedia: false,
        }),
        new ExternalLinkForProducerPage({
          url: "https://www.youtube.com/channel/UCA-uf3L3crYzMsSbqRRLMwg",
          description: "YouTube Channel [DAIHAKKEN]",
          isOfficial: true,
          isMedia: true,
        }),
        new ExternalLinkForProducerPage({
          url: "https://x.com/KudoDaihakken",
          description: "Twitter [DAIHAKKEN]",
          isOfficial: true,
          isMedia: false,
        }),
        new ExternalLinkForProducerPage({
          url: "https://www.youtube.com/channel/UCMMBGMjrrWcRZmG_lW4jC-Q",
          description: "YouTube Channel",
          isOfficial: true,
          isMedia: true,
        }),
        new ExternalLinkForProducerPage({
          url: "https://pinocchiop.bandcamp.com/",
          description: "Bandcamp",
          isOfficial: true,
          isMedia: true,
        }),
        new ExternalLinkForProducerPage({
          url: "https://www.tunecore.co.jp/artists/pinocchiop",
          description: "TuneCore Japan",
          isOfficial: true,
          isMedia: false,
        }),
        new ExternalLinkForProducerPage({
          url: "https://zh.wikipedia.org/zh-hans/匹诺曹P",
          description: "Wikipedia (CH)",
          isOfficial: false,
          isMedia: false,
        }),
        new ExternalLinkForProducerPage({
          url: "https://bsky.app/profile/pinocchiop.bsky.social",
          description: "Bluesky",
          isOfficial: true,
          isMedia: false,
        }),
        new ExternalLinkForProducerPage({
          url: "https://soundcloud.com/pinocchiop-music",
          description: "SoundCloud",
          isOfficial: true,
          isMedia: true,
        }),
        new ExternalLinkForProducerPage({
          url: "https://ja.wikipedia.org/wiki/ピノキオピー",
          description: "Wikipedia (JP)",
          isOfficial: false,
          isMedia: false,
        }),
        new ExternalLinkForProducerPage({
          url: "https://en.wikipedia.org/wiki/PinocchioP",
          description: "Wikipedia (EN)",
          isOfficial: false,
          isMedia: false,
        }),
        new ExternalLinkForProducerPage({
          url: "https://www.youtube.com/@pinocchiop",
          description: "YouTube Channel (Custom - @)",
          isOfficial: true,
          isMedia: false,
        }),
      ],
      image: {
        type: ENUM_IMAGE_EMBED_SOURCE_TYPE.vdb,
        src: "https://static.vocadb.net/img/Artist/mainOrig/28.jpg?v=40",
        alt: "Producer cover image on VocaDB",
      },
    };

    expect(entity).toEqual(expected);
    expect(entity.extLinks.map((el) => el.toJSON())).toEqual(
      expected.extLinks.map((el) => el.toJSON()),
    );

    expect(fetchMock).toHaveBeenCalledWith(
      `https://vocadb.net/api/artists/28?fields=AdditionalNames%2CMainPicture%2CDescription%2CArtistLinks%2CWebLinks&lang=English&origin=${process.env.VITE_REFER_FROM_ORIGIN}`,
    );
  });
});
