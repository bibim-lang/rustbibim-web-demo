import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

import monacoEditorPlugin from "vite-plugin-monaco-editor";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    wasm(),
    topLevelAwait(),
    monacoEditorPlugin({
      languageWorkers: ["editorWorkerService"],
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 80,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
