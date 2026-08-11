import { LANGUAGES, SYNTH_ENGINES, ALBUM_STREAMING_LINKS } from "../../src/constants";
import AlbumBroadcastLink from "../../src/lib/models/children/AlbumBroadcastLink.svelte";
import { type MultiSelectItem } from "../../src/schemas/form.d";

export const mapLanguages = (...languages: string[]): MultiSelectItem[] => {
  return languages.map((l) => ({
    label: l,
    value: LANGUAGES.findIndex((o) => o.name === l),
  }));
};

export const mapEngines = (...engines: string[]): MultiSelectItem[] => {
  return engines.map((e) => ({
    label: e,
    value: SYNTH_ENGINES.findIndex((o) => o.name === e),
  }));
};

export const mapAlbumBroadcastLink = (
  ...args: { key: string; url: string }[]
): AlbumBroadcastLink[] => {
  return args.map(({ key, url }) => {
    const idx = ALBUM_STREAMING_LINKS.findIndex((al) => al.paramKey === key);
    if (idx === -1) {
      throw new Error(`Error: Unable to find paramKey '${key}' in ALBUM_STREAMING_LINKS`);
    }
    return new AlbumBroadcastLink({ idx, site: ALBUM_STREAMING_LINKS[idx].name, url });
  });
};