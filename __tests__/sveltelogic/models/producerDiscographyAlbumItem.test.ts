import { describe, expect, test } from "vite-plus/test";
import type { IProducerDiscographyAlbumItem } from "../../../src/lib/models/schema.d";
import ProducerDiscographyAlbumItem from "../../../src/lib/models/children/ProducerDiscographyAlbumItem.svelte";

describe("test state management logic for ProducerDiscographyAlbumItem", () => {
  test.each([
    {
      d: "empty state",
      i: { page: "", additionalParameters: "" },
      o: "{{awt row|}}",
    },
    {
      d: "simple",
      i: { page: "Album", additionalParameters: "" },
      o: "{{awt row|Album}}",
    },
    {
      d: "simple",
      i: { page: "Album", additionalParameters: "", isCompilation: true },
      o: "{{awt row|Album}}",
    },
    {
      d: "with additional params 1",
      i: { page: "Album", additionalParameters: "kanji=Bread" },
      o: "{{awt row|Album|kanji=Bread}}",
    },
    {
      d: "with additional params 2",
      i: { page: "Album", additionalParameters: "|kanji=Bread" },
      o: "{{awt row|Album|kanji=Bread}}",
    },
    {
      d: "with additional params 3",
      i: { page: "Album", additionalParameters: "Bread" },
      o: "{{awt row|Album|Bread}}",
    },
  ] as { d: string; i: IProducerDiscographyAlbumItem; o: string }[])(
    "getWikitext - $d",
    ({ i, o }) => {
      const item = new ProducerDiscographyAlbumItem(i);
      expect(item.getWikitext()).toBe(o);
    },
  );

  test("toJSON", () => {
    const o: IProducerDiscographyAlbumItem = {
      page: "Album",
      additionalParameters: "kanji=Bread",
      isCompilation: true,
    };
    const item = new ProducerDiscographyAlbumItem(o);
    expect(item.toJSON()).toMatchObject(o);
  });
});