import { mount } from "svelte";
import "./i18n";
import App from "./App.svelte";
import "./lib/components/handsontables/registration";

import "./app.css";
import "./styles/handsontable.less";

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;