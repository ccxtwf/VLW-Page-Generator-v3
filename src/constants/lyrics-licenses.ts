export interface LicenseItem {
  readonly label: string;
  readonly desc: string;
  readonly url?: string;
  readonly linkCaption?: string;
}

export const lyricsLicenses: Record<string, LicenseItem> = {
  permission: {
    label: "Uploaded With Permission",
    desc: "The lyrics on this page are presented with explicit permission from the copyright holder.",
  },
  self: {
    label: "Uploaded by Self",
    desc: "The lyrics on this page were uploaded by the copyright holder.",
  },
  pd: {
    label: "Public Domain",
    desc: "The lyrics on this page have been released under the $1.",
    url: "https://creativecommons.org/public-domain/",
    linkCaption: "Public Domain",
  },
  cc0: {
    label: "CC0",
    desc: "The lyrics on this page are licensed under the $1.",
    url: "https://creativecommons.org/publicdomain/zero/1.0/",
    linkCaption: "CC0 License",
  },
  "cc-by-nc-sa": {
    label: "CC BY-NC-SA 4.0",
    desc: "The lyrics on this page are licensed under $1.",
    url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    linkCaption: "CC BY-NC-SA 4.0",
  },
  "cc-by-nc-nd": {
    label: "CC BY-NC-ND 4.0",
    desc: "The lyrics on this page are licensed under $1.",
    url: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
    linkCaption: "CC BY-NC-ND 4.0",
  },
  "cc-by-nc": {
    label: "CC BY-NC 4.0",
    desc: "The lyrics on this page are licensed under $1.",
    url: "https://creativecommons.org/licenses/by-nc/4.0/",
    linkCaption: "CC BY-NC 4.0",
  },
  "cc-by-nd": {
    label: "CC BY-ND 4.0",
    desc: "The lyrics on this page are licensed under $1.",
    url: "https://creativecommons.org/licenses/by-nd/4.0/",
    linkCaption: "CC BY-ND 4.0",
  },
  "cc-by-sa": {
    label: "CC BY-SA 4.0",
    desc: "The lyrics on this page are licensed under $1.",
    url: "https://creativecommons.org/licenses/by-sa/4.0/",
    linkCaption: "CC BY-SA 4.0",
  },
  "cc-by": {
    label: "CC BY 4.0",
    desc: "The lyrics on this page are licensed under $1.",
    url: "https://creativecommons.org/licenses/by/4.0/",
    linkCaption: "CC BY 4.0",
  },
  "cc-by-nc-sa-3": {
    label: "CC BY-NC-SA 3.0",
    desc: "The lyrics on this page are licensed under $1.",
    url: "https://creativecommons.org/licenses/by-nc-sa/3.0/",
    linkCaption: "CC BY-NC-SA 3.0",
  },
  "cc-by-nc-nd-3": {
    label: "CC BY-NC-ND 3.0",
    desc: "The lyrics on this page are licensed under $1.",
    url: "https://creativecommons.org/licenses/by-nc-nd/3.0/",
    linkCaption: "CC BY-NC-ND 3.0",
  },
  "cc-by-nc-3": {
    label: "CC BY-NC 3.0",
    desc: "The lyrics on this page are licensed under $1.",
    url: "https://creativecommons.org/licenses/by-nc/3.0/",
    linkCaption: "CC BY-NC 3.0",
  },
  "cc-by-nd-3": {
    label: "CC BY-ND 3.0",
    desc: "The lyrics on this page are licensed under $1.",
    url: "https://creativecommons.org/licenses/by-nd/3.0/",
    linkCaption: "CC BY-ND 3.0",
  },
  "cc-by-sa-3": {
    label: "CC BY-SA 3.0",
    desc: "The lyrics on this page are licensed under $1.",
    url: "https://creativecommons.org/licenses/by-sa/3.0/",
    linkCaption: "CC BY-SA 3.0",
  },
  "cc-by-3": {
    label: "CC BY 3.0",
    desc: "The lyrics on this page are licensed under $1.",
    url: "https://creativecommons.org/licenses/by/3.0/",
    linkCaption: "CC BY 3.0",
  },
  "piapro-nc": {
    label: "Piapro (NC)",
    desc: "The lyrics on this page are licensed under $1 under non-commercial usage.",
    url: "https://piapro.jp/license/pc/icon",
    linkCaption: "the piapro creators' platform license",
  },
  "piapro-nm": {
    label: "Piapro (NM)",
    desc: "The lyrics on this page are licensed under $1 which specifies usage without allowance for alteration or modification.",
    url: "https://piapro.jp/license/pc/icon",
    linkCaption: "the piapro creators' platform license",
  },
  "piapro-by": {
    label: "Piapro (BY)",
    desc: "The lyrics on this page are licensed under $1 which specifies usage with attribution to the original creators.",
    url: "https://piapro.jp/license/pc/icon",
    linkCaption: "the piapro creators' platform license",
  },
  "piapro-nc-nm": {
    label: "Piapro (NC-NM)",
    desc: "The lyrics on this page are licensed under $1 which specifies non-commercial usage without allowance for alteration or modification.",
    url: "https://piapro.jp/license/pc/icon",
    linkCaption: "the piapro creators' platform license",
  },
  "piapro-nc-by": {
    label: "Piapro (NC-BY)",
    desc: "The lyrics on this page are licensed under $1 which specifies non-commercial usage with attribution to the original creators.",
    url: "https://piapro.jp/license/pc/icon",
    linkCaption: "the piapro creators' platform license",
  },
  "piapro-nm-by": {
    label: "Piapro (NM-BY)",
    desc: "The lyrics on this page are licensed under $1 which specifies usage with attribution to the original creators and without allowance for alteration or modification.",
    url: "https://piapro.jp/license/pc/icon",
    linkCaption: "the piapro creators' platform license",
  },
  "piapro-nc-nm-by": {
    label: "Piapro (NC-NM-BY)",
    desc: "The lyrics on this page are licensed under $1 which specifies non-commercial usage with attribution to the original creators and without allowance for alteration or modification.",
    url: "https://piapro.jp/license/pc/icon",
    linkCaption: "the piapro creators' platform license",
  },
  fairuse: {
    label: "Fair Use",
    desc: "The lyrics on this page are presented under $1, intended only for nonprofit educational purposes.",
    url: "https://www.copyright.gov/fair-use/",
    linkCaption: "the U.S. fair use doctrine",
  },
  custom: {
    label: "Custom License",
    desc: "Custom License",
  },
} as const;

export type LyricsLicenseKey = keyof typeof lyricsLicenses;

export const lyricsLicenseMenuGroups: { group: string; items: LyricsLicenseKey[] }[] = [
  {
    group: "fairuse",
    items: ["fairuse"],
  },
  {
    group: "upload",
    items: ["permission", "self"],
  },
  {
    group: "public-domain",
    items: ["pd", "cc0"],
  },
  {
    group: "creative-commons",
    items: [
      "cc-by-nc-sa",
      "cc-by-nc-nd",
      "cc-by-nc",
      "cc-by-nd",
      "cc-by-sa",
      "cc-by",
      "cc-by-nc-sa-3",
      "cc-by-nc-nd-3",
      "cc-by-nc-3",
      "cc-by-nd-3",
      "cc-by-sa-3",
      "cc-by-3",
    ],
  },
  {
    group: "piapro",
    items: [
      "piapro-nc",
      "piapro-nm",
      "piapro-by",
      "piapro-nc-nm",
      "piapro-nc-by",
      "piapro-nm-by",
      "piapro-nc-nm-by",
    ],
  },
  {
    group: "custom",
    items: ["custom"],
  },
] as const;

export const defaultLyricsLicense: LyricsLicenseKey = "fairuse";