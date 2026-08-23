import { describe, expect, test } from "vite-plus/test";
import type { IAlbumBroadcastLink } from "../../../src/lib/models/schema.d";
import AlbumBroadcastLink from "../../../src/lib/models/children/AlbumBroadcastLink.svelte";

describe("test state management logic for AlbumBroadcastLink", () => {
  test.each([
    {
      d: "Niconico Crossfade",
      i: {
        idx: 0,
        site: "Niconico Crossfade",
        url: "https://www.nicovideo.jp/watch/sm30228946",
      },
      o: {
        __computed: { paramKey: "nn-xfade", isValid: true, embedid: "sm30228946" },
      },
    },
    {
      d: "YouTube Crossfade",
      i: {
        idx: 1,
        site: "YouTube Crossfade",
        url: "https://youtu.be/in90fSCxGKs",
      },
      o: {
        __computed: { paramKey: "yt-xfade", isValid: true, embedid: "in90fSCxGKs" },
      },
    },
    {
      d: "YouTube Crossfade",
      i: {
        idx: 1,
        site: "YouTube Crossfade",
        url: "https://www.youtube.com/watch?v=in90fSCxGKs",
      },
      o: {
        __computed: { paramKey: "yt-xfade", isValid: true, embedid: "in90fSCxGKs" },
      },
    },
    {
      d: "Spotify",
      i: {
        idx: 2,
        site: "Spotify",
        url: "https://open.spotify.com/album/3Ydz6UhhXxgsoj36DKSv9L",
      },
      o: {
        __computed: { paramKey: "sp-embed", isValid: true, embedid: "3Ydz6UhhXxgsoj36DKSv9L" },
      },
    },
    {
      d: "YouTube Music Playlist",
      i: {
        idx: 3,
        site: "YouTube Music Playlist",
        url: "https://music.youtube.com/playlist?list=OLAK5uy_lEg6rOZGRgRKv5_aXH7mI2jwdL6xDJEB4",
      },
      o: {
        __computed: {
          paramKey: "yt-playlist",
          isValid: true,
          embedid: "OLAK5uy_lEg6rOZGRgRKv5_aXH7mI2jwdL6xDJEB4",
        },
      },
    },
    {
      d: "YouTube Music Playlist",
      i: {
        idx: 3,
        site: "YouTube Music Playlist",
        url: "https://www.youtube.com/playlist?list=OLAK5uy_lEg6rOZGRgRKv5_aXH7mI2jwdL6xDJEB4",
      },
      o: {
        __computed: {
          paramKey: "yt-playlist",
          isValid: true,
          embedid: "OLAK5uy_lEg6rOZGRgRKv5_aXH7mI2jwdL6xDJEB4",
        },
      },
    },
    {
      d: "Bandamp Embed ID",
      i: {
        idx: 4,
        site: "Bandamp Embed ID",
        url: "836724426",
      },
      o: {
        __computed: { paramKey: "bc-embed", isValid: true, embedid: "836724426" },
      },
    },
    {
      d: "SoundCloud Crossfade",
      i: {
        idx: 5,
        site: "SoundCloud Crossfade",
        url: "https://soundcloud.com/Comic-and-Cosmic",
      },
      o: {
        __computed: {
          paramKey: "sc-xfade",
          isValid: true,
          embedid: "https://soundcloud.com/Comic-and-Cosmic",
        },
      },
    },
    {
      d: "Other service",
      i: {
        idx: -1,
        site: "TuneCore",
        url: "https://linkco.re/qg9GzCa3",
      },
      o: {
        __computed: { paramKey: null, isValid: true, embedid: null },
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
      site: "Niconico Crossfade",
      url: "https://www.youtube.com/watch?v=in90fSCxGKs",
    });
    link.preprocess();
    expect(link.__computed).toMatchObject({
      paramKey: "nn-xfade",
      isValid: false,
      embedid: null,
    });
  });

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
