/**
 * This file was written by Gemini with a few human-made changes under the
 * following prompt:
 *
 * Now create component tests similar to this (see the notes for
 * `__tests__/components/songPageForm.test.ts`) but for
 * `src/lib/models?Album.svelte.ts` and `src/lib/models/Producer.svelte.ts`
 */

import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { page as screen, userEvent } from "vite-plus/test/browser";
import { render, RenderResult } from "vitest-browser-svelte";

import AlbumPageForm from "#src/lib/forms/AlbumPageForm.svelte";
import Album from "#src/lib/models/Album.svelte.ts";
import { validate, generatePage } from "#src/lib/logic/albums.svelte.ts";
import { mapAlbumBroadcastLink, mapEngines } from "../mapper";

// Mock import
vi.mock("#src/lib/logic/albums.svelte.ts", async () => {
  return {
    validate: vi
      .fn()
      .mockImplementation(() => ({ errors: [], autoloadCategories: false, fatal: true })),
    generatePage: vi.fn().mockImplementation(() => ["", ""]),
    autoloadCategories: vi.fn(),
    fetchDataFromVocaDb: vi.fn(),
  };
});
const validateMocked = vi.mocked(validate);
const generatePageMocked = vi.mocked(generatePage);

afterEach(() => {
  vi.clearAllMocks();
});

describe("albumPageForm - state should be bounded correctly", () => {
  async function submitFormAndComparePassedArgs(page: RenderResult<any, never>, expected: Album) {
    // Click Submit & assert the arguments that have been passed onto the expected functions
    await page.getByRole("button", { name: "Generate" }).click();
    expect(validateMocked).toHaveBeenCalledOnce();
    const [validateArgs] = validateMocked.mock.calls[0];
    //@ts-ignore
    expect(validateArgs).toEqualState(expected);
  }

  test("empty state", async () => {
    const page = await render(AlbumPageForm, { ongenerate: () => {} });
    const expected = new Album();
    expected.broadcastLinks.forEach((link) => link.preprocess());
    await submitFormAndComparePassedArgs(page, expected);
    expect(generatePageMocked).not.toHaveBeenCalled();
  });

  test("generate a page when the Ignore errors button is checked", async () => {
    const page = await render(AlbumPageForm, { ongenerate: () => {} });
    await page.getByRole("checkbox", { name: "Ignore Errors" }).click();
    const expected = new Album();
    expected.broadcastLinks.forEach((link) => link.preprocess());
    await submitFormAndComparePassedArgs(page, expected);
    expect(generatePageMocked).toHaveBeenCalled();
  });

  test("original title", async () => {
    const page = await render(AlbumPageForm, { ongenerate: () => {} });

    await page.getByRole("textbox", { name: "Original Title" }).fill("アンハッピーリフレイン");

    const expected = new Album({
      origTitle: "アンハッピーリフレイン",
    });
    expected.broadcastLinks.forEach((link) => link.preprocess());
    await submitFormAndComparePassedArgs(page, expected);
  });

  test("Romanized title", async () => {
    const page = await render(AlbumPageForm, { ongenerate: () => {} });

    await page.getByRole("textbox", { name: "Transliterated Title" }).fill("Anhappii Rifurein");

    const expected = new Album({
      romTitle: "Anhappii Rifurein",
    });
    expected.broadcastLinks.forEach((link) => link.preprocess());

    await submitFormAndComparePassedArgs(page, expected);
  });

  test("English title", async () => {
    const page = await render(AlbumPageForm, { ongenerate: () => {} });

    await page.getByRole("textbox", { name: "Translated Title" }).fill("Unhappy Refrain");

    const expected = new Album({
      engTitle: "Unhappy Refrain",
    });
    expected.broadcastLinks.forEach((link) => link.preprocess());

    await submitFormAndComparePassedArgs(page, expected);
  });

  test("Infobox colours - textbox", async () => {
    const page = await render(AlbumPageForm, { ongenerate: () => {} });

    await screen
      .elementLocator(
        page.baseElement.querySelector('#infobox-bg-color-picker input[type="color"]')!,
      )
      .fill("#474747");
    await screen
      .elementLocator(
        page.baseElement.querySelector('#infobox-fg-color-picker input[type="color"]')!,
      )
      .fill("#cccccc");

    const expected = new Album({
      bgColour: "#474747",
      fgColour: "#cccccc",
    });
    expected.broadcastLinks.forEach((link) => link.preprocess());

    await submitFormAndComparePassedArgs(page, expected);
  });

  test("Label", async () => {
    const page = await render(AlbumPageForm, { ongenerate: () => {} });

    await page.getByRole("textbox", { name: "Label" }).fill("KarenT");

    const expected = new Album({
      label: "KarenT",
    });
    expected.broadcastLinks.forEach((link) => link.preprocess());

    await submitFormAndComparePassedArgs(page, expected);
  });

  test("Description", async () => {
    const page = await render(AlbumPageForm, { ongenerate: () => {} });

    await page.getByRole("textbox", { name: "Description" }).fill("an album by wowaka");

    const expected = new Album({
      description: "an album by wowaka",
    });
    expected.broadcastLinks.forEach((link) => link.preprocess());

    await submitFormAndComparePassedArgs(page, expected);
  });

  test("Is compilation album", async () => {
    const page = await render(AlbumPageForm, { ongenerate: () => {} });

    await page.getByRole("checkbox", { name: "Is the album a compilation album?" }).click();

    const expected = new Album({
      isCompilationAlbum: true,
    });
    expected.broadcastLinks.forEach((link) => link.preprocess());

    await submitFormAndComparePassedArgs(page, expected);
  });

  test("Publication date", async () => {
    const page = await render(AlbumPageForm, { ongenerate: () => {} });

    await page.getByPlaceholder("year").fill("2011");
    await screen
      .elementLocator(page.baseElement.querySelector("#published-month")!)
      .selectOptions("May");
    await page.getByPlaceholder("day").fill("18");

    const expected = new Album({
      publishedYear: "2011",
      publishedMonth: "May",
      publishedDay: "18",
    });
    expected.broadcastLinks.forEach((link) => link.preprocess());

    await submitFormAndComparePassedArgs(page, expected);
  });

  test("Used synth engines", async () => {
    const page = await render(AlbumPageForm, { ongenerate: () => {} });

    await page.getByRole("combobox", { name: "Used Synth Engines" }).click();
    await page.getByRole("option", { name: "VOCALOID" }).click();
    await userEvent.keyboard("{Escape}");

    const expected = new Album({
      engines: mapEngines("VOCALOID"),
    });
    expected.broadcastLinks.forEach((link) => link.preprocess());

    await submitFormAndComparePassedArgs(page, expected);

    vi.clearAllMocks();

    await page.getByRole("combobox", { name: "Used Synth Engines" }).click();
    await page.getByRole("option", { name: "UTAU" }).click();
    await userEvent.keyboard("{Escape}");

    expected.engines = mapEngines("VOCALOID", "UTAU");
    await submitFormAndComparePassedArgs(page, expected);
  });

  test("VocaDB Album Page ID", async () => {
    const page = await render(AlbumPageForm, { ongenerate: () => {} });

    await page.getByRole("textbox", { name: "VocaDB Album Page ID" }).fill("1234");

    const expected = new Album({
      vdbAlbumId: "1234",
    });
    expected.broadcastLinks.forEach((link) => link.preprocess());

    await submitFormAndComparePassedArgs(page, expected);
  });

  test("VOCALOID Wiki Page", async () => {
    const page = await render(AlbumPageForm, { ongenerate: () => {} });

    await page.getByRole("textbox", { name: "VOCALOID Wiki Page" }).fill("Unhappy Refrain (album)");

    const expected = new Album({
      vocaWikiPage: "Unhappy Refrain (album)",
    });
    expected.broadcastLinks.forEach((link) => link.preprocess());

    await submitFormAndComparePassedArgs(page, expected);
  });

  test.each([
    {
      id: "Niconico Crossfade",
      url: "https://www.nicovideo.jp/watch/sm30228946",
      paramKey: "nn-xfade",
    },
    {
      id: "YouTube Crossfade",
      url: "https://www.youtube.com/watch?v=in90fSCxGKs",
      paramKey: "yt-xfade",
    },
    {
      id: "Spotify",
      url: "https://open.spotify.com/album/3Ydz6UhhXxgsoj36DKSv9L",
      paramKey: "sp-embed",
    },
    {
      id: "YouTube Music Playlist",
      url: "https://music.youtube.com/playlist?list=OLAK5uy_lEg6rOZGRgRKv5_aXH7mI2jwdL6xDJEB4",
      paramKey: "yt-playlist",
    },
    {
      id: "Bandamp Embed ID",
      url: "836724426",
      paramKey: "bc-embed",
    },
    {
      id: "SoundCloud Crossfade",
      url: "https://soundcloud.com/Comic-and-Cosmic",
      paramKey: "sc-xfade",
    },
  ])("Official links - $id", async ({ id, url, paramKey }) => {
    const page = await render(AlbumPageForm, { ongenerate: () => {} });

    await page.getByRole("textbox", { name: id }).fill(url);

    const expected = new Album({
      broadcastLinks: mapAlbumBroadcastLink({ key: paramKey, url }),
    });
    expected.broadcastLinks.forEach((link) => link.preprocess());

    await submitFormAndComparePassedArgs(page, expected);
  });

  test("Categories", async () => {
    const page = await render(AlbumPageForm, { ongenerate: () => {} });

    await page
      .getByRole("textbox", { name: "Categories" })
      .fill(
        "Albums featuring VOCALOID\nAlbums featuring Hatsune Miku (VOCALOID)\nwowaka songs list/Albums",
      );

    const expected = new Album({
      categoriesRaw:
        "Albums featuring VOCALOID\nAlbums featuring Hatsune Miku (VOCALOID)\nwowaka songs list/Albums",
    });
    expected.broadcastLinks.forEach((link) => link.preprocess());

    expected.categories = [
      "Albums featuring VOCALOID",
      "Albums featuring Hatsune Miku (VOCALOID)",
      "wowaka songs list/Albums",
    ];
    await submitFormAndComparePassedArgs(page, expected);
  });
});
