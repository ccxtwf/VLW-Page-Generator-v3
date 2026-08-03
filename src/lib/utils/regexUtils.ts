import { VOCADB_ENTRYPOINT } from "../../config";
import { escapeRegExp } from "./utils";

export default class RegexUtils {
  static RECOGNIZED_MH_INTERWIKI: Record<string, string> = {
    nndcompass: "nndcompass",
    projectsekai: "sekaipedia",
    bandori: "bandori",
  };

  static RECOGNIZED_FANDOM_INTERWIKI: Record<string, string> = {
    vocaloid: "vocaloid",
    synthv: "synthv",
    cevio: "cevio",
    deepvocal: "deepvocal",
    utau: "utau",
    utaite: "utaite",
    virtualyoutuber: "vtuber",
    odorite: "odorite",
    projectsekai: "proseka",
    bandori: "bandori",
  };

  static rxVocadb = new RegExp(`^${escapeRegExp(VOCADB_ENTRYPOINT)}`);
  static rxMiraheze = /^https?:\/\/(.*?).miraheze\.org\/wiki\/(.*)/;
  static rxFandom = /^https?:\/\/(.*?).fandom\.com\/wiki\/(.*)/;
  static rxHmWiki = /^https?:\/\/w\.atwiki\.jp\/hmiku\/pages\/(\d+)\.html$/;
  static rxMgp = /^https?:\/\/zh\.moegirl\.org\.cn\/(.+)$/;
  static rxUtau = /^https?:\/\/w\.atwiki\.jp\/utauuuta\/pages\/(\d*)\.html/;
  static rxNicopedia = /^https?:\/\/dic\.nicovideo\.jp\/id\/(.*)$/;
  static rxNicotag = /^https?:\/\/www\.nicovideo\.jp\/tag\/(.*)$/;
}
