import { writable } from "svelte/store";

export const ROUTES = [
  {
    path: "/songs",
    component: "./lib/pages/SongPage.svelte",
    label: "Song Page Generator",
  },
  {
    path: "/albums",
    component: "./lib/pages/AlbumPage.svelte",
    label: "Album Page Generator",
  },
  {
    path: "/producers",
    component: "./lib/pages/ProducerPage.svelte",
    label: "Producer Page Generator",
  },
  {
    path: "/lyrics-editor",
    component: "./lib/pages/LyricsEditorPage.svelte",
    label: "Lyrics Editor",
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