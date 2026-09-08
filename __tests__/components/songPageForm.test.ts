/**
 * A large portion of this file was written by Gemini under the following prompt:
 *
 * modify the file `__tests__/components/songPageForm.test.ts` so it'd check if the
 * other properties in `Song` are correctly bounded to the relevant UI element.
 */

import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { page as screen, userEvent } from "vite-plus/test/browser";
import { render, RenderResult } from "vitest-browser-svelte";

import SongPageForm from "#src/lib/forms/SongPageForm.svelte";
import Song from "#src/lib/models/Song.svelte.ts";
import { validate, generatePage } from "#src/lib/logic/songs.svelte.ts";
import { ENUM_AI_WARNING_TYPE, ENUM_CW_STATES, ENUM_SONG_TYPE } from "#src/lib/models/enums.ts";
import { mapLanguages } from "../mapper";

// Mock import
vi.mock("#src/lib/logic/songs.svelte.ts", async () => {
  return {
    validate: vi
      .fn()
      .mockImplementation(() => ({ errors: [], autoloadCategories: false, fatal: true })),
    generatePage: vi.fn().mockImplementation(() => ["", ""]),
    autoloadCategories: vi.fn(),
    fetchDataFromVocaDb: vi.fn(),
    buildSongPageComponents: vi.fn(),
  };
});
const validateMocked = vi.mocked(validate);
const generatePageMocked = vi.mocked(generatePage);

afterEach(() => {
  vi.clearAllMocks();
});

describe("songPageForm - state should be bounded correctly", () => {
  async function submitFormAndComparePassedArgs(page: RenderResult<any, never>, expected: Song) {
    // Click Submit & assert the arguments that have been passed onto the expected functions
    await page.getByRole("button", { name: "Generate" }).click();
    expect(validateMocked).toHaveBeenCalledOnce();
    const [validateArgs] = validateMocked.mock.calls[0];
    //@ts-ignore
    expect(validateArgs).toEqualState(expected);
  }

  test("empty state", async () => {
    const page = await render(SongPageForm, { ongenerate: () => {} });
    await submitFormAndComparePassedArgs(page, new Song());
    expect(generatePageMocked).not.toHaveBeenCalled();
  });

  test("generate a page when the Ignore errors button is checked", async () => {
    const page = await render(SongPageForm, { ongenerate: () => {} });
    await page.getByRole("checkbox", { name: "Ignore Errors" }).click();
    await submitFormAndComparePassedArgs(page, new Song());
    expect(generatePageMocked).toHaveBeenCalled();
  });

  test("original title", async () => {
    const page = await render(SongPageForm, { ongenerate: () => {} });

    await page.getByRole("textbox", { name: "Original Title" }).fill("ローリングガール");

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        origTitle: "ローリングガール",
      }),
    );
  });

  test("Romanized title", async () => {
    const page = await render(SongPageForm, { ongenerate: () => {} });

    await page.getByRole("textbox", { name: "Transliterated Title" }).fill("Rooringu Gaaru");

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        romTitle: "Rooringu Gaaru",
      }),
    );
  });

  test("English title", async () => {
    const page = await render(SongPageForm, { ongenerate: () => {} });

    await page.getByRole("textbox", { name: "Translated Title" }).fill("Rolling Girl");

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        engTitle: "Rolling Girl",
      }),
    );
  });

  test("Title is officially translated?", async () => {
    const page = await render(SongPageForm, { ongenerate: () => {} });

    await page.getByRole("checkbox", { name: "Is an official title?" }).click();

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        titleIsOfficiallyTranslated: true,
      }),
    );
  });

  test("Questionable CW & CW Text", async () => {
    const page = await render(SongPageForm, { ongenerate: () => {} });

    await page.getByLabelText("Content Warnings").selectOptions("" + ENUM_CW_STATES.questionable);

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        cwState: ENUM_CW_STATES.questionable,
        cwText: "",
      }),
    );

    vi.clearAllMocks();

    await page.getByLabelText("Content Warnings").selectOptions("" + ENUM_CW_STATES.isNsfw);

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        cwState: ENUM_CW_STATES.isNsfw,
        cwText: "",
      }),
    );

    vi.clearAllMocks();

    await page.getByRole("textbox", { name: "e.g. violence/gore/sexual content" }).fill("nudity");

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        cwState: ENUM_CW_STATES.isNsfw,
        cwText: "nudity",
      }),
    );
  });

  test("Epilepsy Warning", async () => {
    const page = await render(SongPageForm, { ongenerate: () => {} });

    await page.getByRole("checkbox", { name: "Epileptic Warning" }).click();

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        hasEpilepsyWarning: true,
      }),
    );
  });

  test("GenAI CW & CW Text", async () => {
    const page = await render(SongPageForm, { ongenerate: () => {} });

    await page.getByLabelText("GenAI Warning").selectOptions("" + ENUM_AI_WARNING_TYPE.suspected);

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        aiCwState: ENUM_AI_WARNING_TYPE.suspected,
        aiWarningText1: "",
        aiWarningText2: "",
      }),
    );

    vi.clearAllMocks();

    await page.getByLabelText("GenAI Warning").selectOptions("" + ENUM_AI_WARNING_TYPE.verified);

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        aiCwState: ENUM_AI_WARNING_TYPE.verified,
        aiWarningText1: "",
        aiWarningText2: "",
      }),
    );

    vi.clearAllMocks();

    await page
      .getByRole("textbox", { name: "e.g. character illustration, lyrics" })
      .fill("illustration");

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        aiCwState: ENUM_AI_WARNING_TYPE.verified,
        aiWarningText1: "illustration",
        aiWarningText2: "",
      }),
    );

    vi.clearAllMocks();

    await page
      .getByRole("textbox", { name: "source/explanation of the AI" })
      .fill("producer's comments");

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        aiCwState: ENUM_AI_WARNING_TYPE.verified,
        aiWarningText1: "illustration",
        aiWarningText2: "producer's comments",
      }),
    );
  });

  test("Infobox colours - textbox", async () => {
    const page = await render(SongPageForm, { ongenerate: () => {} });

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

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        bgColour: "#474747",
        fgColour: "#cccccc",
      }),
    );
  });

  test("Song type", async () => {
    const page = await render(SongPageForm, { ongenerate: () => {} });

    await page.getByRole("radio", { name: "Cover song" }).click();

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        songType: ENUM_SONG_TYPE.cover,
      }),
    );

    vi.clearAllMocks();

    await page.getByRole("radio", { name: "Spin-off" }).click();

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        songType: ENUM_SONG_TYPE.spinOff,
      }),
    );
  });

  test("Song language", async () => {
    const page = await render(SongPageForm, { ongenerate: () => {} });

    await page.getByRole("combobox", { name: "Song Language" }).click();
    await page.getByRole("option", { name: "Japanese" }).click();
    await userEvent.keyboard("{Escape}");

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        languages: mapLanguages("Japanese"),
      }),
    );

    vi.clearAllMocks();

    await page.getByRole("combobox", { name: "Song Language" }).click();
    await page.getByRole("option", { name: "English" }).click();
    await userEvent.keyboard("{Escape}");

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        languages: mapLanguages("Japanese", "English"),
      }),
    );
  });

  test("Language ISO code", async () => {
    const page = await render(SongPageForm, { ongenerate: () => {} });

    await page.getByRole("textbox", { name: "Language ISO Code" }).fill("ja");

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        isoLangCode: "ja",
      }),
    );
  });

  test("Alternative Chinese title and script toggle", async () => {
    const page = await render(SongPageForm, { ongenerate: () => {} });

    await page.getByRole("combobox", { name: "Song Language" }).click();
    await page.getByRole("option", { name: "Mandarin" }).click();
    await userEvent.keyboard("{Escape}");

    await page.getByRole("textbox", { name: "Traditional Chinese Title" }).fill("深海少女");

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        languages: mapLanguages("Mandarin"),
        altChTitle: "深海少女",
        altChIsTraditional: true,
      }),
    );

    vi.clearAllMocks();

    const toggle = screen
      .elementLocator(page.baseElement.querySelector(".swap")!)
      .filter({ hasText: "繁⇔简 简⇔繁" });
    await toggle.click();

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        languages: mapLanguages("Mandarin"),
        altChTitle: "深海少女",
        altChIsTraditional: false,
      }),
    );
  });

  test("Upload date", async () => {
    const page = await render(SongPageForm, { ongenerate: () => {} });

    await page.getByRole("textbox", { name: "Upload Date" }).fill("2010-02-14");

    const expected = new Song({
      uploadDateRaw: "2010-02-14",
    });
    expected.uploadDate = new Date("2010-02-14");
    await submitFormAndComparePassedArgs(page, expected);
  });

  test("Singers", async () => {
    const page = await render(SongPageForm, { ongenerate: () => {} });

    await page.getByRole("textbox", { name: "Singer(s)" }).fill("[[Hatsune Miku (VOCALOID)]]");

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        singers: "[[Hatsune Miku (VOCALOID)]]",
      }),
    );
  });

  test("Producers", async () => {
    const page = await render(SongPageForm, { ongenerate: () => {} });

    await page.getByRole("textbox", { name: "Producer(s)" }).fill("[[wowaka]] (music, lyrics)");

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        producers: "[[wowaka]] (music, lyrics)",
      }),
    );
  });

  test("Description", async () => {
    const page = await render(SongPageForm, { ongenerate: () => {} });

    await page.getByRole("textbox", { name: "Description" }).fill("This is a song by wowaka.");

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        description: "This is a song by wowaka.",
      }),
    );
  });

  test("Broadcast flag - is album only", async () => {
    const page = await render(SongPageForm, { ongenerate: () => {} });

    await page.getByRole("checkbox", { name: "Song is an album-only release" }).click();

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        isAlbumOnly: true,
      }),
    );
  });

  test("Broadcast flag - is unavailable", async () => {
    const page = await render(SongPageForm, { ongenerate: () => {} });

    await page.getByRole("checkbox", { name: "Song is publically unavailable" }).click();

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        isUnavailable: true,
      }),
    );
  });

  test("Broadcast flag - is demonstration", async () => {
    const page = await render(SongPageForm, { ongenerate: () => {} });

    await page.getByRole("checkbox", { name: "Song is a vocal synth demo" }).click();

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        isDemonstration: true,
      }),
    );
  });

  test("Translator", async () => {
    const page = await render(SongPageForm, { ongenerate: () => {} });

    await page.getByRole("textbox", { name: "Translator" }).fill("Project DIVA 2nd Stage");

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        translator: "Project DIVA 2nd Stage",
      }),
    );
  });

  test("Translation is official?", async () => {
    const page = await render(SongPageForm, { ongenerate: () => {} });

    await page.getByRole("checkbox", { name: "Is an official translation?" }).click();

    await submitFormAndComparePassedArgs(
      page,
      new Song({
        isOfficialTranslation: true,
      }),
    );
  });

  test("Categories", async () => {
    const page = await render(SongPageForm, { ongenerate: () => {} });

    await page
      .getByRole("textbox", { name: "Categories" })
      .fill("wowaka songs list\nSongs featuring Hatsune Miku (VOCALOID)");

    const expected = new Song({
      categoriesRaw: "wowaka songs list\nSongs featuring Hatsune Miku (VOCALOID)",
    });
    expected.categories = ["wowaka songs list", "Songs featuring Hatsune Miku (VOCALOID)"];
    await submitFormAndComparePassedArgs(page, expected);
  });
});