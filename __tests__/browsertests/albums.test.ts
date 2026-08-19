import { beforeEach, describe, expect, test } from "vite-plus/test";
import { render } from "vitest-browser-svelte";
import { locale } from "svelte-i18n";

import AlbumPageForm from "../../src/lib/forms/AlbumPageForm.svelte";

async function init() {
  await Promise.all([
    import("../../src/i18n"),
    import("../../src/lib/components/handsontables/registration"),
  ]);
  await locale.set("en");
}

describe("Album Page Form", async () => {
  beforeEach(init);

  test("should output when on empty state", async () => {
    let pageOutput: string = "";
    let pageTitle: string = "";
    const form = await render(
      AlbumPageForm,
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
    expect(pageOutput).toBe(`{{Album Infobox
|title = 
|label = 
|desc = 
|date = 
|vdb = 
|vw = 

|color = black; color:white

}}`);
  });
});