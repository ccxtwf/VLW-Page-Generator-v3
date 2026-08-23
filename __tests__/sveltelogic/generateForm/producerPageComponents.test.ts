import { describe, expect, test } from "vite-plus/test";

import { getUnofficialProdLinks } from "../../../src/lib/logic/producers.svelte";
import ExternalLinkForProducerPage from "../../../src/lib/models/children/ExternalLinkForProducerPage.svelte";

describe("Generate producer page components", () => {
  test("Empty state", () => {
    const links: ExternalLinkForProducerPage[] = [];
    const got = getUnofficialProdLinks(links);
    const expected = `{{links |p=yes
  |atmiku = 
  |atutau = 
  |nico   = 
  |vocadb = 
  |tag    = 
  |mgp    = 
}}`;
    expect(got).toBe(expected);
  });

  test("All recognized domains", () => {
    const links: ExternalLinkForProducerPage[] = [
      new ExternalLinkForProducerPage({
        url: "https://vocadb.net/Ar/28",
        description: "VocaDB",
        isOfficial: false,
      }),
      new ExternalLinkForProducerPage({
        url: "https://w.atwiki.jp/hmiku/pages/4671.html",
        description: "Hatsune Miku Wiki",
        isOfficial: false,
      }),
      new ExternalLinkForProducerPage({
        url: "https://w.atwiki.jp/utauuuta/pages/1642.html",
        description: "UTAU Lyrics Database",
        isOfficial: false,
      }),
      new ExternalLinkForProducerPage({
        url: "https://www.nicovideo.jp/tag/ピノキオピー",
        description: "NicoNico Tag",
        isOfficial: false,
      }),
      new ExternalLinkForProducerPage({
        url: "https://dic.nicovideo.jp/id/ピノキオP",
        description: "NicoNicoPedia",
        isOfficial: false,
      }),
      new ExternalLinkForProducerPage({
        url: "https://zh.moegirl.org.cn/匹诺曹P",
        description: "Moegirlpedia",
        isOfficial: false,
      }),
    ];
    const got = getUnofficialProdLinks(links);
    const expected = `{{links |p=yes
  |atmiku = 4671
  |atutau = 1642
  |nico   = ピノキオP
  |vocadb = 28
  |tag    = ピノキオピー
  |mgp    = 匹诺曹P
}}`;
    expect(got).toBe(expected);
  });

  test("With unrecognized domain", () => {
    const links: ExternalLinkForProducerPage[] = [
      new ExternalLinkForProducerPage({
        url: "https://vocadb.net/Ar/28",
        description: "VocaDB",
        isOfficial: false,
      }),
      new ExternalLinkForProducerPage({
        url: "https://vocaloid.fandom.com/wiki/Pinocchio-P",
        description: "Vocaloid Wiki",
        isOfficial: false,
      }),
    ];
    const got = getUnofficialProdLinks(links);
    const expected = `{{links |p=yes
  |atmiku = 
  |atutau = 
  |nico   = 
  |vocadb = 28
  |tag    = 
  |mgp    = 
}}
* {{vocaloid|Pinocchio-P|Vocaloid Wiki}}`;
    expect(got).toBe(expected);
  });
});