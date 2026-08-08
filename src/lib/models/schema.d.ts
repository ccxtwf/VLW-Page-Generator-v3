export interface ISong {
  aiCwState: ENUM_AI_WARNING_TYPE;
  aiWarningText1: string;
  aiWarningText2: string;
  cwState: ENUM_CW_STATES;
  cwText: string;
  hasEpilepsyWarning: boolean;
  languages: MultiSelectItem[];
  isoLangCode: string;
  origTitle: string;
  altChTitle: string;
  altChIsTraditional: boolean;
  romTitle: string;
  engTitle: string;
  titleIsOfficiallyTranslated: boolean;
  bgColour: string;
  fgColour: string;
  uploadDateRaw: string;
  // uploadDate?: Date | null;
  isAlbumOnly: boolean;
  isUnavailable: boolean;
  singers: string;
  producers: string;
  description: string;
  translator: string;
  isOfficialTranslation: boolean;
  categoriesRaw: string;
  // categories?: string[];
  lyrics: LyricRowData[];
  playLinks: PlayLinkData[];
  extLinks: ExternalLink[];
  images: IImageEmbed[];
}

export interface IAlbum {
  origTitle: string;
  romTitle: string;
  engTitle: string;
  bgColour: string;
  fgColour: string;
  label: string;
  description: string;
  isCompilationAlbum: boolean;
  publishedYear: string;
  publishedMonth: string;
  publishedDay: string;
  engines: MultiSelectItem[];
  vdbAlbumId: string;
  vocaWikiPage: string;
  categoriesRaw: string;
  // categories?: string[];
  tracklist: AlbumTrack[];
  broadcastLinks: AlbumBroadcastLink[];
  extLinks: ExternalLink[];
  image: IImageEmbed | null;
}

export interface IProducer {
  prodCategory: string;
  splitAlbum: boolean;
  prodAliases: string;
  affiliations: string;
  labels: string;
  languages: MultiSelectItem[];
  engines: MultiSelectItem[];
  description: string;
  roles: ProducerRoles;
  songs: ProducerDiscographySongItem[];
  albums: ProducerDiscographyAlbumItem[];
  extLinks: ExternalLink[];
  image: IImageEmbed | null;
}

export interface ILyricsRow {
  customStyle: string;
  original: string;
  romanized?: string;
  english?: string;
  additionalColumns?: string[];
}

export interface IPlayLink {
  site: string;
  url: string;
  isReprint: boolean;
  isAutogen: boolean;
  isDeleted: boolean;
  viewCount: string;
}

export interface IExternalLink {
  url: string;
  description: string;
  isOfficial: boolean;
  isMedia?: boolean;
  isInactive: boolean;
}

export interface IImageEmbed {
  type: ENUM_IMAGE_EMBED_SOURCE_TYPE | null;
  src: string;
  alt?: string;
}

export interface IExternalLinkForProducerPage extends IExternalLink {
  isMedia: boolean;
}

export interface IAlbumBroadcastLink {
  idx: number | null;
  site: string;
  url: string;
}

export interface IAlbumTrackData {
  discNo: number | string;
  trackNo: number | string;
  pageTitle: string;
  producerCredit: string;
  singerCredit: string;
}

export interface IProducerRoles {
  composer: boolean;
  lyricist: boolean;
  tuner: boolean;
  illustrator: boolean;
  animator: boolean;
  arranger: boolean;
  instrumentalist: boolean;
  mixer: boolean;
  masterer: boolean;
}

export interface IProducerDiscographySongItem {
  page: string;
  additionalParameters: string;
}

export interface IProducerDiscographyAlbumItem extends IProducerDiscographySongItem {
  isCompilation: boolean;
}

export interface ILyricsEditorForm {
  lyrics: LyricRow[];
  translator: string;
  isOfficialTranslation: boolean;
}
