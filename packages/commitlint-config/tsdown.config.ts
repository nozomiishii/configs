import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "init/index": "src/init/index.ts",
    cli: "src/cli.ts",
    "init/bin": "src/init/bin.ts",
  },
  format: ["esm"],
  platform: "node",
  outExtensions: () => ({ js: ".js", dts: ".d.ts" }),
  dts: true,
  clean: true,
});
