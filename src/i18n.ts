import { register, init } from "svelte-i18n";

register("en", () => import("./locales/en/index.json"));

init({
  fallbackLocale: "en",
  initialLocale: "en",
});