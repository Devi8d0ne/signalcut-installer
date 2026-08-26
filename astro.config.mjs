import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  root: fileURLToPath(new URL("./site/", import.meta.url)),
  srcDir: fileURLToPath(new URL("./site/src/", import.meta.url)),
  publicDir: fileURLToPath(new URL("./site/public/", import.meta.url)),
  outDir: fileURLToPath(new URL("./dist/", import.meta.url)),
  site: "https://devi8d0ne.github.io",
  base: "/signalcut-installer",
  output: "static",
});
