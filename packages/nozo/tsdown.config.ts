import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  entry: ["src/index.ts"],
  format: ["esm"],
  outExtensions: () => ({ js: ".js" }),
  platform: "node",
});
