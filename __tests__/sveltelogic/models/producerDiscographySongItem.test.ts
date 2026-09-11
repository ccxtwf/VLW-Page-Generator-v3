import { describe, expect, test } from "vite-plus/test";
import type { IProducerDiscographySongItem } from "#src/lib/models/schema.d.ts";
import ProducerDiscographySongItem from "#src/lib/models/children/ProducerDiscographySongItem.svelte.ts";

describe("test state management logic for ProducerDiscographySongItem", () => {
  test.each([
    {
      d: "empty state",
      i: { page: "", additionalParameters: "" },
      o: "{{pwt row|}}",
    },
    {
      d: "simple",
      i: { page: "Song", additionalParameters: "" },
      o: "{{pwt row|Song}}",
    },
    {
      d: "with additional params 1",
      i: { page: "Song", additionalParameters: "kanji=Bread" },
      o: "{{pwt row|Song|kanji=Bread}}",
    },
    {
      d: "with additional params 2",
      i: { page: "Song", additionalParameters: "|kanji=Bread" },
      o: "{{pwt row|Song|kanji=Bread}}",
    },
    {
      d: "with additional params 3",
      i: { page: "Song", additionalParameters: "Bread" },
      o: "{{pwt row|Song|Bread}}",
    },
  ] as { d: string; i: IProducerDiscographySongItem; o: string }[])(
    "getWikitext - $d",
    ({ i, o }) => {
      const item = new ProducerDiscographySongItem(i);
      expect(item.getWikitext()).toBe(o);
    },
  );

  test("toJSON", () => {
    const o: IProducerDiscographySongItem = {
      page: "Song",
      additionalParameters: "kanji=Bread",
    };
    const item = new ProducerDiscographySongItem(o);
    expect(item.toJSON()).toMatchObject(o);
  });
});