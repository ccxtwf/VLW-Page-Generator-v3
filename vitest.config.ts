import { defineConfig } from "vite-plus";
import tailwindcss from "@tailwindcss/vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { playwright } from "vite-plus/test/browser-playwright";

const INJECTED_VARS = {
  DEBUG: false,
};

export default defineConfig({
  test: {
    projects: [
      {
        define: { ...INJECTED_VARS },
        test: {
          environment: "node",
          name: "unit",
          include: ["__tests__/unit/**/*.test.{js,ts}"],
        },
      },
      {
        define: { ...INJECTED_VARS },
        plugins: [svelte()],
        test: {
          environment: "jsdom",
          name: "sveltelogic",
          include: ["__tests__/sveltelogic/**/*.test.{js,ts}"],
        },
      },
      {
        define: { ...INJECTED_VARS },
        plugins: [tailwindcss(), svelte()],
        test: {
          name: "browser",
          setupFiles: ["__tests__/matchers.ts", "__tests__/components/browsersetup.ts"],
          include: ["__tests__/components/**/*.test.{js,ts}"],
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
            locators: {
              exact: false,
            },
            detailsPanelPosition: "bottom",
            viewport: {
              width: 800,
              height: 900,
            },
          },
        },
      },
    ],
  },
});