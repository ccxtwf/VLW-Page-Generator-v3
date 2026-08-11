import { describe, expect, test } from "vite-plus/test";
import { mapEngines, mapLanguages } from "../mapper";

import Producer from "../../src/lib/models/Producer.svelte";
import { generatePage } from "../../src/lib/logic/producers.svelte";
import ProducerDiscographySongItem from "../../src/lib/models/children/ProducerDiscographySongItem.svelte";
import ProducerDiscographyAlbumItem from "../../src/lib/models/children/ProducerDiscographyAlbumItem.svelte";
import ExternalLinkForProducerPage from "../../src/lib/models/children/ExternalLinkForProducerPage.svelte";

describe("Generate producer pages", () => {
  test("Simple", () => {
    const formData = new Producer({
      prodCategory: "PinocchioP",
      splitAlbum: false,
      prodAliases: "Pinocchio-P",
      affiliations: "DAIHAKKEN",
      labels: "KarenT",
      languages: mapLanguages("Japanese"),
      engines: mapEngines("VOCALOID", "UTAU"),
      description: "PinocchioP is a prolific VOCALOID producer.",
      roles: {
        composer: true,
        lyricist: true,
        tuner: true,
        illustrator: true,
        animator: false,
        arranger: false,
        instrumentalist: false,
        mixer: false,
        masterer: false,
      },
      songs: [
        new ProducerDiscographySongItem({ page: "Page 1" }),
        new ProducerDiscographySongItem({ page: "Page 2" }),
      ],
      albums: [
        new ProducerDiscographyAlbumItem({ page: "Album 1" }),
        new ProducerDiscographyAlbumItem({ page: "Album 2", isCompilation: true }),
      ],
      extLinks: [
        new ExternalLinkForProducerPage({
          url: "https://www.youtube.com/channel/UCMMBGMjrrWcRZmG_lW4jC-Q",
          description: "YouTube Channel",
          isMedia: true,
          isOfficial: true,
        }),
        new ExternalLinkForProducerPage({
          url: "https://pinocchiop.com/",
          description: "Official Website",
          isMedia: false,
          isOfficial: true,
        }),
        new ExternalLinkForProducerPage({
          url: "https://w.atwiki.jp/hmiku/pages/4671.html",
          description: "Hatsune Miku Wiki",
          isMedia: false,
          isOfficial: false,
        }),
      ],
    });
    formData.preprocess();

    const page = generatePage(formData);

    const expected = `<div class="producer-links">
[[File:<PRODUCER PROFILE PICTURE IMAGE FILE>|250px|center]]
==Producer categories==
{{ProdLinks|PinocchioP}}

==Labels==
* KarenT

==Affiliations==
* DAIHAKKEN

==External links==
* Official Website: [https://pinocchiop.com/ ]

===Media===
* [https://www.youtube.com/channel/UCMMBGMjrrWcRZmG_lW4jC-Q YouTube Channel]

===Unofficial===
{{links |p=yes
  |atmiku = 4671
  |atutau = 
  |nico   = 
  |vocadb = 
  |tag    = 
  |mgp    = 
}}
</div>

PinocchioP is a prolific VOCALOID producer.

==Works==
{{pwt alias|Pinocchio-P}}
{| class="sortable producer-table"
|- class="vcolor-default"
! {{pwt head}}
|-
| {{pwt row|Page 1}}
|-
| {{pwt row|Page 2}}
|}

==Discography==
{| class="sortable producer-table"
|- class="vcolor-default"
! {{awt head}}
|-
| {{awt row|Album 1}}
|-
| {{awt row|Album 2}}
|}

[[Category:Producers]]
[[Category:Composers]]
[[Category:Lyricists]]
[[Category:Tuners]]
[[Category:Illustrators]]
[[Category:Japanese original producers]]
[[Category:Producers using VOCALOID]]
[[Category:Producers using UTAU]]`;

    expect(page).toEqual(expected);
  });

  test("Split discography", () => {
    const formData = new Producer({
      prodCategory: "PinocchioP",
      splitAlbum: true,
      prodAliases: "Pinocchio-P",
      affiliations: "DAIHAKKEN",
      labels: "KarenT",
      languages: mapLanguages("Japanese"),
      engines: mapEngines("VOCALOID", "UTAU"),
      description: "PinocchioP is a prolific VOCALOID producer.",
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
      },
      songs: [
        new ProducerDiscographySongItem({ page: "Page 1" }),
        new ProducerDiscographySongItem({ page: "Page 2" }),
      ],
      albums: [
        new ProducerDiscographyAlbumItem({ page: "Album 1" }),
        new ProducerDiscographyAlbumItem({ page: "Album 2", isCompilation: true }),
      ],
      extLinks: [
        new ExternalLinkForProducerPage({
          url: "https://www.youtube.com/channel/UCMMBGMjrrWcRZmG_lW4jC-Q",
          description: "YouTube Channel",
          isMedia: true,
          isOfficial: true,
        }),
        new ExternalLinkForProducerPage({
          url: "https://pinocchiop.com/",
          description: "Official Website",
          isMedia: false,
          isOfficial: true,
        }),
        new ExternalLinkForProducerPage({
          url: "https://w.atwiki.jp/hmiku/pages/4671.html",
          description: "Hatsune Miku Wiki",
          isMedia: false,
          isOfficial: false,
        }),
      ],
    });
    formData.preprocess();

    const page = generatePage(formData);

    const expected = `<div class="producer-links">
[[File:<PRODUCER PROFILE PICTURE IMAGE FILE>|250px|center]]
==Producer categories==
{{ProdLinks|PinocchioP}}

==Labels==
* KarenT

==Affiliations==
* DAIHAKKEN

==External links==
* Official Website: [https://pinocchiop.com/ ]

===Media===
* [https://www.youtube.com/channel/UCMMBGMjrrWcRZmG_lW4jC-Q YouTube Channel]

===Unofficial===
{{links |p=yes
  |atmiku = 4671
  |atutau = 
  |nico   = 
  |vocadb = 
  |tag    = 
  |mgp    = 
}}
</div>

PinocchioP is a prolific VOCALOID producer.

==Works==
{{pwt alias|Pinocchio-P}}
{| class="sortable producer-table"
|- class="vcolor-default"
! {{pwt head}}
|-
| {{pwt row|Page 1}}
|-
| {{pwt row|Page 2}}
|}

==Discography==
{| class="sortable producer-table"
|- class="vcolor-default"
! {{awt head}}
|-
| {{awt row|Album 1}}
|}

===Compilations===
{| class="sortable producer-table"
|- class="vcolor-default"
! {{awt head}}
|-
| {{awt row|Album 2}}
|}

[[Category:Producers]]
[[Category:Japanese original producers]]
[[Category:Producers using VOCALOID]]
[[Category:Producers using UTAU]]`;

    expect(page).toEqual(expected);
  });
});