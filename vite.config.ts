import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx, defineManifest } from "@crxjs/vite-plugin";

const manifest = defineManifest({
  manifest_version: 3,
  name: "Keio Tracker",
  version: "1.0.0",
  content_scripts: [
    {
      matches: ["https://lms.keio.jp/"],
      js: ["src/index.tsx"],
    },
  ],
  icons: {
    "16": "images/icon16.png",
    "48": "images/icon48.png",
    "128": "images/icon128.png",
  },
});

export default defineConfig({
  plugins: [crx({ manifest }), react()],
  build: {
    sourcemap: "inline",
  },
});
