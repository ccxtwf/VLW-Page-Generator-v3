import type { ProducerPageFormData } from "../../schemas/form";

import { ProducerPageValidationErrorType } from "./enums";
import { getErrorForProducerValidation } from ".";
import type { ValidationError, ValidationBundledErrors } from ".";

import { preprocessStringParams } from "../utils/utils";
import LANGUAGES from "../../constants/languages.json";

export function validate(
  formData: ProducerPageFormData,
): ValidationBundledErrors<ProducerPageValidationErrorType> {
  preprocessStringParams(formData, [
    "prodCategory",
    "prodAliases",
    "affiliations",
    "labels",
    "description",
  ]);
  let { prodCategory, roles, languages, description }: ProducerPageFormData = formData;

  const errors: ValidationError<ProducerPageValidationErrorType>[] = [];

  if (prodCategory === "") {
    errors.push(
      getErrorForProducerValidation(ProducerPageValidationErrorType.NO_PRODUCER_CATEGORY),
    );
  }

  if (languages.length === 0) {
    errors.push(
      getErrorForProducerValidation(ProducerPageValidationErrorType.LANGUAGE_IS_NOT_SELECTED),
    );
  }

  if (Object.values(roles).every((el) => !el)) {
    errors.push(
      getErrorForProducerValidation(ProducerPageValidationErrorType.PRODUCER_ROLE_IS_NOT_SELECTED),
    );
  }

  if (description === "") {
    errors.push(
      getErrorForProducerValidation(ProducerPageValidationErrorType.DESCRIPTION_IS_NOT_SET),
    );
  }

  /*
  if (extLinks.length === 0) {
    errors.push(getErrorForProducerValidation(ProducerPageValidationErrorType.EXTERNAL_LINK_IS_NOT_LISTED));
  } else {
    if (extLinks.every(link => !link.isOfficial)) {
      errors.push(getErrorForProducerValidation(ProducerPageValidationErrorType.EXTERNAL_LINK_IS_NOT_OFFICIAL));
    }
  }

  if (songList.length === 0) {
    errors.push(getErrorForProducerValidation(ProducerPageValidationErrorType.NO_SONG_PAGE));
  }
  */

  const fatal = errors.some(({ fatal }) => fatal);
  return { errors, autoloadCategories: false, fatal };
}

export function generatePage(formData: ProducerPageFormData): string {
  const {
    prodCategory,
    splitAlbum,
    prodAliases,
    roles,
    affiliations,
    labels,
    languages,
    engines,
    description,
  } = formData;

  let extLinksSegment: string = "";
  let categories: string[] = ["Producers"];

  /*
  let officialLinks: string = extLinks
    .filter(link => link.isOfficial && !link.isMedia)
    .map(link => (
      `* ${link.description}: [${link.url} ]\n`
    ))
    .join('');
  let mediaLinks: string = extLinks
    .filter(link => link.isOfficial && link.isMedia)
    .map(link => `* ${link.getWikitext()}\n`)
    .join('');
  let unofficialLinks: string = generateUnofficialProdLinks(
    extLinks.filter(link => !link.isOfficial)
  );
  
  extLinksSegment += `==External links==\n`;
  extLinksSegment += officialLinks === '' ? '' : officialLinks + '\n';
  extLinksSegment += mediaLinks === '' ? '' : `===Media===\n${mediaLinks}\n`;
  extLinksSegment += unofficialLinks === '' ? '' : `===Unofficial===\n${unofficialLinks}`;
  */

  for (const [role, isChecked] of Object.entries(roles)) {
    if (isChecked) {
      categories.push(`${role.replace(/^\w/, (firstLetter) => firstLetter.toUpperCase())}s`);
    }
  }
  for (let { value } of languages) {
    let lang: string = LANGUAGES[value]?.name || "";
    categories.push(`${lang} original producers`);
  }
  for (let engine of engines) {
    categories.push(`Producers using ${engine}`);
  }

  /*
  let albumListSegment = '';
  if (albumList.length > 0) {
    if (splitAlbum) {
      const originalAlbums = [];
      const compilationAlbums = [];
      for (const album of albumList) {
        if (album.isCompilation) {
          compilationAlbums.push(album);
        } else {
          originalAlbums.push(album);
        }
      }
      albumListSegment = "==Discography==\n";
      if (originalAlbums.length > 0) {
        albumListSegment += (
          `{| class=\"sortable producer-table\"\n${
            ''
          }|- class=\"vcolor-default\"\n${
            ''
          }! {{awt head}}\n` +
          originalAlbums
            .map(album => `|-\n| ${album.toTemplate()}\n`).join('') + '|}\n'
        );
      }
      if (originalAlbums.length > 0 && compilationAlbums.length > 0) {
        albumListSegment += "\n";
      }
      if (compilationAlbums.length > 0) {
        albumListSegment += (
          `===Compilations===\n{| class=\"sortable producer-table\"\n${
            ''
          }|- class=\"vcolor-default\"\n${
            ''
          }! {{awt head}}\n` +
          compilationAlbums
            .map(album => `|-\n| ${album.toTemplate()}\n`).join('') + '|}\n'
        );
      }
    } else {
      albumListSegment = (
        `==Discography==\n${
          ''
        }{| class=\"sortable producer-table\"\n${
          ''
        }|- class=\"vcolor-default\"\n${
          ''
        }! {{awt head}}\n` +
        albumList.map(album => `|-\n| ${album.toTemplate()}\n`).join('') + '|}\n'
      );
    }
  }
  */

  return `
<div class="producer-links">
[[File:<PRODUCER PROFILE PICTURE IMAGE FILE>|250px|center]]
==Producer categories==
{{ProdLinks|${prodCategory}}}
${labels === "" ? "" : `==Labels==\n${labels}\n`}${
    affiliations === "" ? "" : `==Affiliations==\n${affiliations}\n`
  }
${extLinksSegment}</div>

${description}

==Works==${prodAliases === "" ? "" : `\n{{pwt alias|${prodAliases}}}`}
{| class="sortable producer-table"
|- class="vcolor-default"
! {{pwt head}}
${
  ""
  // songList.map(song => `|-\n| ${song.toTemplate()}\n`).join('')
}|}

${
  ""
  // albumListSegment
}
${categories.map((cat) => `[[Category:${cat}]]`).join("\n")}`.trim();
}