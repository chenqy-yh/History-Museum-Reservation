import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

export default () => {
  return defineConfig({
    plugins: [uni()],
  });
};
