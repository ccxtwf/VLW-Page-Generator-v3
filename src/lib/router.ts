import { writable } from "svelte/store";

export const ROUTES = [
  {
    path: "/songs",
    component: "./lib/pages/SongPage.svelte",
    labelKey: "songGenerator",
  },
  {
    path: "/albums",
    component: "./lib/pages/AlbumPage.svelte",
    labelKey: "albumGenerator",
  },
  {
    path: "/producers",
    component: "./lib/pages/ProducerPage.svelte",
    labelKey: "producerGenerator",
  },
  {
    path: "/lyrics-editor",
    component: "./lib/pages/LyricsEditorPage.svelte",
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