export enum ENUM_CW_STATES {
  noWarnings,
  questionable,
  explicit,
}

export enum ENUM_AI_WARNING_TYPE {
  none,
  verified,
  suspected,
}

export interface SongPageFormData {
  aiCwState: ENUM_AI_WARNING_TYPE;
  aiWarningText1: string;
  aiWarningText2: string;
  cwState: ENUM_CW_STATES;
  cwText: string;
  hasEpilepsyWarning: boolean;
  isoLangCode: string;
  origTitle: string;
  altChTitle: string;
  altChIsTraditional: boolean;
  romTitle: string;
  engTitle: string;
  titleIsOfficiallyTranslated: boolean;
  bgColour: string;
  fgColour: string;
  uploadDate: string;
  isAlbumOnly: boolean;
  isUnavailable: boolean;
  singers: string;
  producers: string;
  description: string;
  translator: string;
  isOfficialTranslation: boolean;
  categoriesRaw: string;
}

export interface LyricRowData {
  customStyle: string;
  original: string;
  romanized?: string;
  english?: string;
  additionalColumns?: string[];

  getWikitextOfSingleCell: (contents?: string) => string;
  toWikitext: (printEmptyEnglishColumn?: boolean) => string;
}

export interface PlayLinkData {
  site: string;
  url: string;
  isReprint: boolean;
  isAutogen: boolean;
  isDeleted: boolean;
  viewCount: string;

  isOfficiallyAvailable: () => boolean;
  toWikitext: () => string;
  getFormattedViewCount: () => string;
}

export interface ExternalLink {
  url: string;
  description: string;
  isOfficial: boolean;
  isMedia?: boolean;
  isInactive?: boolean;
  mapToAlbumInfoboxReadMoreParam: string | null;

  toWikitext: () => string;
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
  engines: string[];
  vdbAlbumId: string;
  vocaWikiPage: string;
  categoriesRaw: string;
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
  label: string;
  languageIds: number[];
  engines: string[];
  description: string;
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
  forAlbums: boolean;
  isCompilation?: boolean;

  toWikitext: () => string;
}

export interface LyricsEditorFormData {
  translator: string;
  isOfficialTranslation: boolean;
}

export interface DisplayErrorContents {
  errors: string[];
  warnings: string[];
  recommendToAutoloadCategories: boolean;
}