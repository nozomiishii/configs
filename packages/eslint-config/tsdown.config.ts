import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    "init/index": "src/init/index.ts",
    "init/bin": "src/init/bin.ts",
  },
  format: ["esm"],
  platform: "node",
  outExtensions: () => ({ dts: ".d.ts", js: ".js" }),
  dts: true,
  clean: true,
});
