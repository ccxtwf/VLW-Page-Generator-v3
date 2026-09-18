/**
 * Domains
 */
export const VOCALOID_LYRICS_WIKI_NAME = "vocaloidlyrics" as const;
export const VOCALOID_LYRICS_WIKI_DOMAIN = `${VOCALOID_LYRICS_WIKI_NAME}.miraheze.org` as const;
export const VOCALOID_WIKI_DOMAIN = "vocaloid.fandom.com" as const;
export const VOCADB_DOMAIN = "vocadb.net" as const;

/**
 * Entrypoints
 */
export const VOCALOID_LYRICS_WIKI_ARTICLE_ENTRYPOINT =
  `https://${VOCALOID_LYRICS_WIKI_DOMAIN}/wiki/` as const;
export const VOCALOID_LYRICS_WIKI_API_ENTRYPOINT =
  `https://${VOCALOID_LYRICS_WIKI_DOMAIN}/w/api.php` as const;
export const VOCALOID_WIKI_ARTICLE_ENTRYPOINT = `https://${VOCALOID_WIKI_DOMAIN}/wiki/` as const;
export const VOCADB_ENTRYPOINT = `https://${VOCADB_DOMAIN}/` as const;

/**
 * Misc
 */
export const HANDSONTABLE_LICENSE_KEY = "non-commercial-and-evaluation";