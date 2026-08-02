import { describe, expect, test } from "vitest";
import { generateLyricsPoemElement } from "../../src/lib/utils/lyricsUtils";
import { LyricRowData } from "../../src/schemas/form";

describe("generateLyricsPoemElement", () => {
  test("simple", () => {
    const data: LyricRowData[] = [
      { customStyle: "", original: "Lorem ipsum dolor sit amet," },
      { customStyle: "", original: "consectetur adipiscing elit" },
      { customStyle: "", original: "Ut pulvinar, diam nec dapibus sagittis," },
    ];
    const res = generateLyricsPoemElement(data);
    expect(res).toBe(
      `<poem>Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit\nUt pulvinar, diam nec dapibus sagittis,</poem>`,
    );
  });

  test("with styling", () => {
    const data: LyricRowData[] = [
      { customStyle: "color: grey;", original: "Lorem ipsum dolor sit amet," },
      { customStyle: "color: grey;", original: "consectetur adipiscing elit." },
      { customStyle: "color: grey;", original: "Ut pulvinar, diam nec dapibus sagittis," },
      { customStyle: "color: grey;", original: "velit felis consequat dui," },
      { customStyle: "color: grey;", original: "vitae sollicitudin neque mauris eu tellus." },
      { customStyle: "", original: "Pellentesque dignissim mi in libero rutrum lacinia." },
      { customStyle: "", original: "Suspendisse odio erat, imperdiet ac arcu ac," },
      { customStyle: "", original: "lobortis iaculis velit." },
      { customStyle: "color: red;", original: "Pellentesque tempus vulputate erat ut pharetra." },
      {
        customStyle: "color: red;",
        original: "Fusce arcu sem, ultrices vitae quam ac, mattis condimentum nisl.",
      },
      { customStyle: "", original: "Duis eleifend convallis mauris sed dignissim." },
      { customStyle: "", original: "Nulla porttitor malesuada elementum." },
      { customStyle: "", original: "Nullam aliquet lacinia arcu a tempor." },
      { customStyle: "", original: "Donec placerat eleifend iaculis." },
      { customStyle: "", original: "Morbi ut nisl euismod, molestie urna sed, aliquam nibh." },
      { customStyle: "", original: "Sed sed pulvinar diam." },
      {
        customStyle: "",
        original: "Nulla lobortis faucibus ante, ac laoreet lorem imperdiet ultricies.",
      },
    ];
    const res = generateLyricsPoemElement(data);
    expect(res).toBe(
      `<poem><span style="color: grey;">Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit.\nUt pulvinar, diam nec dapibus sagittis,\nvelit felis consequat dui,\nvitae sollicitudin neque mauris eu tellus.</span>\nPellentesque dignissim mi in libero rutrum lacinia.\nSuspendisse odio erat, imperdiet ac arcu ac,\nlobortis iaculis velit.\n<span style="color: red;">Pellentesque tempus vulputate erat ut pharetra.\nFusce arcu sem, ultrices vitae quam ac, mattis condimentum nisl.</span>\nDuis eleifend convallis mauris sed dignissim.\nNulla porttitor malesuada elementum.\nNullam aliquet lacinia arcu a tempor.\nDonec placerat eleifend iaculis.\nMorbi ut nisl euismod, molestie urna sed, aliquam nibh.\nSed sed pulvinar diam.\nNulla lobortis faucibus ante, ac laoreet lorem imperdiet ultricies.</poem>`,
    );
  });

  test("should group paragraphs with line breaks in between", () => {
    const data: LyricRowData[] = [
      { customStyle: "color: red;", original: "How beautiful at eventide" },
      { customStyle: "color: red;", original: "To see the twilight shadows pale," },
      { customStyle: "color: red;", original: "Steal o'er the landscape, far and wide," },
      { customStyle: "color: red;", original: "O'er stream and meadow, mound and dale!" },
      { customStyle: "", original: "" },
      { customStyle: "color: red;", original: "How soft is Nature's calm repose" },
      { customStyle: "color: red;", original: "When ev'ning skies their cool dews weep:" },
      { customStyle: "color: red;", original: "The gentlest wind more gently blows," },
      { customStyle: "color: red;", original: "As if to soothe her in her sleep!" },
      { customStyle: "", original: "" },
      { customStyle: "color: yellow;", original: "The gay morn breaks," },
      { customStyle: "color: yellow;", original: "Mists roll away," },
      { customStyle: "color: yellow;", original: "All Nature awakes" },
      { customStyle: "color: yellow;", original: "To glorious day." },
      { customStyle: "color: green;", original: "In my breast alone" },
      { customStyle: "color: green;", original: "Dark shadows remain;" },
      { customStyle: "color: green;", original: "The peace it has known" },
      { customStyle: "color: green;", original: "It can never regain." },
    ];
    const res = generateLyricsPoemElement(data);
    expect(res).toBe(
      `<poem><span style="color: red;">How beautiful at eventide
To see the twilight shadows pale,
Steal o'er the landscape, far and wide,
O'er stream and meadow, mound and dale!

How soft is Nature's calm repose
When ev'ning skies their cool dews weep:
The gentlest wind more gently blows,
As if to soothe her in her sleep!</span>

<span style="color: yellow;">The gay morn breaks,
Mists roll away,
All Nature awakes
To glorious day.</span>
<span style="color: green;">In my breast alone
Dark shadows remain;
The peace it has known
It can never regain.</span></poem>`,
    );
  });
});
