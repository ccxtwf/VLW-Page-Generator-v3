import { beforeEach, describe, expect, test } from "vite-plus/test";
import { render } from "vitest-browser-svelte";
import { locale } from "svelte-i18n";

import ProducerPageForm from "../../src/lib/forms/ProducerPageForm.svelte";

async function init() {
  await Promise.all([
    import("../../src/i18n"),
    import("../../src/lib/components/handsontables/registration"),
  ]);
  await locale.set("en");
}

describe("Producer Page Form", async () => {
  beforeEach(init);

  test("should output when on empty state", async () => {
    let pageOutput: string = "";
    let pageTitle: string = "";
    const form = await render(
      ProducerPageForm,
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
    expect(pageOutput).toBe(`<div class="producer-links">
[[File:<PRODUCER PROFILE PICTURE IMAGE FILE>|250px|center]]
==Producer categories==
{{ProdLinks|}}

==External links==
===Unofficial===
{{links |p=yes
  |atmiku = 
  |atutau = 
  |nico   = 
  |vocadb = 
  |tag    = 
  |mgp    = 
}}
</div>



==Works==
{| class="sortable producer-table"
|- class="vcolor-default"
! {{pwt head}}
|}


[[Category:Producers]]`);
  });
});