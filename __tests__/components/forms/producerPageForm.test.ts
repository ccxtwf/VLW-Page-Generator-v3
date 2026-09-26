/**
 * This file was written by Gemini with a few human-made changes under the
 * following prompt:
 *
 * Now create component tests similar to this (see the notes for
 * `__tests__/components/songPageForm.test.ts`) but for
 * `src/lib/models?Album.svelte.ts` and `src/lib/models/Producer.svelte.ts`
 */

import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { userEvent } from "vite-plus/test/browser";
import { render, RenderResult } from "vitest-browser-svelte";

import ProducerPageForm from "#src/lib/forms/ProducerPageForm.svelte";
import Producer from "#src/lib/models/Producer.svelte.ts";
import { validate, generatePage } from "#src/lib/logic/producers.svelte.ts";
import { mapEngines, mapLanguages } from "../../mapper";

// Mock import
vi.mock("#src/lib/logic/producers.svelte.ts", async () => {
  return {
    validate: vi
      .fn()
      .mockImplementation(() => ({ errors: [], autoloadCategories: false, fatal: true })),
    generatePage: vi.fn().mockImplementation(() => ["", ""]),
    fetchDataFromVocaDb: vi.fn(),
    fetchDiscographyFromVlw: vi.fn(),
  };
});
const validateMocked = vi.mocked(validate);
const generatePageMocked = vi.mocked(generatePage);

afterEach(() => {
  vi.clearAllMocks();
});

describe("producerPageForm - state should be bounded correctly", () => {
  async function submitFormAndComparePassedArgs(
    page: RenderResult<any, never>,
    expected: Producer,
  ) {
    // Click Submit & assert the arguments that have been passed onto the expected functions
    await page.getByRole("button", { name: "Generate" }).click();
    expect(validateMocked).toHaveBeenCalledOnce();
    const [validateArgs] = validateMocked.mock.calls[0];
    //@ts-ignore
    expect(validateArgs).toEqualState(expected);
  }

  test("empty state", async () => {
    const page = await render(ProducerPageForm, { ongenerate: () => {} });
    await submitFormAndComparePassedArgs(page, new Producer());
    expect(generatePageMocked).not.toHaveBeenCalled();
  });

  test("generate a page when the Ignore errors button is checked", async () => {
    const page = await render(ProducerPageForm, { ongenerate: () => {} });
    await page.getByRole("checkbox", { name: "Ignore Errors" }).click();
    await submitFormAndComparePassedArgs(page, new Producer());
    expect(generatePageMocked).toHaveBeenCalled();
  });

  test("Main producer category", async () => {
    const page = await render(ProducerPageForm, { ongenerate: () => {} });

    await page.getByRole("textbox", { name: "Main producer category" }).fill("Hachi");

    await submitFormAndComparePassedArgs(
      page,
      new Producer({
        prodCategory: "Hachi",
      }),
    );
  });

  test("Split album table in two", async () => {
    const page = await render(ProducerPageForm, { ongenerate: () => {} });

    await page.getByRole("checkbox", { name: "Split album table in two" }).click();

    await submitFormAndComparePassedArgs(
      page,
      new Producer({
        splitAlbum: true,
      }),
    );
  });

  test("Producer's other aliases", async () => {
    const page = await render(ProducerPageForm, { ongenerate: () => {} });

    await page.getByRole("textbox", { name: "Producer's other aliases" }).fill("Kenshi Yonezu");

    await submitFormAndComparePassedArgs(
      page,
      new Producer({
        prodAliases: "Kenshi Yonezu",
      }),
    );
  });

  test("Affiliations", async () => {
    const page = await render(ProducerPageForm, { ongenerate: () => {} });

    await page.getByRole("textbox", { name: "Affiliations" }).fill("Circle 1\nCircle 2");

    await submitFormAndComparePassedArgs(
      page,
      new Producer({
        affiliations: "Circle 1\nCircle 2",
      }),
    );
  });

  test("Labels", async () => {
    const page = await render(ProducerPageForm, { ongenerate: () => {} });

    await page.getByRole("textbox", { name: "Labels" }).fill("EXIT Tunes\nKarenT");

    await submitFormAndComparePassedArgs(
      page,
      new Producer({
        labels: "EXIT Tunes\nKarenT",
      }),
    );
  });

  test("Languages", async () => {
    const page = await render(ProducerPageForm, { ongenerate: () => {} });

    await page.getByRole("combobox", { name: "Languages" }).click();
    await page.getByRole("option", { name: "Japanese" }).click();
    await userEvent.keyboard("{Escape}");

    await submitFormAndComparePassedArgs(
      page,
      new Producer({
        languages: mapLanguages("Japanese"),
      }),
    );

    vi.clearAllMocks();

    await page.getByRole("combobox", { name: "Languages" }).click();
    await page.getByRole("option", { name: "English" }).click();
    await userEvent.keyboard("{Escape}");

    await submitFormAndComparePassedArgs(
      page,
      new Producer({
        languages: mapLanguages("Japanese", "English"),
      }),
    );
  });

  test("Uses the synthesizers", async () => {
    const page = await render(ProducerPageForm, { ongenerate: () => {} });

    await page.getByRole("combobox", { name: "Uses the synthesizers" }).click();
    await page.getByRole("option", { name: "VOCALOID" }).click();
    await userEvent.keyboard("{Escape}");

    await submitFormAndComparePassedArgs(
      page,
      new Producer({
        engines: mapEngines("VOCALOID"),
      }),
    );

    vi.clearAllMocks();

    await page.getByRole("combobox", { name: "Uses the synthesizers" }).click();
    await page.getByRole("option", { name: "UTAU" }).click();
    await userEvent.keyboard("{Escape}");

    await submitFormAndComparePassedArgs(
      page,
      new Producer({
        engines: mapEngines("VOCALOID", "UTAU"),
      }),
    );
  });

  test.each([
    "composer",
    "lyricist",
    "tuner",
    "illustrator",
    "animator",
    "arranger",
    "instrumentalist",
    "mixer",
    "masterer",
  ])("Typical roles - %s", async (role) => {
    const page = await render(ProducerPageForm, { ongenerate: () => {} });

    await page.getByRole("checkbox", { name: role }).click();

    await submitFormAndComparePassedArgs(
      page,
      new Producer({
        roles: {
          composer: false,
          lyricist: false,
          tuner: false,
          illustrator: false,
          animator: false,
          arranger: false,
          instrumentalist: false,
          mixer: false,
          masterer: false,
          [role]: true,
        },
      }),
    );
  });

  test("Description", async () => {
    const page = await render(ProducerPageForm, { ongenerate: () => {} });

    await page
      .getByRole("textbox", { name: "Description" })
      .fill("Hachi is a prolific vocal synth producer.");

    await submitFormAndComparePassedArgs(
      page,
      new Producer({
        description: "Hachi is a prolific vocal synth producer.",
      }),
    );
  });
});