import { describe, expect, test } from "vite-plus/test";
import type { IExternalLinkForProducerPage } from "#src/lib/models/schema.d.ts";
import ExternalLink from "#src/lib/models/children/ExternalLinkForProducerPage.svelte.ts";

describe("test state management logic for ExternalLink", () => {
  test.each([
    {
      d: "empty state",
      i: { url: "", description: "", isOfficial: false },
      o: "[ ]",
    },
    {
      d: "external link",
      i: { url: "https://example.com", description: "External Website", isOfficial: false },
      o: "[https://example.com External Website]",
    },
    {
      d: "external link - inactive",
      i: {
        url: "https://example.com",
        description: "External Website",
        isOfficial: false,
        isInactive: true,
      },
      o: "<s>[https://example.com External Website]</s>",
    },
    {
      d: "internal link - Vocaloid Lyrics Wiki",
      i: {
        url: "https://vocaloidlyrics.miraheze.org/wiki/Page",
        description: "Refer Page",
        isOfficial: false,
      },
      o: "[[Page|Refer Page]]",
    },
    {
      d: "internal link - Vocaloid Lyrics Wiki - category",
      i: {
        url: "https://vocaloidlyrics.miraheze.org/wiki/Category:wowaka_songs_list",
        description: "Refer Page",
        isOfficial: false,
      },
      o: "[[:Category:wowaka songs list|Refer Page]]",
    },
    {
      d: "interwiki link - Vocaloid Fandom Wiki",
      i: {
        url: "https://vocaloid.fandom.com/wiki/Page",
        description: "Refer Page",
        isOfficial: false,
      },
      o: "{{vocaloid|Page|Refer Page}}",
    },
    {
      d: "interwiki link - Proseka Fandom Wiki",
      i: {
        url: "https://projectsekai.fandom.com/wiki/Page",
        description: "Refer Page",
        isOfficial: false,
      },
      o: "{{proseka|Page|Refer Page}}",
    },
    {
      d: "interwiki link - VTuber Fandom Wiki",
      i: {
        url: "https://virtualyoutuber.fandom.com/wiki/Page",
        description: "Refer Page",
        isOfficial: false,
      },
      o: "{{vtuber|Page|Refer Page}}",
    },
    {
      d: "interwiki link - SEKAIPEDIA",
      i: {
        url: "https://projectsekai.miraheze.org/wiki/Page",
        description: "Refer Page",
        isOfficial: false,
      },
      o: "{{sekaipedia|Page|Refer Page}}",
    },
    {
      d: "interwiki link - Bandori",
      i: {
        url: "https://bandori.miraheze.org/wiki/Page",
        description: "Refer Page",
        isOfficial: false,
      },
      o: "{{bandori|Page|Refer Page}}",
    },
    {
      d: "interwiki link - Misc MH wiki",
      i: {
        url: "https://shinto.miraheze.org/wiki/Page",
        description: "Refer Page",
        isOfficial: false,
      },
      o: "[[mh:shinto:Page|Refer Page]]",
    },
    {
      d: "interwiki link - Misc Fandom wiki",
      i: {
        url: "https://kpop.fandom.com/wiki/Page",
        description: "Refer Page",
        isOfficial: false,
      },
      o: "{{FandomWiki|kpop|Page|Refer Page}}",
    },
    {
      d: "interwiki link - VocaDB",
      i: {
        url: "https://vocadb.net/S/1501",
        description: "VocaDB",
        isOfficial: false,
      },
      o: "{{VDB|S/1501}}",
    },
    {
      d: "interwiki link - VocaDB",
      i: {
        url: "https://vocadb.net/S/1501",
        description: "Refer Page",
        isOfficial: false,
      },
      o: "{{VDB|S/1501}} - Refer Page",
    },
    {
      d: "interwiki link - Hatsune Miku Wiki",
      i: {
        url: "https://w.atwiki.jp/hmiku/pages/1.html",
        description: "Refer Page",
        isOfficial: false,
      },
      o: "{{HMWiki|1}}",
    },
    {
      d: "interwiki link - Moegirlpedia",
      i: {
        url: "https://zh.moegirl.org.cn/Page",
        description: "Refer Page",
        isOfficial: false,
      },
      o: "{{MGP|Page|Moegirlpedia}}",
    },
    {
      d: "interwiki link - Moegirlpedia",
      i: {
        url: "https://zh.moegirl.org.cn/%E6%B4%BB%E8%AF%A5",
        description: "Refer Page",
        isOfficial: false,
      },
      o: "{{MGP|活该|Moegirlpedia}}",
    },
  ] as { d: string; i: IExternalLinkForProducerPage; o: string }[])(
    "getWikitext - $d",
    ({ i, o }) => {
      const externalLink = new ExternalLink(i);
      expect(externalLink.getWikitext()).toBe(o);
    },
  );

  test("toJSON", () => {
    const o: IExternalLinkForProducerPage = {
      url: "https://example.com",
      description: "External Website",
      isOfficial: false,
      isInactive: true,
      isMedia: true,
    };
    const externalLink = new ExternalLink(o);
    expect(externalLink.toJSON()).toMatchObject(o);
  });
});