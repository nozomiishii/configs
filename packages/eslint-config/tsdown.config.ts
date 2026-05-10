import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    "init/bin": "src/init/bin.ts",
    "init/index": "src/init/index.ts",
  },
  format: ["esm"],
  outExtensions: () => ({ dts: ".d.ts", js: ".js" }),
  platform: "node",
});
