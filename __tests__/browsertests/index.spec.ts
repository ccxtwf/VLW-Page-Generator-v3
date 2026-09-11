import { test, expect } from "@playwright/test";

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