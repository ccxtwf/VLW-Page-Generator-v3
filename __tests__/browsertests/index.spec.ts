import { test, expect } from "@playwright/test";
import { getSnapshotsDir } from "./utils";

test.describe("Webpage tests", async () => {
  test.beforeEach(async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.ok()).toBe(true);
    await page.waitForLoadState("networkidle");
  });

  test("Web page should load", async ({ page }) => {
    // Page title should not be empty
    await expect(page).not.toHaveTitle("");

    // Body text should not be empty
    const bodyText = await page.locator("body").innerText();
    expect(bodyText.trim().length).toBeGreaterThan(0);
  });

  test("Root should redirect to /#/songs", async ({ page }) => {
    await expect(page).toHaveURL(/^https?:\/\/.*?\/#\/songs/);
  });

  test("Page should be set to automatically dark mode", async ({ page }, {
    project: { name: browser },
  }) => {
    // prefer dark mode
    await page.emulateMedia({ colorScheme: "dark" });
    let colorScheme = await page.evaluate(() => {
      return window.getComputedStyle(document.documentElement).getPropertyValue("color-scheme");
    });
    expect(colorScheme).toEqual("normal");

    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/doc/auto-dark-mode.png`,
      fullPage: true,
    });
  });

  test("Theme toggle should apply `color-scheme`", async ({ page }, {
    project: { name: browser },
  }) => {
    await page.getByRole("button", { name: "Theme" }).click();
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
    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/doc/dark-mode.png`,
      fullPage: true,
    });

    await page.getByRole("radio", { name: "Light" }).click();
    await page.waitForFunction(
      async () => {
        const colorScheme = window
          .getComputedStyle(document.documentElement)
          .getPropertyValue("color-scheme");
        return colorScheme === "normal";
      },
      null,
      { timeout: 1000 },
    );
    await page.screenshot({
      path: `${getSnapshotsDir(browser)}/doc/light-mode.png`,
      fullPage: true,
    });
  });

  test("Navbar should navigate successfully", async ({ page }) => {
    const navbar = page.locator("header");
    await expect(navbar).toBeVisible();

    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });

    const albumGenNavLink = page
      .getByRole("banner")
      .getByRole("link", { name: "Album Page Generator" });
    await expect(albumGenNavLink).toBeVisible();
    await albumGenNavLink.click();
    await page.waitForLoadState("load");
    await expect(page).toHaveURL(/^https?:\/\/.*?\/#\/albums/);

    const producerGenNavLink = page
      .getByRole("banner")
      .getByRole("link", { name: "Producer Page Generator" });
    await expect(producerGenNavLink).toBeVisible();
    await expect(producerGenNavLink).toBeVisible();
    await producerGenNavLink.click();
    await page.waitForLoadState("load");
    await expect(page).toHaveURL(/^https?:\/\/.*?\/#\/producers/);

    const lyricsEditorNavLink = page
      .getByRole("banner")
      .getByRole("link", { name: "Lyrics Editor" });
    await expect(lyricsEditorNavLink).toBeVisible();
    await expect(lyricsEditorNavLink).toBeVisible();
    await lyricsEditorNavLink.click();
    await page.waitForLoadState("load");
    await expect(page).toHaveURL(/^https?:\/\/.*?\/#\/lyrics-editor/);

    const songGenNavLink = page
      .getByRole("banner")
      .getByRole("link", { name: "Song Page Generator" });
    await expect(songGenNavLink).toBeVisible();
    await songGenNavLink.click();
    await page.waitForLoadState("load");
    await expect(page).toHaveURL(/^https?:\/\/.*?\/#\/songs/);
  });

  test("Footer should navigate successfully", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();

    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });

    const albumGenNavLink = page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Album Page Generator" });
    await expect(albumGenNavLink).toBeVisible();
    await albumGenNavLink.click();
    await page.waitForLoadState("load");
    await expect(page).toHaveURL(/^https?:\/\/.*?\/#\/albums/);

    const producerGenNavLink = page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Producer Page Generator" });
    await expect(producerGenNavLink).toBeVisible();
    await expect(producerGenNavLink).toBeVisible();
    await producerGenNavLink.click();
    await page.waitForLoadState("load");
    await expect(page).toHaveURL(/^https?:\/\/.*?\/#\/producers/);

    const lyricsEditorNavLink = page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Lyrics Editor" });
    await expect(lyricsEditorNavLink).toBeVisible();
    await expect(lyricsEditorNavLink).toBeVisible();
    await lyricsEditorNavLink.click();
    await page.waitForLoadState("load");
    await expect(page).toHaveURL(/^https?:\/\/.*?\/#\/lyrics-editor/);

    const songGenNavLink = page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Song Page Generator" });
    await expect(songGenNavLink).toBeVisible();
    await songGenNavLink.click();
    await page.waitForLoadState("load");
    await expect(page).toHaveURL(/^https?:\/\/.*?\/#\/songs/);
  });
});