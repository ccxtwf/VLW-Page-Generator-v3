import { defineConfig, lazyPlugins } from "vite-plus";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig((env) => ({
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
    DEBUG: env.command === "serve",
  },

  optimizeDeps: {
    exclude: ["@sqlite.org/sqlite-wasm"],
  },
}));