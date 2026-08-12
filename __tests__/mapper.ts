import { LANGUAGES, SYNTH_ENGINES, ALBUM_STREAMING_LINKS } from "../src/constants";
import AlbumBroadcastLink from "../src/lib/models/children/AlbumBroadcastLink.svelte";
import { type MultiSelectItem } from "../src/schemas/form.d";

export const mapLanguages = (...languages: string[]): MultiSelectItem[] => {
  return languages.map((l) => ({
    label: l,
    value: LANGUAGES.findIndex((o) => o.name === l),
  }));
};

export const mapEngines = (...engines: string[]): MultiSelectItem[] => {
  return engines.map((e) => {
    const engine = SYNTH_ENGINES.find((o) => o.name === e);
    if (!engine) {
      throw new Error(`Error: Unable to find engine '${e}' in synthEngines.json`);
    }
    return {
      label: engine.name,
      value: engine.id,
    };
  });
};

export const mapAlbumBroadcastLink = (
  ...args: { key: string; url: string }[]
): AlbumBroadcastLink[] => {
  const res = ALBUM_STREAMING_LINKS.map(
    ({ name }, idx) => new AlbumBroadcastLink({ idx, site: name }),
  );
  for (const { key, url } of args) {
    const idx = ALBUM_STREAMING_LINKS.findIndex((al) => al.paramKey === key);
    if (idx === -1) {
      throw new Error(`Error: Unable to find paramKey '${key}' in albumLinkDomains.json`);
    }
    res[idx].url = url;
  }
  return res;
};
