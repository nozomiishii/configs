import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    commitlint: "src/commitlint.ts",
    "init/bin": "src/init/bin.ts",
    "init/index": "src/init/index.ts",
    oxfmt: "src/oxfmt.ts",
  },
  format: ["esm"],
  outExtensions: () => ({ js: ".js" }),
  platform: "node",
});
