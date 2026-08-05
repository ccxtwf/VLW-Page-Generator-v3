import { describe, expect, test } from "vitest";
import { getLanguageMetadata } from "../../src/lib/utils/lyricsUtils";
import { LANGUAGES } from "../../src/constants";
import { MultiSelectItem } from "../../src/schemas/form";

describe("getLanguageMetadata", () => {
  const mlangs = LANGUAGES.map((lang, idx) => ({ ...lang, idx }));

  test("Do not select anything", () => {
    const selected: MultiSelectItem[] = [];
    const results = getLanguageMetadata(selected);
    expect(results).toEqual({
      headers: ["Original", "Romanized", "English"],
      needsRomanization: true,
      needsTranslation: true,
      isChinese: false,
      isoLangCode: null,
    });
  });

  test("Selecting a Japanese song", () => {
    const languages = mlangs.filter(({ name }) => name === "Japanese");
    expect(languages.length).toBe(1);
    const selected = languages.map(({ name, idx }) => ({ label: name, value: idx }));
    const results = getLanguageMetadata(selected);
    expect(results).toEqual({
      headers: ["Japanese", "Romaji", "English"],
      needsRomanization: true,
      needsTranslation: true,
      isChinese: false,
      isoLangCode: "ja",
    });
  });

  test("Selecting a Mandarin Chinese song", () => {
    const languages = mlangs.filter(({ name }) => name === "Mandarin");
    expect(languages.length).toBe(1);
    const selected = languages.map(({ name, idx }) => ({ label: name, value: idx }));
    const results = getLanguageMetadata(selected);
    expect(results).toEqual({
      headers: ["Mandarin", "Pinyin", "English"],
      needsRomanization: true,
      needsTranslation: true,
      isChinese: true,
      isoLangCode: "zh-Hans",
    });
  });

  test("Selecting an English song", () => {
    const languages = mlangs.filter(({ name }) => name === "English");
    expect(languages.length).toBe(1);
    const selected = languages.map(({ name, idx }) => ({ label: name, value: idx }));
    const results = getLanguageMetadata(selected);
    expect(results).toEqual({
      headers: ["English", "", ""],
      needsRomanization: false,
      needsTranslation: false,
      isChinese: false,
      isoLangCode: "en",
    });
  });

  test("Selecting a Spanish song", () => {
    const languages = mlangs.filter(({ name }) => name === "Spanish");
    expect(languages.length).toBe(1);
    const selected = languages.map(({ name, idx }) => ({ label: name, value: idx }));
    const results = getLanguageMetadata(selected);
    expect(results).toEqual({
      headers: ["Spanish", "", "English"],
      needsRomanization: false,
      needsTranslation: true,
      isChinese: false,
      isoLangCode: "es",
    });
  });

  test("Selecting a song with Japanese and Chinese lyrics", () => {
    const selected = [
      { label: "Japanese", value: 1 },
      { label: "Mandarin", value: 2 },
    ];
    for (const { label, value } of selected) {
      expect(mlangs[value].name === label);
    }
    const results = getLanguageMetadata(selected);
    expect(results).toEqual({
      headers: ["Japanese/Mandarin", "Romaji/Pinyin", "English"],
      needsRomanization: true,
      needsTranslation: true,
      isChinese: true,
      isoLangCode: "ja",
    });
  });

  test("Selecting a song with Japanese and English lyrics", () => {
    const selected = [
      { label: "Japanese", value: 1 },
      { label: "English", value: 0 },
    ];
    for (const { label, value } of selected) {
      expect(mlangs[value].name === label);
    }
    const results = getLanguageMetadata(selected);
    expect(results).toEqual({
      headers: ["Japanese/English", "Romaji", "English"],
      needsRomanization: true,
      needsTranslation: true,
      isChinese: false,
      isoLangCode: "ja",
    });
  });

  test("Selecting a song with Spanish and English lyrics", () => {
    const selected = [
      { label: "Spanish", value: 4 },
      { label: "English", value: 0 },
    ];
    for (const { label, value } of selected) {
      expect(mlangs[value].name === label);
    }
    const results = getLanguageMetadata(selected);
    expect(results).toEqual({
      headers: ["Spanish/English", "", "English"],
      needsRomanization: false,
      needsTranslation: true,
      isChinese: false,
      isoLangCode: "es",
    });
  });

  test("Selecting a song with at least four languages", () => {
    const selected = [
      { label: "Japanese", value: 1 },
      { label: "Mandarin", value: 2 },
      { label: "English", value: 0 },
      { label: "Korean", value: 3 },
    ];
    for (const { label, value } of selected) {
      expect(mlangs[value].name === label);
    }
    const results = getLanguageMetadata(selected);
    expect(results).toEqual({
      headers: ["Original", "Romaji/Pinyin/Romaja", "English"],
      needsRomanization: true,
      needsTranslation: true,
      isChinese: true,
      isoLangCode: "ja",
    });
  });

  test("Selecting a song with non-lexical lyrics", () => {
    const selected = [{ label: "Non-lexical lyrics", value: mlangs.length - 1 }];
    for (const { label, value } of selected) {
      expect(mlangs[value].name === label);
    }
    const results = getLanguageMetadata(selected);
    expect(results).toEqual({
      headers: ["Non-lexical lyrics", "", ""],
      needsRomanization: false,
      needsTranslation: false,
      isChinese: false,
      isoLangCode: null,
    });
  });

  test("Selecting a song with conlang lyrics", () => {
    const selected = [{ label: "Conlang", value: mlangs.length - 2 }];
    for (const { label, value } of selected) {
      expect(mlangs[value].name === label);
    }
    const results = getLanguageMetadata(selected);
    expect(results).toEqual({
      headers: ["Conlang", "", "English"],
      needsRomanization: false,
      needsTranslation: true,
      isChinese: false,
      isoLangCode: null,
    });
  });
});
