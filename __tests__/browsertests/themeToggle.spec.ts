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

const rxThemeToggledCssClass = /(^|\s)theme-toggled(\s|$)/;

function evaluateExpectedThemeToggledInThemeNavbarDropdown(expectedTheme: string) {
  return (
    document.querySelector(`input[type="radio"][value="${expectedTheme}"]`)! as HTMLInputElement
  ).checked;
}

async function setThemeChangedEventListener(page: Page) {
  const eventListener = vi.fn();
  await page.exposeFunction("spyEventListener", eventListener);
  await page.evaluate(() => {
    //@ts-ignore
    window.addEventListener("themeChanged", window.spyEventListener);
  });
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
    let colorScheme = await page.evaluate(() => {
      return window.getComputedStyle(document.documentElement).getPropertyValue("color-scheme");
    });
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
    let colorScheme = await page.evaluate(() => {
      return window.getComputedStyle(document.documentElement).getPropertyValue("color-scheme");
    });
    expect(colorScheme).toEqual("dark");

    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/doc/auto-dark-mode.png`,
      fullPage: true,
    });
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

    const spy = await setThemeChangedEventListener(page);

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

    const spy = await setThemeChangedEventListener(page);

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

  test("Theme toggle should apply `color-scheme` (@media prefers: light mode)", async ({ page }, {
    project: { name: browser },
  }) => {
    const themeToggle = getThemeToggle(page);
    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).not.toBeChecked();

    const themeToggleContainer = getThemeToggleContainer(page);
    await expect(themeToggleContainer).not.toHaveClass(rxThemeToggledCssClass);

    const spy = await setThemeChangedEventListener(page);

    await themeToggle.click();
    viExpect(spy).toHaveBeenCalled();
    await expect(themeToggleContainer).toHaveClass(rxThemeToggledCssClass);
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
    /* Expect dark mode to be toggled on the navbar's theme toggle */
    await page.evaluate(evaluateExpectedThemeToggledInThemeNavbarDropdown, "dark");
    /* Screenshot */
    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/doc/song-page-lyrics-toggle-dark-mode.png`,
      fullPage: true,
    });

    await themeToggle.click();
    viExpect(spy).toHaveBeenCalled();
    await expect(themeToggleContainer).not.toHaveClass(rxThemeToggledCssClass);
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
    /* Expect light mode to be toggled on the navbar's theme toggle */
    await page.evaluate(evaluateExpectedThemeToggledInThemeNavbarDropdown, "corporate");
    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/doc/song-page-lyrics-toggle-light-mode.png`,
      fullPage: true,
    });
  });

  test("Theme toggle should apply `color-scheme` (@media prefers: dark mode)", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.reload();

    const themeToggleDropdown = getThemeNavbarDropdown(page);
    await themeToggleDropdown.click();

    const themeToggle = getThemeToggle(page);
    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).toBeChecked();

    const themeToggleContainer = getThemeToggleContainer(page);
    await expect(themeToggleContainer).toHaveClass(rxThemeToggledCssClass);

    const spy = await setThemeChangedEventListener(page);

    await themeToggle.click();
    viExpect(spy).toHaveBeenCalled();
    await expect(themeToggleContainer).not.toHaveClass(rxThemeToggledCssClass);
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
    /* Expect light mode to be toggled on the navbar's theme toggle */
    await page.evaluate(evaluateExpectedThemeToggledInThemeNavbarDropdown, "corporate");

    await themeToggle.click();
    viExpect(spy).toHaveBeenCalled();
    await expect(themeToggleContainer).toHaveClass(rxThemeToggledCssClass);
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
    /* Expect dark mode to be toggled on the navbar's theme toggle */
    await page.evaluate(evaluateExpectedThemeToggledInThemeNavbarDropdown, "dark");
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

  test("Theme toggle should apply `color-scheme` (@media prefers: light mode)", async ({ page }, {
    project: { name: browser },
  }) => {
    const themeToggle = getThemeToggle(page);
    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).not.toBeChecked();

    const themeToggleContainer = getThemeToggleContainer(page);
    await expect(themeToggleContainer).not.toHaveClass(rxThemeToggledCssClass);

    const spy = await setThemeChangedEventListener(page);

    await themeToggle.click();
    viExpect(spy).toHaveBeenCalled();
    await expect(themeToggleContainer).toHaveClass(rxThemeToggledCssClass);
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
    /* Expect dark mode to be toggled on the navbar's theme toggle */
    await page.evaluate(evaluateExpectedThemeToggledInThemeNavbarDropdown, "dark");
    /* Screenshot */
    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/doc/lyrics-editor-lyrics-toggle-dark-mode.png`,
      fullPage: true,
    });

    await themeToggle.click();
    viExpect(spy).toHaveBeenCalled();
    await expect(themeToggleContainer).not.toHaveClass(rxThemeToggledCssClass);
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
    /* Expect light mode to be toggled on the navbar's theme toggle */
    await page.evaluate(evaluateExpectedThemeToggledInThemeNavbarDropdown, "corporate");
    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/doc/lyrics-editor-lyrics-toggle-light-mode.png`,
      fullPage: true,
    });
  });

  test("Theme toggle should apply `color-scheme` (@media prefers: dark mode)", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.reload();

    const themeToggleDropdown = getThemeNavbarDropdown(page);
    await themeToggleDropdown.click();

    const themeToggle = getThemeToggle(page);
    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).toBeChecked();

    const themeToggleContainer = getThemeToggleContainer(page);
    await expect(themeToggleContainer).toHaveClass(rxThemeToggledCssClass);

    const spy = await setThemeChangedEventListener(page);

    await themeToggle.click();
    viExpect(spy).toHaveBeenCalled();
    await expect(themeToggleContainer).not.toHaveClass(rxThemeToggledCssClass);
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
    /* Expect light mode to be toggled on the navbar's theme toggle */
    await page.evaluate(evaluateExpectedThemeToggledInThemeNavbarDropdown, "corporate");

    await themeToggle.click();
    viExpect(spy).toHaveBeenCalled();
    await expect(themeToggleContainer).toHaveClass(rxThemeToggledCssClass);
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
    /* Expect dark mode to be toggled on the navbar's theme toggle */
    await page.evaluate(evaluateExpectedThemeToggledInThemeNavbarDropdown, "dark");
  });
});