export interface AlbumStreamingLink {
  name: string;
  paramKey: string;
  regex: RegExp;
  placeholder: string;
}

export const ALBUM_STREAMING_LINKS: AlbumStreamingLink[] = [
  {
    name: "Niconico Crossfade",
    paramKey: "nn-xfade",
    regex: /^https?:\/\/www\.nicovideo\.jp\/watch\/(?<embedid>[^/?]+)/,
    placeholder: "https://www.nicovideo.jp/watch/sm******",
  },
  {
    name: "YouTube Crossfade",
    paramKey: "yt-xfade",
    regex:
      /^https?:\/\/(?:(?:|www\.)youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)(?<embedid>[^/?]{11})/,
    placeholder: "https://www.youtube.com/watch?v=*********",
  },
  {
    name: "Spotify",
    paramKey: "sp-embed",
    regex: /^https?:\/\/open\.spotify\.com\/album\/(?<embedid>[^/?]+)/,
    placeholder: "https://open.spotify.com/album/**********",
  },
  {
    name: "YouTube Music Playlist",
    paramKey: "yt-playlist",
    regex: /^https?:\/\/(?:music\.|www\.|)youtube\.com\/playlist\?list=(?<embedid>[^/?]+)/,
    placeholder: "https://www.youtube.com/playlist?list=**************",
  },
  {
    name: "Bandamp Embed ID",
    paramKey: "bc-embed",
    regex: /^(?<embedid>\d+)$/,
    placeholder: "https://*.bandcamp.com/**************",
  },
  {
    name: "SoundCloud Crossfade",
    paramKey: "sc-xfade",
    regex: /^(?<embedid>https?:\/\/soundcloud\.com\/.*)$/,
    placeholder: "https://soundcloud.com/**************",
  },
];
