import { mount } from "svelte";
import "./i18n";
import App from "./App.svelte";
import "./lib/components/handsontables/registration";
import { getActiveTheme } from "./lib/utils/themeUtils";

import "./app.css";
import "./styles/handsontable.less";

document.addEventListener("DOMContentLoaded", function () {
  document.body.setAttribute("data-theme", getActiveTheme());
});

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;