export interface AlbumStreamingLink {
  paramKey: string;
  regex: RegExp;
  placeholder: string;
  iconUrl: string;
}

export const ALBUM_STREAMING_LINKS: AlbumStreamingLink[] = [
  {
    paramKey: "nn-xfade",
    regex: /^https?:\/\/www\.nicovideo\.jp\/watch\/(?<embedid>[^/?]+)/,
    placeholder: "https://www.nicovideo.jp/watch/sm******",
    iconUrl: "/assets/Favicon-nn.png",
  },
  {
    paramKey: "yt-xfade",
    regex:
      /^https?:\/\/(?:(?:|www\.)youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)(?<embedid>[^/?]{11})/,
    placeholder: "https://www.youtube.com/watch?v=*********",
    iconUrl: "/assets/Favicon-yt.png",
  },
  {
    paramKey: "bb-xfade",
    regex: /^https?:\/\/www\.bilibili\.com\/video\/(?<embedid>[^/?]+)/,
    placeholder: "https://www.bilibili.com/video/Bv*********",
    iconUrl: "/assets/Favicon-bb.png",
  },
  {
    paramKey: "sp-embed",
    regex: /^https?:\/\/open\.spotify\.com\/album\/(?<embedid>[^/?]+)/,
    placeholder: "https://open.spotify.com/album/**********",
    iconUrl: "/assets/Favicon-sp.png",
  },
  {
    paramKey: "yt-playlist",
    regex: /^https?:\/\/(?:music\.|www\.|)youtube\.com\/playlist\?list=(?<embedid>[^/?]+)/,
    placeholder: "https://www.youtube.com/playlist?list=OLAK5uy_************",
    iconUrl: "/assets/Favicon-yt.png",
  },
  {
    paramKey: "bc-embed",
    regex: /^(?<embedid>\d+)$/,
    placeholder: "123456789",
    iconUrl: "/assets/Favicon-bc.png",
  },
  {
    paramKey: "sc-xfade",
    regex: /^(?<embedid>https?:\/\/soundcloud\.com\/.*)$/,
    placeholder: "https://soundcloud.com/**************",
    iconUrl: "/assets/Favicon-sc.png",
  },
];