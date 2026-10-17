import { describe, expect, test } from "vite-plus/test";
import type { IAlbumBroadcastLink } from "#src/lib/models/schema.d.ts";
import AlbumBroadcastLink from "#src/lib/models/children/AlbumBroadcastLink.svelte.ts";

describe("test state management logic for AlbumBroadcastLink", () => {
  test.each([
    {
      d: "Niconico Crossfade",
      i: {
        idx: 0,
        paramKey: "nn-xfade",
        url: "https://www.nicovideo.jp/watch/sm30228946",
      },
      o: {
        __computed: { isValid: true, embedid: "sm30228946" },
      },
    },
    {
      d: "YouTube Crossfade",
      i: {
        idx: 1,
        paramKey: "yt-xfade",
        url: "https://youtu.be/in90fSCxGKs",
      },
      o: {
        __computed: { isValid: true, embedid: "in90fSCxGKs" },
      },
    },
    {
      d: "YouTube Crossfade",
      i: {
        idx: 1,
        paramKey: "yt-xfade",
        url: "https://www.youtube.com/watch?v=in90fSCxGKs",
      },
      o: {
        __computed: { isValid: true, embedid: "in90fSCxGKs" },
      },
    },
    {
      d: "bilibili Crossfade",
      i: {
        idx: 2,
        paramKey: "bb-xfade",
        url: "https://www.bilibili.com/video/BV1XU4y1T7yA/",
      },
      o: {
        __computed: { isValid: true, embedid: "BV1XU4y1T7yA" },
      },
    },
    {
      d: "Spotify",
      i: {
        idx: 3,
        paramKey: "sp-embed",
        url: "https://open.spotify.com/album/3Ydz6UhhXxgsoj36DKSv9L",
      },
      o: {
        __computed: { isValid: true, embedid: "3Ydz6UhhXxgsoj36DKSv9L" },
      },
    },
    {
      d: "YouTube Music Playlist",
      i: {
        idx: 4,
        paramKey: "yt-playlist",
        url: "https://music.youtube.com/playlist?list=OLAK5uy_lEg6rOZGRgRKv5_aXH7mI2jwdL6xDJEB4",
      },
      o: {
        __computed: {
          isValid: true,
          embedid: "OLAK5uy_lEg6rOZGRgRKv5_aXH7mI2jwdL6xDJEB4",
        },
      },
    },
    {
      d: "YouTube Music Playlist",
      i: {
        idx: 4,
        paramKey: "yt-playlist",
        url: "https://www.youtube.com/playlist?list=OLAK5uy_lEg6rOZGRgRKv5_aXH7mI2jwdL6xDJEB4",
      },
      o: {
        __computed: {
          isValid: true,
          embedid: "OLAK5uy_lEg6rOZGRgRKv5_aXH7mI2jwdL6xDJEB4",
        },
      },
    },
    {
      d: "Bandcamp Embed ID",
      i: {
        idx: 5,
        paramKey: "bc-embed",
        url: "836724426",
      },
      o: {
        __computed: { isValid: true, embedid: "836724426" },
      },
    },
    {
      d: "SoundCloud Crossfade",
      i: {
        idx: 6,
        paramKey: "sc-xfade",
        url: "https://soundcloud.com/Comic-and-Cosmic",
      },
      o: {
        __computed: {
          isValid: true,
          embedid: "https://soundcloud.com/Comic-and-Cosmic",
        },
      },
    },
    {
      d: "Other service",
      i: {
        idx: -1,
        paramKey: null,
        url: "https://linkco.re/qg9GzCa3",
      },
      o: {
        __computed: { isValid: true, embedid: null },
      },
    },
  ])("should parse links correctly - $d", ({ i, o: { __computed } }) => {
    const link = new AlbumBroadcastLink(i);
    link.preprocess();
    expect(link.__computed).toMatchObject(__computed);
  });

  test("should return isValid = false", () => {
    const link = new AlbumBroadcastLink({
      idx: 0,
      paramKey: "nn-xfade",
      url: "https://www.youtube.com/watch?v=in90fSCxGKs",
    });
    link.preprocess();
    expect(link.__computed).toMatchObject({
      isValid: false,
      embedid: null,
    });
  });

  test("toJSON", () => {
    const o: IAlbumBroadcastLink = {
      idx: 0,
      paramKey: "yt-xfade",
      url: "https://www.youtube.com/watch?v=12345678901",
    };
    const albumTrack = new AlbumBroadcastLink(o);
    expect(albumTrack.toJSON()).toMatchObject(o);
  });
});