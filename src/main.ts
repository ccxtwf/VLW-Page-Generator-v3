import { mount } from "svelte";
import "./i18n";
import App from "./App.svelte";
import "./lib/components/handsontables/registration";

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;