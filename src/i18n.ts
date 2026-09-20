import { init, addMessages, _ } from "svelte-i18n";
import { get } from "svelte/store";

interface LocaleDictionary {
  [key: string]: LocaleDictionary | string | Array<string | LocaleDictionary> | null;
}

const enModules: Record<string, { default: LocaleDictionary }> = import.meta.glob(
  "./locales/en/*.json",
  { eager: true },
);

function buildLocale(locale: string, modules: Record<string, { default: LocaleDictionary }>) {
  for (const path in modules) {
    addMessages(locale, modules[path].default);
  }
}

const _locs = [{ locale: "en", modules: enModules }];

_locs.forEach(({ locale, modules }) => buildLocale(locale, modules));

// oxlint-disable-next-line no-floating-promises
init({
  fallbackLocale: "en",
  initialLocale: "en",
});

export const translate = get(_);