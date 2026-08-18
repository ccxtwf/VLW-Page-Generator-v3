import { defineConfig, lazyPlugins, loadEnv } from "vite-plus";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig((env) => {
  const vars = loadEnv(env.mode, "", "");
  return {
    staged: {
      "*": "vp check --fix",
    },

    fmt: {
      ignorePatterns: ["**/*.md", "**/*.json", "index.html"],

      semi: true,
      singleQuote: false,
      arrowParens: "always",
      embeddedLanguageFormatting: "auto",
      singleAttributePerLine: true,
      sortTailwindcss: true,
      svelte: {
        indentScriptAndStyle: true,
      },
    },

    lint: {
      ignorePatterns: ["**/*.md", "**/*.json", "index.html"],

      jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
      rules: {
        "vite-plus/prefer-vite-plus-imports": "error",
        "no-unused-expressions": [
          "error",
          {
            allowShortCircuit: true,
          },
        ],
        "no-useless-default-assignment": "off",
      },
      options: {
        typeAware: true,
        typeCheck: true,
      },
    },

    plugins: lazyPlugins(() => [tailwindcss(), svelte()]),

    define: {
      /**
       * This variable is set to `true` on `vp dev`, `false` otherwise
       */
      DEBUG: env.command === "serve",
      /**
       * Fetch assets from this endpoint
       */
      ASSETS_PATH: `"${vars.ASSETS_PATH || "/"}"`,
    },

    build: {
      copyPublicDir: false,
    },
    optimizeDeps: {
      exclude: ["@sqlite.org/sqlite-wasm"],
    },
  };
});