interface AlbumStreamingLink {
  name: string;
  paramKey: string;
  regex: RegExp;
}

export const ALBUM_STREAMING_LINKS: AlbumStreamingLink[] = [
  {
    name: "Niconico Crossfade",
    paramKey: "nn-xfade",
    regex: /^https?:\/\/www\.nicovideo\.jp\/watch\/(?<embedid>[^/\?]+)/,
  },
  {
    name: "YouTube Crossfade",
    paramKey: "yt-xfade",
    regex:
      /^https?:\/\/(?:(?:|www\.)youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)(?<embedid>[^/\?]{11})/,
  },
  {
    name: "Spotify",
    paramKey: "sp-embed",
    regex: /^https?:\/\/open\.spotify\.com\/album\/(?<embedid>[^/\?]+)/,
  },
  {
    name: "YouTube Music Playlist",
    paramKey: "yt-playlist",
    regex: /^https?:\/\/(?:music\.|www\.|)youtube\.com\/playlist\?list=(?<embedid>[^/\?]+)/,
  },
  {
    name: "Bandamp Embed ID",
    paramKey: "bc-embed",
    regex: /^(?<embedid>\d+)$/,
  },
  {
    name: "SoundCloud Crossfade",
    paramKey: "sc-xfade",
    regex: /^(?<embedid>https?:\/\/soundcloud\.com\/.*)$/,
  },
];