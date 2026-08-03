import { preprocessStringParams } from "../../utils/utils";
import { AlbumPageValidationErrorType } from "../../validationErrors/types";

export default class AlbumTrackData {
  constructor(
    public discNo: number | string,
    public trackNo: number | string,
    public pageTitle: string,
    public producerCredit: string,
    public singerCredit: string,
  ) {}

  static createDefault(): AlbumTrackData {
    return new AlbumTrackData("", "", "", "", "");
  }

  preprocess(): void {
    this.discNo = ("" + this.discNo || "").trim();
    this.trackNo = ("" + this.trackNo || "").trim();
    preprocessStringParams(this, ["pageTitle", "producerCredit", "singerCredit"]);
  }

  validate(): AlbumPageValidationErrorType[] {
    const res: AlbumPageValidationErrorType[] = [];
    if (this.trackNo === "") {
      res.push(AlbumPageValidationErrorType.NO_TRACK_LIST_NUMBERING);
    }
    if (this.discNo !== "" && isNaN(+this.discNo)) {
      res.push(AlbumPageValidationErrorType.DISC_NUMBER_IS_NOT_NUMERIC);
    }
    if (this.trackNo !== "" && isNaN(+this.trackNo)) {
      res.push(AlbumPageValidationErrorType.TRACK_NUMBER_IS_NOT_NUMERIC);
    }
    if (this.pageTitle === "") {
      res.push(AlbumPageValidationErrorType.EMPTY_TRACK_NAME);
    }
    if (this.singerCredit === "" && this.producerCredit === "") {
      res.push(AlbumPageValidationErrorType.EMPTY_TRACK_CREDITS);
    }
    return res;
  }

  getCredits(): string {
    let credits: string = this.singerCredit;
    if (this.producerCredit !== "") {
      credits = `${this.producerCredit} ft. ${credits}`;
    }
    return credits;
  }
}
