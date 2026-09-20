import type { BaseModel, PreprocessorMixin } from "./base";
import type { IImageEmbed, ISong } from "./schema";
import LyricRow from "./children/LyricsRow.svelte";
import PlayLink from "./children/PlayLink.svelte";
import ExternalLink from "./children/ExternalLink.svelte";

import { preprocessStringParams } from "../utils/utils";
import type { MultiSelectItem } from "../../schemas/form";
import { PV_SERVICE_PROVIDER } from "../../constants";
import { ENUM_AI_WARNING_TYPE, ENUM_CW_STATES, ENUM_SONG_TYPE } from "./enums";

export default class Song implements BaseModel<ISong> {
  aiCwState: ENUM_AI_WARNING_TYPE = $state(ENUM_AI_WARNING_TYPE.none);
  aiWarningText1: string = $state("");
  aiWarningText2: string = $state("");
  cwState: ENUM_CW_STATES = $state(ENUM_CW_STATES.noWarnings);
  cwText: string = $state("");
  hasEpilepsyWarning: boolean = $state(false);
  languages: MultiSelectItem[] = $state([]);
  isoLangCode: string = $state("");
  origTitle: string = $state("");
  altChTitle: string = $state("");
  altChIsTraditional: boolean = $state(true);
  romTitle: string = $state("");
  engTitle: string = $state("");
  titleIsOfficiallyTranslated: boolean = $state(false);
  bgColour: string = $state("black");
  fgColour: string = $state("white");
  uploadDateRaw: string = $state("");
  isAlbumOnly: boolean = $state(false);
  isUnavailable: boolean = $state(false);
  isDemonstration: boolean = $state(false);
  songType: ENUM_SONG_TYPE = $state(ENUM_SONG_TYPE.original);
  singers: string = $state("");
  producers: string = $state("");
  description: string = $state("");
  translator: string = $state("");
  isOfficialTranslation: boolean = $state(false);
  categoriesRaw: string = $state("");

  images: IImageEmbed[] = $state([]);

  lyrics: LyricRow[] = $state([]);
  playLinks: PlayLink[] = $state([]);
  extLinks: ExternalLink[] = $state([]);

  uploadDate?: Date | null = null;
  categories: string[] = [];

  constructor(data: Partial<ISong> = {}) {
    this.resetHotTables();
    Object.assign(this, data);
  }

  updateState(data: Partial<ISong>): void {
    Object.assign(this, data);
  }

  resetHotTables(): void {
    this.resetLyrics();
    this.playLinks = [
      PV_SERVICE_PROVIDER.niconico,
      PV_SERVICE_PROVIDER.youtube,
      PV_SERVICE_PROVIDER.bilibili,
      PV_SERVICE_PROVIDER.soundcloud,
      PV_SERVICE_PROVIDER.bandcamp,
    ].map((site) => new PlayLink({ site }));
    this.extLinks = Array(5)
      .fill(null)
      .map(() => new ExternalLink());
  }

  resetLyrics(): void {
    this.lyrics = Array(20)
      .fill(null)
      .map(() => new LyricRow());
  }

  preprocess(): void {
    preprocessStringParams(this, [
      "aiWarningText1",
      "aiWarningText2",
      "cwText",
      "isoLangCode",
      "origTitle",
      "altChTitle",
      "romTitle",
      "engTitle",
      "bgColour",
      "fgColour",
      "uploadDateRaw",
      "singers",
      "producers",
      "description",
      "translator",
      "categoriesRaw",
    ]);
    this.uploadDate = this.uploadDateRaw ? new Date(this.uploadDateRaw) : null;
    this.categories = this.categoriesRaw ? this.categoriesRaw.split("\n") : [];

    for (const a of [this.lyrics, this.playLinks, this.extLinks] as PreprocessorMixin[][]) {
      a.forEach((e) => e.preprocess());
    }
  }
}