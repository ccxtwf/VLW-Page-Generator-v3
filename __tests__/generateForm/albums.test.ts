import { describe, expect, test } from "vite-plus/test";
import { mapEngines, mapAlbumBroadcastLink } from "../mapper";

import Album from "../../src/lib/models/Album.svelte";
import { generatePage } from "../../src/lib/logic/albums.svelte";

import ExternalLink from "../../src/lib/models/children/ExternalLink.svelte";
import AlbumTrackData from "../../src/lib/models/children/AlbumTrackData.svelte";

describe("Generate album pages", () => {
  test("Empty form state", () => {
    const formData = new Album();

    const page = generatePage(formData);

    const expected = `{{Album Infobox
|title = 
|label = 
|desc = 
|date = 
|vdb = 
|vw = 

|color = black; color:white

}}`;

    expect(page).toEqual(expected);
  });

  test("Simple", () => {
    const formData = new Album({
      origTitle: "桜のビンゴ",
      romTitle: "Sakura no Bingo",
      bgColour: "red",
      fgColour: "yellow",
      label: "KarenT",
      description: "an album by Sakura",
      isCompilationAlbum: false,
      publishedYear: "2016",
      publishedMonth: "December",
      publishedDay: "31",
      engines: mapEngines("VOCALOID"),
      vdbAlbumId: "21149",
      vocaWikiPage: "Sakura no Bingo",
      categoriesRaw:
        "Albums featuring VOCALOID\nAlbums featuring Hatsune Miku (VOCALOID)\nSakura songs list/Albums",
      tracklist: [
        new AlbumTrackData({
          discNo: 1,
          trackNo: 1,
          pageTitle: "[[Page 1]]",
          producerCredit: "",
          singerCredit: "[[Hatsune Miku (VOCALOID)]]",
        }),
        new AlbumTrackData({
          discNo: 1,
          trackNo: 2,
          pageTitle: "[[Page 2]]",
          producerCredit: "",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 2,
          trackNo: 1,
          pageTitle: "Page 1 - Remix",
          producerCredit: "Sakurabi",
          singerCredit: "Instrumental",
        }),
      ],
      broadcastLinks: mapAlbumBroadcastLink(
        { key: "nn-xfade", url: "https://www.nicovideo.jp/watch/sm30228946" },
        { key: "yt-xfade", url: "https://www.youtube.com/watch?v=in90fSCxGKs" },
      ),
      extLinks: [
        new ExternalLink({
          description: "Website",
          url: "http://pinocchiop.com/news/287",
          isOfficial: true,
        }),
        new ExternalLink({
          description: "VocaDB",
          url: "https://vocadb.net/Al/21149",
          isOfficial: false,
        }),
      ],
    });

    formData.preprocess();

    const page = generatePage(formData);

    const expected = `{{Album Infobox
|title = Sakura no Bingo
|orgtitle = 桜のビンゴ
|label = KarenT
|desc = an album by Sakura
|date = {{DateAlbum|2016|December|31}}
|vdb = 21149
|vw = Sakura no Bingo

|nn-xfade = sm30228946
|yt-xfade = in90fSCxGKs

|color = red; color:yellow
|tr1 = [[Page 1]]
|tr1s = [[Hatsune Miku (VOCALOID)]]
|tr2 = [[Page 2]]
|tr2s = Hatsune Miku
|2tr1 = Page 1 - Remix
|2tr1s = Sakurabi ft. Instrumental
}}

==External Links==
* [http://pinocchiop.com/news/287 Website]
===Unofficial===
* {{VDB|Al/21149}}

{{sort-album}}
[[Category:Albums featuring VOCALOID]]
[[Category:Albums featuring Hatsune Miku (VOCALOID)]]
[[Category:Sakura songs list/Albums]]`;

    expect(page).toEqual(expected);
  });

  test("Simple - compilation album", () => {
    const formData = new Album({
      origTitle: "Sakura no Bingo",
      bgColour: "black",
      fgColour: "white",
      label: "KarenT",
      description: "an album by Sakura",
      isCompilationAlbum: true,
      publishedYear: "2016",
      publishedMonth: "December",
      publishedDay: "31",
      engines: mapEngines("VOCALOID"),
      vdbAlbumId: "21149",
      categoriesRaw:
        "Albums featuring VOCALOID\nAlbums featuring Hatsune Miku (VOCALOID)\nSakura songs list/Albums",
      tracklist: [
        new AlbumTrackData({
          discNo: 1,
          trackNo: 1,
          pageTitle: "[[Page 1]]",
          producerCredit: "",
          singerCredit: "[[Hatsune Miku (VOCALOID)]]",
        }),
        new AlbumTrackData({
          discNo: 1,
          trackNo: 2,
          pageTitle: "[[Page 2]]",
          producerCredit: "",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 2,
          trackNo: 1,
          pageTitle: "Page 1 - Remix",
          producerCredit: "Sakurabi",
          singerCredit: "Instrumental",
        }),
      ],
      broadcastLinks: mapAlbumBroadcastLink(
        { key: "nn-xfade", url: "https://www.nicovideo.jp/watch/sm30228946" },
        { key: "yt-xfade", url: "https://www.youtube.com/watch?v=in90fSCxGKs" },
      ),
      extLinks: [
        new ExternalLink({
          description: "Website",
          url: "http://pinocchiop.com/news/287",
          isOfficial: true,
        }),
        new ExternalLink({
          description: "VocaDB",
          url: "https://vocadb.net/Al/21149",
          isOfficial: false,
        }),
      ],
    });

    formData.preprocess();

    const page = generatePage(formData);

    const expected = `{{Album Infobox
|title = Sakura no Bingo
|label = KarenT
|desc = an album by Sakura
|date = {{DateAlbum|2016|December|31}}
|vdb = 21149
|vw = 
|compilation = 1

|nn-xfade = sm30228946
|yt-xfade = in90fSCxGKs

|color = black; color:white
|tr1 = [[Page 1]]
|tr1s = [[Hatsune Miku (VOCALOID)]]
|tr2 = [[Page 2]]
|tr2s = Hatsune Miku
|2tr1 = Page 1 - Remix
|2tr1s = Sakurabi ft. Instrumental
}}

==External Links==
* [http://pinocchiop.com/news/287 Website]
===Unofficial===
* {{VDB|Al/21149}}

[[Category:Albums featuring VOCALOID]]
[[Category:Albums featuring Hatsune Miku (VOCALOID)]]
[[Category:Sakura songs list/Albums]]`;

    expect(page).toEqual(expected);
  });

  test("Simple - with optional English", () => {
    const formData = new Album({
      origTitle: "桜のビンゴ",
      romTitle: "Sakura no Bingo",
      engTitle: "Sakura's Bingo Game",
      bgColour: "black",
      fgColour: "white",
      label: "KarenT",
      description: "an album by Sakura",
      isCompilationAlbum: false,
      publishedYear: "2016",
      publishedMonth: "December",
      publishedDay: "31",
      engines: mapEngines("VOCALOID"),
      vdbAlbumId: "21149",
      categoriesRaw:
        "Albums featuring VOCALOID\nAlbums featuring Hatsune Miku (VOCALOID)\nSakura songs list/Albums",
      tracklist: [
        new AlbumTrackData({
          discNo: 1,
          trackNo: 1,
          pageTitle: "[[Page 1]]",
          producerCredit: "",
          singerCredit: "[[Hatsune Miku (VOCALOID)]]",
        }),
        new AlbumTrackData({
          discNo: 1,
          trackNo: 2,
          pageTitle: "[[Page 2]]",
          producerCredit: "",
          singerCredit: "Hatsune Miku",
        }),
        new AlbumTrackData({
          discNo: 2,
          trackNo: 1,
          pageTitle: "Page 1 - Remix",
          producerCredit: "Sakurabi",
          singerCredit: "Instrumental",
        }),
      ],
      broadcastLinks: mapAlbumBroadcastLink(
        { key: "nn-xfade", url: "https://www.nicovideo.jp/watch/sm30228946" },
        { key: "yt-xfade", url: "https://www.youtube.com/watch?v=in90fSCxGKs" },
      ),
      extLinks: [
        new ExternalLink({
          description: "Website",
          url: "http://pinocchiop.com/news/287",
          isOfficial: true,
        }),
        new ExternalLink({
          description: "VocaDB",
          url: "https://vocadb.net/Al/21149",
          isOfficial: false,
        }),
      ],
    });

    formData.preprocess();

    const page = generatePage(formData);

    const expected = `{{Album Infobox
|title = Sakura no Bingo
|orgtitle = 桜のビンゴ
|english = Sakura's Bingo Game
|label = KarenT
|desc = an album by Sakura
|date = {{DateAlbum|2016|December|31}}
|vdb = 21149
|vw = 

|nn-xfade = sm30228946
|yt-xfade = in90fSCxGKs

|color = black; color:white
|tr1 = [[Page 1]]
|tr1s = [[Hatsune Miku (VOCALOID)]]
|tr2 = [[Page 2]]
|tr2s = Hatsune Miku
|2tr1 = Page 1 - Remix
|2tr1s = Sakurabi ft. Instrumental
}}

==External Links==
* [http://pinocchiop.com/news/287 Website]
===Unofficial===
* {{VDB|Al/21149}}

{{sort-album}}
[[Category:Albums featuring VOCALOID]]
[[Category:Albums featuring Hatsune Miku (VOCALOID)]]
[[Category:Sakura songs list/Albums]]`;

    expect(page).toEqual(expected);
  });
});