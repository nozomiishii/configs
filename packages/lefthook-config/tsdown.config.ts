import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/cli.ts"],
  format: ["esm"],
  clean: true,
  platform: "node",
  outExtensions: () => ({ js: ".js" }),
});
