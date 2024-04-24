import { createSSRApp } from "vue";
import App from "./App.vue";
import "./global.scss";
import * as Pinia from "pinia";

export function createApp() {
  const app = createSSRApp(App);
  app.use(Pinia.createPinia());
  return {
    app,
  };
}
