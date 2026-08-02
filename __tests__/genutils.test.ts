import { describe, expect, test } from "vite-plus/test";
import { detonePinyin } from "../src/lib/utils/utils";
import {
  isValidUrl,
  convertAvidToBvId,
  standardizeYoutubeLink,
  upgradeInsecureHttpLink,
  convertTwitterLink,
} from "../src/lib/utils/urlUtils";
import { getVdbPageId } from "../src/lib/utils/vdbUtils";

describe("test URL functions", () => {
  test("isValidUrl", () => {
    expect(isValidUrl("foo")).toBe(false);
    expect(isValidUrl("https://example.com")).toBe(true);
    expect(isValidUrl("https://example.com <script>Hello!</script>")).toBe(false);
  });

  test("getVdbPageId", () => {
    expect(getVdbPageId("https://vocadb.net/S/1501", "S")).toBe("1501");
    expect(getVdbPageId("https://vocadb.net/S/1501?query=1", "S")).toBe("1501");
    expect(getVdbPageId("https://vocadb.net/Al/21149", "Al")).toBe("21149");
    expect(getVdbPageId("https://vocadb.net/Al/21149?query=foo", "Al")).toBe("21149");
    expect(getVdbPageId("https://vocadb.net/Ar/28", "Ar")).toBe("28");
    expect(getVdbPageId("https://vocadb.net/Ar/28?query=bar", "Ar")).toBe("28");
    expect(() => {
      //@ts-expect-error
      getVdbPageId("https://vocadb.net/E/1", "E");
    }).toThrow();
    expect(getVdbPageId("https://vocadb.net/Al/21149", "S")).toBe(null);
  });

  test("convertAvidToBvId", () => {
    expect(convertAvidToBvId("https://www.bilibili.com/video/av3905462/")).toBe(
      "https://www.bilibili.com/video/BV1es41197ai",
    );
    expect(convertAvidToBvId("https://www.bilibili.com/video/av6009789")).toBe(
      "https://www.bilibili.com/video/BV1Qs411k7Qv",
    );
    expect(convertAvidToBvId("https://www.bilibili.com/video/av258296202")).toBe(
      "https://www.bilibili.com/video/BV1wa411Q7N6",
    );
  });

  test("standardizeYoutubeLink", () => {
    expect(standardizeYoutubeLink("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    );
    expect(standardizeYoutubeLink("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    );
    expect(
      standardizeYoutubeLink("https://www.youtube.com/watch?v=dQw4w9WgXcQ&utm=eviltracking"),
    ).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(standardizeYoutubeLink("https://youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    );
    expect(standardizeYoutubeLink("https://music.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    );
  });

  test("convertTwitterLink", () => {
    expect(convertTwitterLink("https://twitter.com/DECO27/status/2078313817436721276")).toBe(
      "https://x.com/DECO27/status/2078313817436721276",
    );
    expect(convertTwitterLink("https://www.twitter.com/DECO27/status/2078313817436721276")).toBe(
      "https://x.com/DECO27/status/2078313817436721276",
    );
  });

  test("upgradeInsecureHttpLink", () => {
    expect(upgradeInsecureHttpLink("http://example.com")).toBe("https://example.com");
  });
});

describe("test misc utility function", () => {
  test("detonePinyin", () => {
    expect(detonePinyin("Hǎo xiǎng nǐ hǎo xiǎng nǐ hǎoxiàng nǐ dào tiānlǐ")).toBe(
      "Hao xiang ni hao xiang ni haoxiang ni dao tianli",
    );
    expect(detonePinyin("Yī Èr Sān Sì Wǔ Liù Qī Bā Jiǔ Shí")).toBe(
      "Yi Er San Si Wu Liu Qi Ba Jiu Shi",
    );
    expect(detonePinyin("Hǎo xiǎng nǐ hǎo xiǎng nǐ hǎoxiàng nǐ dào tiānlǐ")).toBe(
      "Hao xiang ni hao xiang ni haoxiang ni dao tianli",
    );
    expect(detonePinyin("Nǚ wā bǔ tiān", false)).toBe("Nv wa bu tian");
    expect(detonePinyin("Nǚ wā bǔ tiān", true)).toBe("Nü wa bu tian");
  });
});