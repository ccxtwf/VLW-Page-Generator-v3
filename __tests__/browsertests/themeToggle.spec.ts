import { test, expect, Page, Locator } from "@playwright/test";
import { vi, expect as viExpect } from "vite-plus/test";
import { getSnapshotsDir } from "./utils";

function getThemeNavbarDropdown(page: Page): Locator {
  const themeToggleDropdown = page.getByRole("button", { name: "Theme" });
  return themeToggleDropdown;
}

function getThemeToggleContainer(page: Page): Locator {
  const themeToggleContainer = page.locator("label.lyrics-theme-toggle");
  return themeToggleContainer;
}

function getThemeToggle(page: Page): Locator {
  const themeToggle = page.locator('input[name="theme-toggle"]');
  return themeToggle;
}

function getLyricsTable(page: Page): Locator {
  const lyricsTable = page.locator("#lyrics .ht-root-wrapper");
  return lyricsTable;
}

function computeColorScheme() {
  return window.getComputedStyle(document.body).getPropertyValue("color-scheme");
}

const rxThemeToggledCssClass = /(^|\s)theme-toggled(\s|$)/;

async function spyOnEventListener(page: Page, event: "themeChanged" | "lyricsThemeToggled") {
  const eventListener = vi.fn();
  await page.exposeFunction("spyEventListener", eventListener);
  await page.evaluate((event) => {
    //@ts-ignore
    window.addEventListener(event, window.spyEventListener);
  }, event);
  return eventListener;
}

test.describe("Theming - Initial Load State", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("Page should be set to automatic light mode", async ({ page }, {
    project: { name: browser },
  }) => {
    let colorScheme = await page.evaluate(computeColorScheme);
    expect(colorScheme).toEqual("light");

    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/doc/auto-light-mode.png`,
      fullPage: true,
    });
  });

  test("Page should be set to automatic dark mode", async ({ page }, {
    project: { name: browser },
  }) => {
    // prefer dark mode
    await page.emulateMedia({ colorScheme: "dark" });
    let colorScheme = await page.evaluate(computeColorScheme);
    expect(colorScheme).toEqual("dark");

    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/doc/auto-dark-mode.png`,
      fullPage: true,
    });
  });

  test('Page should remember its selected theme (select theme "Dark" on an OS that prefers Light Mode)', async ({
    page,
  }) => {
    // prefer light mode
    await page.emulateMedia({ colorScheme: "light" });
    let colorScheme = await page.evaluate(computeColorScheme);
    expect(colorScheme).toEqual("light");

    expect(await page.localStorage.getItem("preferred-light-theme")).toBeNull();
    expect(await page.localStorage.getItem("preferred-dark-theme")).toBeNull();
    expect(await page.localStorage.getItem("preferred-theme")).toBeNull();

    const themeToggleDropdown = getThemeNavbarDropdown(page);
    await expect(themeToggleDropdown).toBeVisible();

    await themeToggleDropdown.click();
    await page.getByRole("radio", { name: "Dark" }).click();
    await page.waitForFunction(
      async () => {
        const colorScheme = window
          .getComputedStyle(document.documentElement)
          .getPropertyValue("color-scheme");
        return colorScheme === "dark";
      },
      null,
      { timeout: 1000 },
    );

    expect(await page.localStorage.getItem("preferred-light-theme")).toBeNull();
    expect(await page.localStorage.getItem("preferred-dark-theme")).toBe("dark");
    expect(await page.localStorage.getItem("preferred-theme")).toBe("dark");

    await page.reload();

    const themeIsSetInBody = await page.evaluate(() => {
      return window.document.body.getAttribute("data-theme") === "dark";
    });
    expect(themeIsSetInBody).toBe(true);

    colorScheme = await page.evaluate(computeColorScheme);
    expect(colorScheme).toEqual("dark");
  });

  test('Page should remember its selected theme (select theme "Nord" on an OS that prefers Light Mode)', async ({
    page,
  }) => {
    // prefer light mode
    await page.emulateMedia({ colorScheme: "light" });
    let colorScheme = await page.evaluate(computeColorScheme);
    expect(colorScheme).toEqual("light");

    expect(await page.localStorage.getItem("preferred-light-theme")).toBeNull();
    expect(await page.localStorage.getItem("preferred-dark-theme")).toBeNull();
    expect(await page.localStorage.getItem("preferred-theme")).toBeNull();

    const themeToggleDropdown = getThemeNavbarDropdown(page);
    await expect(themeToggleDropdown).toBeVisible();

    await themeToggleDropdown.click();
    await page.getByRole("radio", { name: "Nord" }).click();
    await page.waitForFunction(
      async () => {
        const colorScheme = window
          .getComputedStyle(document.documentElement)
          .getPropertyValue("color-scheme");
        return colorScheme === "light";
      },
      null,
      { timeout: 1000 },
    );

    expect(await page.localStorage.getItem("preferred-light-theme")).toBe("nord");
    expect(await page.localStorage.getItem("preferred-dark-theme")).toBeNull();
    expect(await page.localStorage.getItem("preferred-theme")).toBe("nord");

    await page.reload();

    const themeIsSetInBody = await page.evaluate(() => {
      return window.document.body.getAttribute("data-theme") === "nord";
    });
    expect(themeIsSetInBody).toBe(true);

    colorScheme = await page.evaluate(computeColorScheme);
    expect(colorScheme).toEqual("light");
  });

  test('Page should remember its selected theme (select theme "Light" on an OS that prefers Dark Mode)', async ({
    page,
  }) => {
    // prefer light mode
    await page.emulateMedia({ colorScheme: "dark" });
    let colorScheme = await page.evaluate(computeColorScheme);
    expect(colorScheme).toEqual("dark");

    expect(await page.localStorage.getItem("preferred-light-theme")).toBeNull();
    expect(await page.localStorage.getItem("preferred-dark-theme")).toBeNull();
    expect(await page.localStorage.getItem("preferred-theme")).toBeNull();

    const themeToggleDropdown = getThemeNavbarDropdown(page);
    await expect(themeToggleDropdown).toBeVisible();

    await themeToggleDropdown.click();
    await page.getByRole("radio", { name: "Light" }).click();
    await page.waitForFunction(
      async () => {
        const colorScheme = window
          .getComputedStyle(document.documentElement)
          .getPropertyValue("color-scheme");
        return colorScheme === "light";
      },
      null,
      { timeout: 1000 },
    );

    expect(await page.localStorage.getItem("preferred-light-theme")).toBe("corporate");
    expect(await page.localStorage.getItem("preferred-dark-theme")).toBeNull();
    expect(await page.localStorage.getItem("preferred-theme")).toBe("corporate");

    await page.reload();

    const themeIsSetInBody = await page.evaluate(() => {
      return window.document.body.getAttribute("data-theme") === "corporate";
    });
    expect(themeIsSetInBody).toBe(true);

    colorScheme = await page.evaluate(computeColorScheme);
    expect(colorScheme).toEqual("light");
  });

  test('Page should remember its selected theme (select theme "Gato" on an OS that prefers Dark Mode)', async ({
    page,
  }) => {
    // prefer light mode
    await page.emulateMedia({ colorScheme: "dark" });
    let colorScheme = await page.evaluate(computeColorScheme);
    expect(colorScheme).toEqual("dark");

    expect(await page.localStorage.getItem("preferred-light-theme")).toBeNull();
    expect(await page.localStorage.getItem("preferred-dark-theme")).toBeNull();
    expect(await page.localStorage.getItem("preferred-theme")).toBeNull();

    const themeToggleDropdown = getThemeNavbarDropdown(page);
    await expect(themeToggleDropdown).toBeVisible();

    await themeToggleDropdown.click();
    await page.getByRole("radio", { name: "Gato" }).click();
    await page.waitForFunction(
      async () => {
        const colorScheme = window
          .getComputedStyle(document.documentElement)
          .getPropertyValue("color-scheme");
        return colorScheme === "dark";
      },
      null,
      { timeout: 1000 },
    );

    expect(await page.localStorage.getItem("preferred-light-theme")).toBeNull();
    expect(await page.localStorage.getItem("preferred-dark-theme")).toBe("gato");
    expect(await page.localStorage.getItem("preferred-theme")).toBe("gato");

    await page.reload();

    const themeIsSetInBody = await page.evaluate(() => {
      return window.document.body.getAttribute("data-theme") === "gato";
    });
    expect(themeIsSetInBody).toBe(true);

    colorScheme = await page.evaluate(computeColorScheme);
    expect(colorScheme).toEqual("dark");
  });
});

test.describe("ThemeNavbarDropdown", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("Theme toggle on navbar should apply `color-scheme` (@media prefers: light mode)", async ({
    page,
  }, { project: { name: browser } }) => {
    const themeToggleDropdown = getThemeNavbarDropdown(page);
    await expect(themeToggleDropdown).toBeVisible();

    const spy = await spyOnEventListener(page, "themeChanged");

    await themeToggleDropdown.click();
    await page.getByRole("radio", { name: "Dark" }).click();
    viExpect(spy).toHaveBeenCalled();
    await page.waitForFunction(
      async () => {
        const colorScheme = window
          .getComputedStyle(document.documentElement)
          .getPropertyValue("color-scheme");
        return colorScheme === "dark";
      },
      null,
      { timeout: 1000 },
    );
    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/doc/dark-mode.png`,
      fullPage: true,
    });

    await page.getByRole("radio", { name: "Light" }).click();
    viExpect(spy).toHaveBeenCalled();
    await page.waitForFunction(
      async () => {
        const colorScheme = window
          .getComputedStyle(document.documentElement)
          .getPropertyValue("color-scheme");
        return colorScheme === "light";
      },
      null,
      { timeout: 1000 },
    );
    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/doc/light-mode.png`,
      fullPage: true,
    });
  });

  test("Theme toggle on navbar should apply `color-scheme` (@media prefers: dark mode)", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.reload();

    const themeToggleDropdown = getThemeNavbarDropdown(page);
    await expect(themeToggleDropdown).toBeVisible();

    const spy = await spyOnEventListener(page, "themeChanged");

    await themeToggleDropdown.click();
    await page.getByRole("radio", { name: "Light" }).click();
    viExpect(spy).toHaveBeenCalled();
    await page.waitForFunction(
      async () => {
        const colorScheme = window
          .getComputedStyle(document.documentElement)
          .getPropertyValue("color-scheme");
        return colorScheme === "light";
      },
      null,
      { timeout: 1000 },
    );

    await page.getByRole("radio", { name: "Dark" }).click();
    viExpect(spy).toHaveBeenCalled();
    await page.waitForFunction(
      async () => {
        const colorScheme = window
          .getComputedStyle(document.documentElement)
          .getPropertyValue("color-scheme");
        return colorScheme === "dark";
      },
      null,
      { timeout: 1000 },
    );
  });
});

test.describe("ThemeToggle (song page)", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/#/songs");
    await page.waitForLoadState("networkidle");
  });

  test("Theme toggle should be unchecked on first page load if the system prefers light mode", async ({
    page,
  }) => {
    await page.reload();

    const themeToggle = getThemeToggle(page);
    const themeToggleContainer = getThemeToggleContainer(page);
    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).not.toBeChecked();
    await expect(themeToggleContainer).not.toHaveClass(rxThemeToggledCssClass);
  });

  test("Theme toggle should be checked on first page load if the system prefers dark mode", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.reload();

    const themeToggle = getThemeToggle(page);
    const themeToggleContainer = getThemeToggleContainer(page);
    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).toBeChecked();
    await expect(themeToggleContainer).toHaveClass(rxThemeToggledCssClass);
  });

  test("Theme toggle should toggle dark mode on the lyrics table", async ({ page }, {
    project: { name: browser },
  }) => {
    const themeToggle = getThemeToggle(page);
    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).not.toBeChecked();

    const themeToggleContainer = getThemeToggleContainer(page);
    await expect(themeToggleContainer).not.toHaveClass(rxThemeToggledCssClass);

    const lyricsTable = getLyricsTable(page);
    await expect(lyricsTable).toBeVisible();

    const spy = await spyOnEventListener(page, "lyricsThemeToggled");

    await themeToggle.click();
    viExpect(spy).toHaveBeenCalled();
    await expect(themeToggleContainer).toHaveClass(rxThemeToggledCssClass);
    await expect(lyricsTable).toHaveClass(/ht-theme-dark/);
    /* Screenshot */
    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/doc/song-page-lyrics-toggle-dark-mode.png`,
      fullPage: true,
    });

    await themeToggle.click();
    viExpect(spy).toHaveBeenCalled();
    await expect(themeToggleContainer).not.toHaveClass(rxThemeToggledCssClass);
    await expect(lyricsTable).toHaveClass(/ht-theme-light/);
    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/doc/song-page-lyrics-toggle-light-mode.png`,
      fullPage: true,
    });
  });

  test("Theme toggle should toggle light mode on the lyrics table", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.reload();

    const themeToggleDropdown = getThemeNavbarDropdown(page);
    await themeToggleDropdown.click();

    const themeToggle = getThemeToggle(page);
    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).toBeChecked();

    const themeToggleContainer = getThemeToggleContainer(page);
    await expect(themeToggleContainer).toHaveClass(rxThemeToggledCssClass);

    const lyricsTable = getLyricsTable(page);
    await expect(lyricsTable).toBeVisible();

    const spy = await spyOnEventListener(page, "lyricsThemeToggled");

    await themeToggle.click();
    viExpect(spy).toHaveBeenCalled();
    await expect(themeToggleContainer).not.toHaveClass(rxThemeToggledCssClass);
    await expect(lyricsTable).toHaveClass(/ht-theme-light/);

    await themeToggle.click();
    viExpect(spy).toHaveBeenCalled();
    await expect(themeToggleContainer).toHaveClass(rxThemeToggledCssClass);
    await expect(lyricsTable).toHaveClass(/ht-theme-dark/);
  });
});

test.describe("ThemeToggle (lyrics editor page)", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/#/lyrics-editor");
    await page.waitForLoadState("networkidle");
  });

  test("Theme toggle should be unchecked on first page load if the system prefers light mode", async ({
    page,
  }) => {
    await page.reload();

    const themeToggle = getThemeToggle(page);
    const themeToggleContainer = getThemeToggleContainer(page);
    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).not.toBeChecked();
    await expect(themeToggleContainer).not.toHaveClass(rxThemeToggledCssClass);
  });

  test("Theme toggle should be checked on first page load if the system prefers dark mode", async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.reload();

    const themeToggle = getThemeToggle(page);
    const themeToggleContainer = getThemeToggleContainer(page);
    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).toBeChecked();
    await expect(themeToggleContainer).toHaveClass(rxThemeToggledCssClass);
  });

  test("Theme toggle should toggle dark mode on the lyrics table", async ({ page }, {
    project: { name: browser },
  }) => {
    const themeToggle = getThemeToggle(page);
    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).not.toBeChecked();

    const themeToggleContainer = getThemeToggleContainer(page);
    await expect(themeToggleContainer).not.toHaveClass(rxThemeToggledCssClass);

    const lyricsTable = getLyricsTable(page);
    await expect(lyricsTable).toBeVisible();

    const spy = await spyOnEventListener(page, "lyricsThemeToggled");

    await themeToggle.click();
    viExpect(spy).toHaveBeenCalled();
    await expect(themeToggleContainer).toHaveClass(rxThemeToggledCssClass);
    await expect(lyricsTable).toHaveClass(/ht-theme-dark/);
    /* Screenshot */
    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/doc/lyrics-editor-lyrics-toggle-dark-mode.png`,
      fullPage: true,
    });

    await themeToggle.click();
    viExpect(spy).toHaveBeenCalled();
    await expect(themeToggleContainer).not.toHaveClass(rxThemeToggledCssClass);
    await expect(lyricsTable).toHaveClass(/ht-theme-light/);
    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/doc/lyrics-editor-lyrics-toggle-light-mode.png`,
      fullPage: true,
    });
  });

  test("Theme toggle should toggle light mode on the lyrics table", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.reload();

    const themeToggleDropdown = getThemeNavbarDropdown(page);
    await themeToggleDropdown.click();

    const themeToggle = getThemeToggle(page);
    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).toBeChecked();

    const themeToggleContainer = getThemeToggleContainer(page);
    await expect(themeToggleContainer).toHaveClass(rxThemeToggledCssClass);

    const lyricsTable = getLyricsTable(page);
    await expect(lyricsTable).toBeVisible();

    const spy = await spyOnEventListener(page, "lyricsThemeToggled");

    await themeToggle.click();
    viExpect(spy).toHaveBeenCalled();
    await expect(themeToggleContainer).not.toHaveClass(rxThemeToggledCssClass);
    await expect(lyricsTable).toHaveClass(/ht-theme-light/);

    await themeToggle.click();
    viExpect(spy).toHaveBeenCalled();
    await expect(themeToggleContainer).toHaveClass(rxThemeToggledCssClass);
    await expect(lyricsTable).toHaveClass(/ht-theme-dark/);
  });
});