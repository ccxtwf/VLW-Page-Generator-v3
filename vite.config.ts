import { defineConfig, lazyPlugins } from "vite-plus";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },

  fmt: {
    ignorePatterns: [],

    semi: true,
    singleQuote: false,
    arrowParens: "always",
    embeddedLanguageFormatting: "auto",
  },

  lint: {
    ignorePatterns: [],

    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },

  plugins: lazyPlugins(() => [tailwindcss(), svelte()]),
});