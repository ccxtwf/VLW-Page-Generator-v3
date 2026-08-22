import { defineConfig } from "vite-plus";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { playwright } from "vite-plus/test/browser-playwright";

export default defineConfig({
  test: {
    projects: [
      {
        define: {
          DEBUG: false,
        },
        test: {
          environment: "node",
          name: "unit",
          include: ["__tests__/unit/**/*.test.{js,ts}"],
        },
      },
      {
        define: {
          DEBUG: false,
        },
        plugins: [svelte()],
        test: {
          environment: "jsdom",
          name: "sveltelogic",
          include: ["__tests__/sveltelogic/**/*.test.{js,ts}"],
        },
      },
      {
        define: {
          DEBUG: false,
        },
        plugins: [svelte()],
        test: {
          name: "browser",
          include: ["__tests__/components/**/*.test.{js,ts}"],
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});