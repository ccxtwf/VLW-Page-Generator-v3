import { afterEach, describe, expect, test, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fetchDataFromVocaDb, fetchDiscographyFromVlw } from "../../src/lib/logic/producers.svelte";
import ExternalLinkForProducerPage from "../../src/lib/models/children/ExternalLinkForProducerPage.svelte";
import { ENUM_IMAGE_EMBED_SOURCE_TYPE } from "../../src/lib/models/enums";
import ProducerDiscographySongItem from "../../src/lib/models/children/ProducerDiscographySongItem.svelte";
import ProducerDiscographyAlbumItem from "../../src/lib/models/children/ProducerDiscographyAlbumItem.svelte";

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

describe("fetchDiscographyFromVlw", () => {
  test("case 1", async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      const subcat = url.match(/&g?cmtitle=([^&/]+)/)![1];
      const dictFilename: Record<string, string> = {
        "Category%3AZhuan+Chang+Langren+songs+list": "./testDataVlwSongs1.json",
        "Category%3AZhuan+Chang+Langren+songs+list%2FAlbums": "./testDataVlwAlbums1.json",
        "Category%3AZhuan+Chang+Langren+songs+list%2FArrangement": "./testDataVlwSongs1-arr.json",
        "Category%3AZhuan+Chang+Langren+songs+list%2FLyrics": "./testDataVlwSongs1-lyrics.json",
        "Category%3AZhuan+Chang+Langren+songs+list%2FOther": "./testDataVlwSongs1-other.json",
        "Category%3AZhuan+Chang+Langren+songs+list%2FTuning": "./testDataVlwSongs1-tune.json",
        "Category%3AZhuan+Chang+Langren+songs+list%2FVisuals": "./testDataVlwSongs1-vis.json",
      };
      let filename = dictFilename[subcat];
      if (!filename) {
        return new Response(null, { status: 400 });
      }
      const json = readFileSync(resolve(__dirname, filename), {
        encoding: "utf-8",
        flag: "r",
      });
      return new Response(json);
    });

    vi.stubGlobal("fetch", fetchMock);

    const entity = await fetchDiscographyFromVlw("Zhuan Chang Langren");

    const cats = [
      "Category%3AZhuan+Chang+Langren+songs+list",
      "Category%3AZhuan+Chang+Langren+songs+list%2FArrangement",
      "Category%3AZhuan+Chang+Langren+songs+list%2FLyrics",
      "Category%3AZhuan+Chang+Langren+songs+list%2FOther",
      "Category%3AZhuan+Chang+Langren+songs+list%2FTuning",
      "Category%3AZhuan+Chang+Langren+songs+list%2FVisuals",
    ];
    for (const cat of cats) {
      expect(fetchMock).toHaveBeenCalledWith(
        `https://vocaloidlyrics.miraheze.org/w/api.php?action=query&format=json&list=categorymembers&cmtitle=${cat}&cmprop=title%7Csortkeyprefix&cmlimit=500&cmtype=page%7Csubcat&cmsort=sortkey&cmdir=ascending&origin=*`,
      );
    }
    expect(fetchMock).toHaveBeenCalledWith(
      `https://vocaloidlyrics.miraheze.org/w/api.php?action=query&format=json&generator=categorymembers&indexpageids=true&gcmtitle=Category%3AZhuan+Chang+Langren+songs+list%2FAlbums&prop=categories&gcmlimit=500&cllimit=500&clcategories=Category%3ACompilation_albums&gcmnamespace=0&gcmsort=sortkey&gcmdir=ascending&origin=*`,
    );

    const expectedSongs = [
      "爱琴海的守望者 (Aegean Hǎi de Shǒuwàngzhě)",
      "白学旋律 (Bái Xué Xuánlǜ)",
      "暴雨梨花 (Bàoyǔ Líhuā)",
      "不待月 (Bùdài Yuè)",
      "残月雪 (Cányuè Xuě)",
      "长夜雨 (Chángyè Yǔ)",
      "尘华 (Chén Huá)",
      "尘梦吟 (Chén Mèng Yín)",
      "春渡芳情 (Chūn Dù Fāng Qíng)",
      "春鲤 (Chūn Lǐ)",
      "大家集合吧 (Dàjiā Jíhé ba)",
      "灯火华夏 (Dēnghuǒ Huáxià)",
      "反抗之城 (Fǎnkàng zhī Chéng)",
      "绯色圆舞曲 (Fēi Sè Yuánwǔqǔ)",
      "封刀不为峥嵘 (Fēng Dāo Bù Wéi Zhēngróng)",
      "枫神赋 (Fēng Shén Fù)",
      "丰壤 (Fēngrǎng)",
      "浮生千万绪 (Fúshēng Qiānwàn Xù)",
      "浮生酒馆 (Fúshēng Jiǔguǎn)",
      "各相忘 (Gè Xiāng Wàng)",
      "光 (Guāng)/Zhuan Chang Langren",
      "姑苏画舫录 (Gūsū Huàfǎng Lù)",
      "寒叶霜 (Hán Yè Shuāng)",
      "红白机之梦 (Hóng Bái Jī zhī Mèng)",
      "花信予时 (Huā Xìn Yǔ Shí)",
      "黄楼月 (Huánglóu Yuè)",
      "回梦肆度 (Huí Mèng Sì Dù)",
      "Infinite BLUE",
      "京华倦客 (Jīnghuá Juànkè)",
      "镜花水月 (Jìnghuāshuǐyuè)/Zhuan Chang Langren",
      "纪念 (Jìniàn)",
      "九湘 (Jiǔ Xiāng)",
      "九州墨纪 (Jiǔzhōu Mò Jì)",
      "来日绮窗 (Láirì Qǐchuāng)",
      "冷然月 (Lěngrán Yuè)",
      "梨情别 (Lí Qíng Bié)",
      "梨花酿 (Líhuā Niàng)",
      "临安雨 (Lín'ān Yǔ)",
      "绫宵飞车 (Líng Xiāo Fēichē)",
      "流光 (Liúguāng)/Xi Nuo",
      "流年碎片 (Liúnián Suìpiàn)",
      "落花霁 (Luòhuā Jì)",
      "绿绮歌 (Lǜqǐ Gē)",
      "名坊私塾第一部 (Míng Fāng Sīshú Dì Yī Bù)",
      "命轮 (Mìng Lún)",
      "明天尚未知 (Míngtiān Shàng Wèizhī)",
      "明信片 (Míngxìnpiàn)",
      "南北缘 (Nánběi Yuán)",
      "南风 (Nánfēng)/Zhuan Chang Langren",
      "那位歌手 (Nàwèi Gēshǒu)",
      "平江午茶 (Píngjiāng Wǔchá)",
      "绮调平湖 (Qǐ Diào Pínghú)",
      "牵相伴 (Qián Xiāngbàn)",
      "七彩漩涡 (Qīcǎi Xuánwō)",
      "启程之光 (Qǐchéng zhī Guāng)",
      "琴台梦 (Qíntái Mèng)",
      "人间瓷话 (Rénjiān Cí Huà)",
      "人间客 (Rénjiān Kè)",
      "山塘恋雨 (Shāntáng Liàn Yǔ)",
      "石梦缘 (Shí Mèng Yuán)",
      "世末歌者 (Shìmò Gēzhě)",
      "双生镜中人 (Shuāngshēng Jìng Zhōng Rén)",
      "双生门 (Shuāngshēng Mén)",
      "双生药师 (Shuāngshēng Yàoshī)",
      "司南 (Sīnán)",
      "送辞 (Sòng Cí)",
      "随性女王 (Suíxìng Nǚwáng)",
      "昙景 (Tán Jǐng)",
      "桃花月 (Táohuā Yuè)",
      "团年Yeah! (Tuán Nián Yeah!)",
      "晚枫月 (Wǎn Fēng Yuè)",
      "忘仙 (Wàng Xiān)",
      "妄语之诗与梦呓 (Wàngyǔ zhī Shī yǔ Mèngyì)",
      "未原谅 (Wèi Yuánliàng)",
      "无厦 (Wú Shà)",
      "无所忧 (Wú Suǒ Yōu)",
      "无机与虚构之爱 (Wújī yǔ Xūgòu zhī Ài)",
      "夕羽 (Xī Yǔ)",
      "小心机 (Xiǎo Xīnjī)",
      "小河映月儿 (Xiǎohé Yìng Yuèr)",
      "星之潮汐 (Xīng zhī Cháoxī)",
      "星空下的坚强 (Xīngkōng Xià de Jiānqiáng)",
      "星夜之诗 (Xīngyè zhī Shī)",
      "扬州姑娘 (Yángzhōu Gūniáng)",
      "燕子不归 (Yànzi Bù Guī)",
      "一梦贪欢 (Yī Mèng Tān Huān)",
      "伊如月 (Yī Rú Yuè)",
      "一生二界 (Yī Shēng Èr Jiè)",
      "一舞英歌 (Yī Wǔ Yīnggē)",
      "音符成诗 (Yīnfú Chéng Shī)",
      "易碎苏打心 (Yìsuì Soda Xīn)",
      "愿明天起 (Yuàn Míngtiān Qǐ)",
      "与你们相遇 (Yǔ Nǐmen Xiāngyù)",
      "遇棋书 (Yù Qí Shū)",
      "掌心的魔咒 (Zhǎngxīn de Mózhòu)",
      "骤雨，我的告白 (Zhòuyǔ, Wǒ de Gàobái)",
      "灼之花 (Zhuó zhī Huā)",
      "纵云 (Zòng Yún)",
      "醉 (Zuì)/Xu Mengyuan",
    ];

    const expected = {
      songs: expectedSongs.map((page) => new ProducerDiscographySongItem({ page })),
      albums: [
        new ProducerDiscographyAlbumItem({
          page: "华哉有夏 (Huá Zāi Yǒu Xià) (album)",
          isCompilation: true,
        }),
        new ProducerDiscographyAlbumItem({
          page: "华哉有夏·贰 (Huá Zāi Yǒu Xià·Èr) (album)",
          isCompilation: true,
        }),
        new ProducerDiscographyAlbumItem({ page: "柒 (Qī) (album)", isCompilation: true }),
        new ProducerDiscographyAlbumItem({ page: "拾 (Shí) (album)", isCompilation: true }),
        new ProducerDiscographyAlbumItem({ page: "心语 (Xīn Yǔ) (album)", isCompilation: true }),
        new ProducerDiscographyAlbumItem({ page: "∞ (album)", isCompilation: true }),
      ],
      recommendToSplitAlbum: false,
    };
    expect(entity.songs.length).toEqual(expected.songs.length);
    expect(entity.albums.length).toEqual(expected.albums.length);
    expect(entity).toEqual(expected);
    expect(entity.songs).toMatchObject(expected.songs);
    expect(entity.albums).toMatchObject(expected.albums);
  });
});
