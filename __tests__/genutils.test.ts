import { describe, expect, test } from "vite-plus/test";
import { detonePinyin, renderListInWikiInternalLinkMarkup } from "../src/lib/utils/utils";
import {
  isValidUrl,
  convertAvidToBvId,
  standardizeYoutubeLink,
  upgradeInsecureHttpLink,
  convertTwitterLink,
  getOtherMediaWikiPageName,
} from "../src/lib/utils/urlUtils";
import { getVdbPageId } from "../src/lib/utils/vdbUtils";
import { VdbPageType } from "../src/schemas/vocadb.d";

describe("test URL functions", () => {
  test.each([
    { i: "foo", o: false },
    { i: "https://example.com", o: true },
    { i: "https://example.com <script>Hello!</script>", o: false },
  ])("isValidUrl", ({ i, o }) => {
    expect(isValidUrl(i)).toBe(o);
  });

  test.each([
    { i: ["https://vocadb.net/S/1501", "S"], o: "1501" },
    { i: ["https://vocadb.net/S/1501?query=1", "S"], o: "1501" },
    { i: ["https://vocadb.net/Al/21149", "Al"], o: "21149" },
    { i: ["https://vocadb.net/Al/21149?query=foo", "Al"], o: "21149" },
    { i: ["https://vocadb.net/Ar/28", "Ar"], o: "28" },
    { i: ["https://vocadb.net/Ar/28?query=bar", "Ar"], o: "28" },
    { i: ["https://vocadb.net/Al/21149", "S"], o: null },
  ] as { i: [string, VdbPageType]; o: string | null }[])(
    "getVdbPageId",
    ({ i: [url, type], o }) => {
      expect(getVdbPageId(url, type)).toBe(o);
    },
  );
  test("getVdbPageId - throw error", () => {
    expect(() => {
      //@ts-expect-error
      getVdbPageId("https://vocadb.net/E/1", "E");
    }).toThrow();
  });

  test.each([
    {
      i: "https://www.bilibili.com/video/av3905462/",
      o: "https://www.bilibili.com/video/BV1es41197ai",
    },
    {
      i: "https://www.bilibili.com/video/av6009789",
      o: "https://www.bilibili.com/video/BV1Qs411k7Qv",
    },
    {
      i: "https://www.bilibili.com/video/av258296202",
      o: "https://www.bilibili.com/video/BV1wa411Q7N6",
    },
  ])("convertAvidToBvId", ({ i, o }) => {
    expect(convertAvidToBvId(i)).toBe(o);
  });

  test.each([
    { i: "https://youtu.be/dQw4w9WgXcQ", o: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    {
      i: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      o: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    {
      i: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&utm=eviltracking",
      o: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    {
      i: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      o: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    {
      i: "https://music.youtube.com/watch?v=dQw4w9WgXcQ",
      o: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  ])("standardizeYoutubeLink", ({ i, o }) => {
    expect(standardizeYoutubeLink(i)).toBe(o);
  });

  test.each([
    {
      i: "https://twitter.com/DECO27/status/2078313817436721276",
      o: "https://x.com/DECO27/status/2078313817436721276",
    },
    {
      i: "https://www.twitter.com/DECO27/status/2078313817436721276",
      o: "https://x.com/DECO27/status/2078313817436721276",
    },
  ])("convertTwitterLink", ({ i, o }) => {
    expect(convertTwitterLink(i)).toBe(o);
  });

  test("upgradeInsecureHttpLink", () => {
    expect(upgradeInsecureHttpLink("http://example.com")).toBe("https://example.com");
  });

  test.each([
    {
      url: "https://vocaloid.fandom.com/wiki/Article",
      entrypoint: "https://vocaloid.fandom.com/wiki/",
      o: "Article",
    },
    {
      url: "https://vocaloid.fandom.com/wiki/Article_1",
      entrypoint: "https://vocaloid.fandom.com/wiki/",
      o: "Article 1",
    },
    {
      url: "https://vocaloid.miraheze.org/wiki/Article_1",
      entrypoint: "https://vocaloid.miraheze.org/wiki/",
      o: "Article 1",
    },
    {
      url: "https://vocaloid.miraheze.org/wiki/Article_1",
      entrypoint: "https://vocaloid.fandom.com/wiki/",
      o: null,
    },
  ])("getOtherMediaWikiPageName", ({ url, entrypoint, o }) => {
    expect(getOtherMediaWikiPageName(url, entrypoint)).toEqual(o);
  });
});

describe("test misc utility function", () => {
  test.each([
    {
      i: ["Hǎo xiǎng nǐ hǎo xiǎng nǐ hǎoxiàng nǐ dào tiānlǐ", undefined],
      o: "Hao xiang ni hao xiang ni haoxiang ni dao tianli",
    },
    { i: ["Yī Èr Sān Sì Wǔ Liù Qī Bā Jiǔ Shí", undefined], o: "Yi Er San Si Wu Liu Qi Ba Jiu Shi" },
    { i: ["Nǚ wā bǔ tiān", false], o: "Nv wa bu tian" },
    { i: ["Nǚ wā bǔ tiān", true], o: "Nü wa bu tian" },
  ] as { i: [string, boolean | undefined]; o: string }[])(
    "detonePinyin",
    ({ i: [s, showUmlaut], o }) => {
      expect(detonePinyin(s, showUmlaut)).toBe(o);
    },
  );

  test.each([
    { i: "foo", o: "[[foo]]" },
    { i: "foo, bar, baz", o: "[[foo]], [[bar]], [[baz]]" },
    { i: "foo, bar & baz", o: "[[foo]], [[bar]] & [[baz]]" },
    { i: "foo, bar, and baz", o: "[[foo]], [[bar]], and [[baz]]" },
    { i: "foo,   bar,   baz", o: "[[foo]],   [[bar]],   [[baz]]" },
    { i: "foo,   bar  &   baz", o: "[[foo]],   [[bar]]  &   [[baz]]" },
    { i: "foo,   bar,  and  baz", o: "[[foo]],   [[bar]],  and  [[baz]]" },
    { i: "charlie, andy, and band", o: "[[charlie]], [[andy]], and [[band]]" },
    { i: "andy", o: "[[andy]]" },
    { i: "band", o: "[[band]]" },
    { i: "bandana", o: "[[bandana]]" },
  ])("renderListInWikiInternalLinkMarkup", ({ i, o }) => {
    expect(renderListInWikiInternalLinkMarkup(i)).toBe(o);
  });
});