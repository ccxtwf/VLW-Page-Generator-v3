import type { IProducerDiscographyAlbumItem } from "../schema";
import ProducerDiscographySongItem from "./ProducerDiscographySongItem.svelte";

export default class ProducerDiscographyAlbumItem
  extends ProducerDiscographySongItem
  implements IProducerDiscographyAlbumItem
{
  isCompilation: boolean = $state(false);

  constructor({
    page = "",
    additionalParameters = "",
    isCompilation = false,
  }: { page?: string; additionalParameters?: string; isCompilation?: boolean } = {}) {
    super({ page, additionalParameters });
    this.isCompilation = isCompilation;
  }

  preprocess(): void {
    super.preprocess();
    this.isCompilation = this.isCompilation || false;
  }

  getWikitext(): string {
    return ProducerDiscographyAlbumItem._getWikitext(
      "awt row",
      this.page,
      this.additionalParameters,
    );
  }

  toJSON(): IProducerDiscographyAlbumItem {
    const { page, additionalParameters, isCompilation } = this;
    return {
      page,
      additionalParameters,
      isCompilation,
    };
  }
}
