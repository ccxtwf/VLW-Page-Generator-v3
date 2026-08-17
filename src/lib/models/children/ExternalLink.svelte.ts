import { preprocessStringParams } from "../../utils/utils";
import RegexUtils from "../../utils/regexUtils";
import { VOCALOID_LYRICS_WIKI_NAME } from "../../../config";
import type { IExternalLink } from "../schema";

export default class ExternalLink implements IExternalLink {
  url: string = $state("");
  description: string = $state("");
  isOfficial: boolean = $state(false);
  isInactive: boolean = $state(false);

  constructor({
    url = "",
    description = "",
    isOfficial = false,
    isInactive = false,
  }: {
    url?: string;
    description?: string;
    isOfficial?: boolean;
    isInactive?: boolean;
  } = {}) {
    this.url = url;
    this.description = description;
    this.isOfficial = isOfficial;
    this.isInactive = isInactive;
  }

  preprocess() {
    preprocessStringParams(this, ["url", "description"]);
    this.isOfficial = this.isOfficial || false;
  }

  getWikitext(): string {
    let wikitext: string = "";
    const { url, description, isInactive } = this;

    const rm: [RegExp, RegExpExecArray | null][] = [
      RegexUtils.rxVocadb,
      RegexUtils.rxMiraheze,
      RegexUtils.rxFandom,
      RegexUtils.rxHmWiki,
      RegexUtils.rxMgp,
    ].map((rx) => [rx, rx.exec(url)]);
    for (const [rx, m] of rm) {
      if (m === null) {
        continue;
      }
      if (rx === RegexUtils.rxVocadb) {
        wikitext = `{{VDB|${m[1]}}}${description === "VocaDB" ? "" : " - " + description}`;
      }
      if (rx === RegexUtils.rxMiraheze) {
        const [_, p1, p2] = m;
        if (p1 === VOCALOID_LYRICS_WIKI_NAME) {
          const isCategory = /^[Cc]at(?:egory|)/.test(p2);
          wikitext = `[[${isCategory ? ":" : ""}${p2}|${description}]]`;
        } else if (p1 in RegexUtils.RECOGNIZED_MH_INTERWIKI) {
          wikitext = `{{${RegexUtils.RECOGNIZED_MH_INTERWIKI[p1]}|${p2}|${description}}}`;
        } else {
          wikitext = `[[mh:${p1}:${p2}|${description}]]`;
        }
      }
      if (rx === RegexUtils.rxFandom) {
        const [_, p1, p2] = m;
        if (p1 in RegexUtils.RECOGNIZED_FANDOM_INTERWIKI) {
          wikitext = `{{${RegexUtils.RECOGNIZED_FANDOM_INTERWIKI[p1]}|${p2}|${description}}}`;
        } else {
          wikitext = `{{FandomWiki|${p1}|${p2}|${description}}}`;
        }
      }
      if (rx === RegexUtils.rxHmWiki) {
        wikitext = `{{HMWiki|${m[1]}}}`;
      }
      if (rx === RegexUtils.rxMgp) {
        wikitext = `{{MGP|${decodeURIComponent(m[1])}|Moegirlpedia}}`;
      }
      break;
    }

    if (!wikitext) {
      wikitext = `[${url} ${description}]`;
    }
    if (isInactive) {
      wikitext = `<s>${wikitext}</s>`;
    }
    return wikitext;
  }

  toJSON(): IExternalLink {
    const { url, description, isInactive, isOfficial } = this;
    return {
      url,
      description,
      isInactive,
      isOfficial,
    };
  }
}