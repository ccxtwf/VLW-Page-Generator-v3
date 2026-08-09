import { describe, expect, test } from "vitest";
import {
  addColumnsAtIndexToTheLeftToToggle,
  addColumnsAtIndexToTheRightToToggle,
  removeColumnsAtIndexFromToggle,
} from "../../src/lib/utils/lyricsUtils";

describe("manipulateLyricsToggle", () => {
  test.each([
    {
      d: "Add one column at first column",
      i: {
        toggleText: "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}",
        index: 1,
        amount: 1,
      },
      o: "{{lyrics toggle|jp:Japanese|col1:Column 1|rom:Romaji|eng:English}}",
    },
    {
      d: "Add one column at second column",
      i: {
        toggleText: "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}",
        index: 2,
        amount: 1,
      },
      o: "{{lyrics toggle|jp:Japanese|rom:Romaji|col1:Column 1|eng:English}}",
    },
    {
      d: "Add one column at last column",
      i: {
        toggleText: "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}",
        index: 3,
        amount: 1,
      },
      o: "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English|col1:Column 1}}",
    },
    {
      d: "Add two columns at first column",
      i: {
        toggleText: "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}",
        index: 1,
        amount: 2,
      },
      o: "{{lyrics toggle|jp:Japanese|col1:Column 1|col2:Column 2|rom:Romaji|eng:English}}",
    },
    {
      d: "Add two columns at second column",
      i: {
        toggleText: "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}",
        index: 2,
        amount: 2,
      },
      o: "{{lyrics toggle|jp:Japanese|rom:Romaji|col1:Column 1|col2:Column 2|eng:English}}",
    },
    {
      d: "Add two columns at last column",
      i: {
        toggleText: "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}",
        index: 3,
        amount: 2,
      },
      o: "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English|col1:Column 1|col2:Column 2}}",
    },
    {
      d: "Add four columns",
      i: {
        toggleText: "{{lyrics toggle|jp:Japanese}}",
        index: 1,
        amount: 4,
      },
      o: "{{lyrics toggle|jp:Japanese|col1:Column 1|col2:Column 2|col3:Column 3|col4:Column 4}}",
    },
  ])("addColumnsAtIndexToTheRightToToggle - $d", ({ i: { toggleText, index, amount }, o }) => {
    expect(addColumnsAtIndexToTheRightToToggle(toggleText, index, amount)).toBe(o);
  });

  test.each([
    {
      d: "Add one column at first column",
      i: {
        toggleText: "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}",
        index: 1,
        amount: 1,
      },
      o: "{{lyrics toggle|col1:Column 1|jp:Japanese|rom:Romaji|eng:English}}",
    },
    {
      d: "Add one column at second column",
      i: {
        toggleText: "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}",
        index: 2,
        amount: 1,
      },
      o: "{{lyrics toggle|jp:Japanese|col1:Column 1|rom:Romaji|eng:English}}",
    },
    {
      d: "Add one column at last column",
      i: {
        toggleText: "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}",
        index: 3,
        amount: 1,
      },
      o: "{{lyrics toggle|jp:Japanese|rom:Romaji|col1:Column 1|eng:English}}",
    },
    {
      d: "Add two columns at first column",
      i: {
        toggleText: "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}",
        index: 1,
        amount: 2,
      },
      o: "{{lyrics toggle|col1:Column 1|col2:Column 2|jp:Japanese|rom:Romaji|eng:English}}",
    },
    {
      d: "Add two columns at second column",
      i: {
        toggleText: "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}",
        index: 2,
        amount: 2,
      },
      o: "{{lyrics toggle|jp:Japanese|col1:Column 1|col2:Column 2|rom:Romaji|eng:English}}",
    },
    {
      d: "Add two columns at last column",
      i: {
        toggleText: "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}",
        index: 3,
        amount: 2,
      },
      o: "{{lyrics toggle|jp:Japanese|rom:Romaji|col1:Column 1|col2:Column 2|eng:English}}",
    },
    {
      d: "Add four columns",
      i: {
        toggleText: "{{lyrics toggle|jp:Japanese}}",
        index: 1,
        amount: 4,
      },
      o: "{{lyrics toggle|col1:Column 1|col2:Column 2|col3:Column 3|col4:Column 4|jp:Japanese}}",
    },
  ])("addColumnsAtIndexToTheLeftToToggle - $d", ({ i: { toggleText, index, amount }, o }) => {
    expect(addColumnsAtIndexToTheLeftToToggle(toggleText, index, amount)).toBe(o);
  });

  test.each([
    {
      d: "Removes one column at first column",
      i: {
        toggleText: "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}",
        columnIndices: [1],
      },
      o: "{{lyrics toggle|rom:Romaji|eng:English}}",
    },
    {
      d: "Removes one column at second column",
      i: {
        toggleText: "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}",
        columnIndices: [2],
      },
      o: "{{lyrics toggle|jp:Japanese|eng:English}}",
    },
    {
      d: "Removes one column at last column",
      i: {
        toggleText: "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}",
        columnIndices: [3],
      },
      o: "{{lyrics toggle|jp:Japanese|rom:Romaji}}",
    },
    {
      d: "Removes two columns in middle",
      i: {
        toggleText: "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}",
        columnIndices: [1, 2],
      },
      o: "{{lyrics toggle|eng:English}}",
    },
    {
      d: "Removes two columns in last position",
      i: {
        toggleText: "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}",
        columnIndices: [2, 3],
      },
      o: "{{lyrics toggle|jp:Japanese}}",
    },
    {
      d: "Removes two columns in middle",
      i: {
        toggleText:
          "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English|eng2:English 2|eng3:English 3}}",
        columnIndices: [2, 3],
      },
      o: "{{lyrics toggle|jp:Japanese|eng2:English 2|eng3:English 3}}",
    },
    {
      d: "Removes two columns in first position",
      i: {
        toggleText:
          "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English|eng2:English 2|eng3:English 3}}",
        columnIndices: [1, 2],
      },
      o: "{{lyrics toggle|eng:English|eng2:English 2|eng3:English 3}}",
    },
    {
      d: "Removes two columns in last position",
      i: {
        toggleText:
          "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English|eng2:English 2|eng3:English 3}}",
        columnIndices: [4, 5],
      },
      o: "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English}}",
    },
    {
      d: "Removes four columns in middle",
      i: {
        toggleText:
          "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English|eng2:English 2|eng3:English 3}}",
        columnIndices: [1, 2, 3, 4],
      },
      o: "{{lyrics toggle|eng3:English 3}}",
    },
    {
      d: "Removes four columns in last position",
      i: {
        toggleText:
          "{{lyrics toggle|jp:Japanese|rom:Romaji|eng:English|eng2:English 2|eng3:English 3}}",
        columnIndices: [2, 3, 4, 5],
      },
      o: "{{lyrics toggle|jp:Japanese}}",
    },
  ])("addColumnsAtIndexToTheLeftToToggle - $d", ({ i: { toggleText, columnIndices }, o }) => {
    expect(removeColumnsAtIndexFromToggle(toggleText, columnIndices)).toBe(o);
  });
});
