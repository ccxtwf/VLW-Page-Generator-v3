export interface AlbumStreamingLink {
  idx: number;
  name: string;
  paramKey: string;
  regex: RegExp;
}

export const ALBUM_STREAMING_LINKS: AlbumStreamingLink[] = [
  {
    idx: 1,
    name: "Niconico Crossfade",
    paramKey: "nn-xfade",
    regex: /^https?:\/\/www\.nicovideo\.jp\/watch\/(?<embedid>[^/?]+)/,
  },
  {
    idx: 2,
    name: "YouTube Crossfade",
    paramKey: "yt-xfade",
    regex:
      /^https?:\/\/(?:(?:|www\.)youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)(?<embedid>[^/?]{11})/,
  },
  {
    idx: 3,
    name: "Spotify",
    paramKey: "sp-embed",
    regex: /^https?:\/\/open\.spotify\.com\/album\/(?<embedid>[^/?]+)/,
  },
  {
    idx: 4,
    name: "YouTube Music Playlist",
    paramKey: "yt-playlist",
    regex: /^https?:\/\/(?:music\.|www\.|)youtube\.com\/playlist\?list=(?<embedid>[^/?]+)/,
  },
  {
    idx: 5,
    name: "Bandamp Embed ID",
    paramKey: "bc-embed",
    regex: /^(?<embedid>\d+)$/,
  },
  {
    idx: 6,
    name: "SoundCloud Crossfade",
    paramKey: "sc-xfade",
    regex: /^(?<embedid>https?:\/\/soundcloud\.com\/.*)$/,
  },
];