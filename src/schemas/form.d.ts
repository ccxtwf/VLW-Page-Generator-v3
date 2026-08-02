import type { ENUM_AI_WARNING_TYPE, ENUM_CW_STATES } from "./enums";

interface MultiSelectItem {
  label: string;
  value: number;
}

export interface SongPageFormData {
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
  uploadDate?: Date | null;
  isAlbumOnly: boolean;
  isUnavailable: boolean;
  singers: string;
  producers: string;
  description: string;
  translator: string;
  isOfficialTranslation: boolean;
  categoriesRaw: string;
  categories?: string[];
  lyrics: LyricRowData[];
  playLinks: PlayLinkData[];
  extLinks: ExternalLink[];
}

export interface LyricRowData {
  customStyle: string;
  original: string;
  romanized?: string;
  english?: string;
  additionalColumns?: string[];
}

export interface PlayLinkData {
  site: string;
  url: string;
  isReprint: boolean;
  isAutogen: boolean;
  isDeleted: boolean;
  viewCount: string;
}

export interface ExternalLink {
  url: string;
  description: string;
  isOfficial: boolean;
  isMedia?: boolean;
  isInactive?: boolean;
}

export interface AlbumPageFormData {
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
  categories?: string[];
  tracklist: AlbumTrackData[];
  broadcastLinks: AlbumBroadcastLink[];
  extLinks: ExternalLink[];
}

export interface AlbumBroadcastLink {
  site: string;
  url: string;
}

export interface AlbumTrackData {
  discNo: number | string;
  trackNo: number | string;
  pageTitle: string;
  producerCredit: string;
  singerCredit: string;
}

export interface ProducerPageFormData {
  prodCategory: string;
  splitAlbum: boolean;
  prodAliases: string;
  affiliations: string;
  labels: string;
  languages: MultiSelectItem[];
  engines: MultiSelectItem[];
  description: string;
  roles: ProducerRoles;
  songs: ProducerDiscographyItem[];
  albums: ProducerDiscographyItem[];
  extLinks: ExternalLink[];
}

export interface ProducerRoles {
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

export interface ProducerDiscographyItem {
  page: string;
  additionalParameters: string;
  isCompilation?: boolean;
}

export interface LyricsEditorFormData {
  lyrics: LyricRowData[];
  translator: string;
  isOfficialTranslation: boolean;
}

export interface DisplayErrorContents {
  errors: string[];
  warnings: string[];
  recommendToAutoloadCategories: boolean;
}