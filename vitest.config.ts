import { defineConfig } from "vite-plus";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { playwright } from "vite-plus/test/browser-playwright";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          environment: "node",
          name: "unit",
          include: ["__tests__/unit/**/*.test.{js,ts}"],
        },
      },
      {
        plugins: [svelte()],
        test: {
          environment: "jsdom",
          name: "sveltelogic",
          include: ["__tests__/sveltelogic/**/*.test.{js,ts}"],
        },
      },
    ],
  },
});