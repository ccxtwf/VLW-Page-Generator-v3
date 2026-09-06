import { describe, expect, test } from "vite-plus/test";
import type { IAlbumTrack } from "#src/lib/models/schema.d.ts";
import AlbumTrackData from "#src/lib/models/children/AlbumTrackData.svelte.ts";

describe("test state management logic for AlbumTrackData", () => {
  test.each([
    {
      d: "empty state",
      i: { discNo: "", trackNo: "", pageTitle: "", producerCredit: "", singerCredit: "" },
      o: "|tr = \n|trs = ",
    },
    {
      d: "first track on a single disc album",
      i: {
        discNo: "",
        trackNo: "1",
        pageTitle: "[[A Song]]",
        producerCredit: "[[wowaka]]",
        singerCredit: "[[Hatsune Miku (VOCALOID)]]",
      },
      o: "|tr1 = [[A Song]]\n|tr1s = [[wowaka]] ft. [[Hatsune Miku (VOCALOID)]]",
    },
    {
      d: "first track on the first disc of a multiple disc album",
      i: {
        discNo: "1",
        trackNo: "1",
        pageTitle: "[[A Song]]",
        producerCredit: "[[wowaka]]",
        singerCredit: "[[Hatsune Miku (VOCALOID)]]",
      },
      o: "|tr1 = [[A Song]]\n|tr1s = [[wowaka]] ft. [[Hatsune Miku (VOCALOID)]]",
    },
    {
      d: "second track on a single disc album",
      i: {
        discNo: "",
        trackNo: "2",
        pageTitle: "[[A Song]]",
        producerCredit: "[[wowaka]]",
        singerCredit: "[[Hatsune Miku (VOCALOID)]]",
      },
      o: "|tr2 = [[A Song]]\n|tr2s = [[wowaka]] ft. [[Hatsune Miku (VOCALOID)]]",
    },
    {
      d: "second track on the first disc of a multiple disc album",
      i: {
        discNo: "1",
        trackNo: "2",
        pageTitle: "[[A Song]]",
        producerCredit: "[[wowaka]]",
        singerCredit: "[[Hatsune Miku (VOCALOID)]]",
      },
      o: "|tr2 = [[A Song]]\n|tr2s = [[wowaka]] ft. [[Hatsune Miku (VOCALOID)]]",
    },
    {
      d: "no producer listed",
      i: {
        discNo: "",
        trackNo: "1",
        pageTitle: "[[A Song]]",
        producerCredit: "",
        singerCredit: "[[Hatsune Miku (VOCALOID)]]",
      },
      o: "|tr1 = [[A Song]]\n|tr1s = [[Hatsune Miku (VOCALOID)]]",
    },
    {
      d: "no singer listed",
      i: {
        discNo: "",
        trackNo: "1",
        pageTitle: "[[A Song]]",
        producerCredit: "[[wowaka]]",
        singerCredit: "",
      },
      o: "|tr1 = [[A Song]]\n|tr1s = [[wowaka]] ft. ",
    },
    {
      d: "no credits listed",
      i: {
        discNo: "",
        trackNo: "1",
        pageTitle: "[[A Song]]",
        producerCredit: "",
        singerCredit: "",
      },
      o: "|tr1 = [[A Song]]\n|tr1s = ",
    },
  ] as { d: string; i: IAlbumTrack; o: string }[])("getWikitext - $d", ({ i, o }) => {
    const externalLink = new AlbumTrackData(i);
    expect(externalLink.getWikitext()).toBe(o);
  });

  test("toJSON", () => {
    const o: IAlbumTrack = {
      discNo: "2",
      trackNo: "3",
      pageTitle: "[[A Song]]",
      producerCredit: "[[wowaka]]",
      singerCredit: "[[Hatsune Miku (VOCALOID)]]",
    };
    const albumTrack = new AlbumTrackData(o);
    expect(albumTrack.toJSON()).toMatchObject(o);
  });
});