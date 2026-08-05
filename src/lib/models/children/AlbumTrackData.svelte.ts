import { preprocessStringParams } from "../../utils/utils";
import { AlbumPageValidationErrorType } from "../../validationErrors/types";
import type { IAlbumTrackData } from "../schema";

export default class AlbumTrackData implements IAlbumTrackData {
  discNo: number | string = $state("");
  trackNo: number | string = $state("");
  pageTitle: string = $state("");
  producerCredit: string = $state("");
  singerCredit: string = $state("");

  constructor({
    discNo = "",
    trackNo = "",
    pageTitle = "",
    producerCredit = "",
    singerCredit = "",
  }: {
    discNo?: number | string;
    trackNo?: number | string;
    pageTitle?: string;
    producerCredit?: string;
    singerCredit?: string;
  } = {}) {
    this.discNo = discNo;
    this.trackNo = trackNo;
    this.pageTitle = pageTitle;
    this.producerCredit = producerCredit;
    this.singerCredit = singerCredit;
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

  getWikitext(): string {
    let { discNo, trackNo, pageTitle } = this;
    discNo = discNo == "1" ? "" : discNo;
    return `|${discNo}tr${trackNo} = ${pageTitle}\n|${discNo}tr${trackNo}s = ${this.getCredits()}`;
  }

  toJSON(): IAlbumTrackData {
    const { discNo, trackNo, pageTitle, producerCredit, singerCredit } = this;
    return {
      discNo,
      trackNo,
      pageTitle,
      producerCredit,
      singerCredit,
    };
  }
}
