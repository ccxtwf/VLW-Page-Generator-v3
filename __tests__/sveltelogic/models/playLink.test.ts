import { describe, expect, test } from "vite-plus/test";
import type { IPlayLink } from "#src/lib/models/schema.d.ts";
import PlayLink from "#src/lib/models/children/PlayLink.svelte.ts";

describe("test state management logic for PlayLink", () => {
  test.each([
    {
      d: "empty state",
      i: { site: "", url: "", isReprint: false, isAutogen: false, isDeleted: false, viewCount: "" },
      o: "{{#|}}",
    },
    {
      d: "simple case",
      i: {
        site: "YouTube",
        url: "https://www.youtube.com/watch?v=12345678901",
        isReprint: false,
        isAutogen: false,
        isDeleted: false,
        viewCount: "",
      },
      o: "{{#|https://www.youtube.com/watch?v=12345678901}}",
    },
    {
      d: "reprint",
      i: {
        site: "YouTube",
        url: "https://www.youtube.com/watch?v=12345678901",
        isReprint: true,
        isAutogen: false,
        isDeleted: false,
        viewCount: "",
      },
      o: "{{#|https://www.youtube.com/watch?v=12345678901|label=reprint}}",
    },
    {
      d: "auto-generated topic by YouTube",
      i: {
        site: "YouTube",
        url: "https://www.youtube.com/watch?v=12345678901",
        isReprint: false,
        isAutogen: true,
        isDeleted: false,
        viewCount: "",
      },
      o: "{{#|https://www.youtube.com/watch?v=12345678901|auto=y}}",
    },
    {
      d: "removed",
      i: {
        site: "YouTube",
        url: "https://www.youtube.com/watch?v=12345678901",
        isReprint: false,
        isAutogen: false,
        isDeleted: true,
        viewCount: "",
      },
      o: "{{#|https://www.youtube.com/watch?v=12345678901|label=deleted}}",
    },
    {
      d: "removed reprint",
      i: {
        site: "YouTube",
        url: "https://www.youtube.com/watch?v=12345678901",
        isReprint: true,
        isAutogen: false,
        isDeleted: true,
        viewCount: "",
      },
      o: "{{#|https://www.youtube.com/watch?v=12345678901|label=reprint, deleted}}",
    },
    {
      d: "removed auto-generated topic",
      i: {
        site: "YouTube",
        url: "https://www.youtube.com/watch?v=12345678901",
        isReprint: false,
        isAutogen: true,
        isDeleted: true,
        viewCount: "",
      },
      o: "{{#|https://www.youtube.com/watch?v=12345678901|auto=y|label=deleted}}",
    },
  ] as { d: string; i: IPlayLink; o: string }[])("getPlayLinkWikitext - $d", ({ i, o }) => {
    const playLink = new PlayLink(i);
    expect(playLink.getPlayLinkWikitext()).toBe(o);
  });

  test.each([
    {
      d: "empty string",
      i: "",
      o: "",
    },
    {
      d: "formatted",
      i: "10,000+",
      o: "10,000+",
    },
    {
      d: "trim",
      i: "   10,000+   ",
      o: "10,000+",
    },
    {
      d: "standardize 1",
      i: "10, 000+",
      o: "10,000+",
    },
    {
      d: "standardize 2",
      i: "10.000+",
      o: "10,000+",
    },
    {
      d: "N/A",
      i: "N/A",
      o: "N/A",
    },
    {
      d: "< 10",
      i: "8",
      o: "8+",
    },
    {
      d: "< 100",
      i: "25",
      o: "20+",
    },
    {
      d: "< 1000",
      i: "751",
      o: "700+",
    },
    {
      d: "< 10,000",
      i: "6211",
      o: "6,200+",
    },
    {
      d: "< 100,000",
      i: "93100",
      o: "93,000+",
    },
    {
      d: "< 1,000,000",
      i: "513100",
      o: "510,000+",
    },
    {
      d: "< 10,000,000",
      i: "8321000",
      o: "8,300,000+",
    },
  ])("getFormattedViewCount - $d", ({ i, o }) => {
    const playLink = new PlayLink({ viewCount: i });
    expect(playLink.getFormattedViewCount()).toBe(o);
  });

  test("toJSON", () => {
    const o: IPlayLink = {
      site: "YouTube",
      url: "https://www.youtube.com/watch?v=12345678901",
      isReprint: true,
      isAutogen: true,
      isDeleted: true,
      viewCount: "10000",
    };
    const playLink = new PlayLink(o);
    expect(playLink.toJSON()).toMatchObject(o);
  });
});