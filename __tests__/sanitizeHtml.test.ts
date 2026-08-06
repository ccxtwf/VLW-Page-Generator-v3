import { describe, expect, test } from "vite-plus/test";
import { sanitizeHtml } from "../src/lib/utils/utils";

describe("test sanitizeHtml", () => {
  test.each([
    { i: "division foobar", o: "division foobar" },
    {
      i: '<span class="mw-text">PRE TEXT</span>',
      o: '<span class="mw-text">PRE TEXT</span>',
    },
    {
      i: '<span class="mw-text" style="font-weight: bold;">SOME TEXT</span>',
      o: '<span class="mw-text" style="font-weight:bold">SOME TEXT</span>',
    },
    {
      i: '<span style="color: red;">RED TEXT</span> normal text <span style="font-weight:bold">BOLDED TEXT</span>',
      o: '<span style="color:red">RED TEXT</span> normal text <span style="font-weight:bold">BOLDED TEXT</span>',
    },
    {
      i: "<ruby>有難い<rp>(</rp><rt>ありがたい</rt><rp>)</rp></ruby>",
      o: "<ruby>有難い<rp>(</rp><rt>ありがたい</rt><rp>)</rp></ruby>",
    },
    {
      i: "<pre>PRE TEXT</pre>",
      o: "<pre>PRE TEXT</pre>",
    },
    {
      i: "<span>And then he says: <code>HELLO WORLD!</code></span>",
      o: "<span>And then he says: <code>HELLO WORLD!</code></span>",
    },
    {
      i: "Line 1<br />Line 2",
      o: "Line 1<br />Line 2",
    },
    {
      i: "<nowiki />\n* Item 1",
      o: "<span>\n* Item 1</span>",
    },
  ])("sanitizeHtml - expected cases", ({ i, o }) => {
    expect(sanitizeHtml(i)).toBe(o);
  });

  test.each([
    {
      i: "lorem ipsum wikitext<ref>Some notes</ref>",
      o: 'lorem ipsum wikitext<span class="ref">Some notes</span>',
    },
    {
      i: 'lorem ipsum wikitext<ref name=":0"/>',
      o: 'lorem ipsum wikitext<span class="ref"></span>',
    },
  ])("sanitizeHtml - ref", ({ i, o }) => {
    expect(sanitizeHtml(i)).toBe(o);
  });

  test.each([
    {
      i: '<script>alert("XSS");</script>',
      o: '&lt;script&gt;alert("XSS");&lt;/script&gt;',
    },
    {
      i: '<div onclick="() => alert(\\"XSS\\");">TEXT</div>',
      o: "<div>TEXT</div>",
    },
    {
      i: "<iframe>An iframe</iframe>",
      o: "&lt;iframe&gt;An iframe&lt;/iframe&gt;",
    },
    {
      i: '<div><script>alert("XSS");</script></div>',
      o: '<div>&lt;script&gt;alert("XSS");&lt;/script&gt;</div>',
    },
  ])("sanitizeHtml - XSS", ({ i, o }) => {
    expect(sanitizeHtml(i)).toBe(o);
  });
});
