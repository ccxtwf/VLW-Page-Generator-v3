import { beforeEach, describe, expect, test } from "vite-plus/test";
import { render } from "vitest-browser-svelte";
import { locale } from "svelte-i18n";

import SongPageForm from "../../src/lib/forms/SongPageForm.svelte";

async function init() {
  await Promise.all([
    import("../../src/i18n"),
    import("../../src/lib/components/handsontables/registration"),
  ]);
  await locale.set("en");
}

describe("Song Page Form", async () => {
  beforeEach(init);

  test("should output when on empty state", async () => {
    let pageOutput: string = "";
    let pageTitle: string = "";
    const form = await render(
      SongPageForm,
      {
        ongenerate: (output: string, title: string) => {
          pageOutput = output;
          pageTitle = title;
        },
      },
      {},
    );

    await form.getByRole("checkbox", { name: "ignore errors" }).click();
    await form.getByRole("button", { name: "generate" }).click();

    expect(pageTitle).toBe("");
    expect(pageOutput).toBe(`{{Infobox Song
|songtitle = "''''''"
|color = black; color:white
|original upload date = 
|singer = 
|producer = 
|#views = N/A
|link = N/A
|language = 
}}

==Lyrics==
{{lyrics toggle|org:Original|rom:Romanized|iso-lang=}}
{| {{lyrics table class}}
|- class="lyrics-table-header"
! {{lyrics header}}
|-
|<br />
|-
|<br />
|-
|<br />
|-
|<br />
|-
|<br />
|-
|<br />
|-
|<br />
|-
|<br />
|-
|<br />
|-
|<br />
|-
|<br />
|-
|<br />
|-
|<br />
|-
|<br />
|-
|<br />
|-
|<br />
|-
|<br />
|-
|<br />
|-
|<br />
|-
|<br />
|}`);
  });
});