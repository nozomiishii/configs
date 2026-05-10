import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    index: "src/index.ts",
    "init/bin": "src/init/bin.ts",
    "init/index": "src/init/index.ts",
  },
  format: ["esm"],
  outExtensions: () => ({ js: ".js", dts: ".d.ts" }),
  platform: "node",
});
