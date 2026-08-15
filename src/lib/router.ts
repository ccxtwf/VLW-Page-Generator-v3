import { writable } from "svelte/store";

export const ROUTES = [
  {
    path: "/songs",
    loader: () => import("./pages/SongPage.svelte"),
    labelKey: "songGenerator",
  },
  {
    path: "/albums",
    loader: () => import("./pages/AlbumPage.svelte"),
    labelKey: "albumGenerator",
  },
  {
    path: "/producers",
    loader: () => import("./pages/ProducerPage.svelte"),
    labelKey: "producerGenerator",
  },
  {
    path: "/lyrics-editor",
    loader: () => import("./pages/LyricsEditorPage.svelte"),
    labelKey: "lyricsEditor",
  },
];

function getHash() {
  return window.location.hash.slice(1) || "/";
}

export const currentRoute = writable(getHash());

window.addEventListener("hashchange", () => {
  currentRoute.set(getHash());
});

export function navigate(path: string) {
  window.location.hash = path;
}
