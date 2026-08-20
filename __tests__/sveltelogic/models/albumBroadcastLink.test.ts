import { describe, expect, test } from "vite-plus/test";
import type { IAlbumBroadcastLink } from "../../../src/lib/models/schema.d";
import AlbumBroadcastLink from "../../../src/lib/models/children/AlbumBroadcastLink.svelte";

describe("test state management logic for AlbumBroadcastLink", () => {
  test("toJSON", () => {
    const o: IAlbumBroadcastLink = {
      idx: 0,
      site: "YouTube",
      url: "https://www.youtube.com/watch?v=12345678901",
    };
    const albumTrack = new AlbumBroadcastLink(o);
    expect(albumTrack.toJSON()).toMatchObject(o);
  });
});