import {defineConfig} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import path from "path";

export default defineConfig({
  output: "static",
  site: "https://yourdirectory.com",
  compressHTML: true,
  build: {
    format: "file",
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve("./src"),
      },
    },
  },
  integrations: [sitemap()],
});
