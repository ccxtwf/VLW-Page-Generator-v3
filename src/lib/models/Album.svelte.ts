import type { BaseModel, PreprocessorMixin } from "./base";
import type { IAlbum, IImageEmbed } from "./schema";
import AlbumBroadcastLink from "./children/AlbumBroadcastLink.svelte";
import AlbumTrackData from "./children/AlbumTrackData.svelte";
import ExternalLink from "./children/ExternalLink.svelte";

import { preprocessStringParams } from "../utils/utils";
import type { MultiSelectItem } from "../../schemas/form";
import { ALBUM_STREAMING_LINKS } from "../../constants";

export default class Album implements BaseModel<IAlbum> {
  origTitle: string = $state("");
  romTitle: string = $state("");
  engTitle: string = $state("");
  bgColour: string = $state("black");
  fgColour: string = $state("white");
  label: string = $state("");
  description: string = $state("");
  isCompilationAlbum: boolean = $state(false);
  publishedYear: string = $state("");
  publishedMonth: string = $state("");
  publishedDay: string = $state("");
  engines: MultiSelectItem[] = $state([]);
  vdbAlbumId: string = $state("");
  vocaWikiPage: string = $state("");
  categoriesRaw: string = $state("");

  image: IImageEmbed | null = $state(null);

  tracklist: AlbumTrackData[] = $state([]);
  broadcastLinks: AlbumBroadcastLink[] = $state([]);
  extLinks: ExternalLink[] = $state([]);

  categories: string[] = [];

  constructor(data: Partial<IAlbum> = {}) {
    this.resetHotTables();
    Object.assign(this, data);
  }

  updateState(data: Partial<IAlbum>): void {
    Object.assign(this, data);
  }

  resetHotTables(): void {
    this.tracklist = Array(12)
      .fill(null)
      .map(() => new AlbumTrackData());
    this.broadcastLinks = ALBUM_STREAMING_LINKS.map(
      ({ name }, idx) => new AlbumBroadcastLink({ idx, site: name }),
    );
    this.extLinks = Array(5)
      .fill(null)
      .map(() => new ExternalLink());
  }

  preprocess(): void {
    preprocessStringParams(this, [
      "origTitle",
      "romTitle",
      "engTitle",
      "bgColour",
      "fgColour",
      "label",
      "description",
      "publishedYear",
      "publishedMonth",
      "publishedDay",
      "vdbAlbumId",
      "vocaWikiPage",
      "categoriesRaw",
    ]);
    this.engines = this.engines || [];
    this.tracklist = this.tracklist || [];
    this.broadcastLinks = this.broadcastLinks || [];
    this.extLinks = this.extLinks || [];

    this.categories = this.categoriesRaw ? this.categoriesRaw.split("\n") : [];

    for (const a of [this.tracklist, this.broadcastLinks, this.extLinks] as PreprocessorMixin[][]) {
      a.forEach((e) => e.preprocess());
    }
  }
}