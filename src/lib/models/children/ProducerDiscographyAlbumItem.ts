import ProducerDiscographySongItem from "./ProducerDiscographySongItem";

export default class ProducerDiscographyAlbumItem extends ProducerDiscographySongItem {
  constructor(
    public page: string,
    public additionalParameters: string,
    public isCompilation: boolean,
  ) {
    super(page, additionalParameters);
  }

  static createDefault() {
    return new ProducerDiscographyAlbumItem("", "", false);
  }

  preprocess(): void {
    super.preprocess();
    this.isCompilation = this.isCompilation || false;
  }

  getWikitext(): string {
    return this._getWikitext("awt row");
  }
}
