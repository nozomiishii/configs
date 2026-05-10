import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    cli: "src/cli.ts",
    "init/bin": "src/init/bin.ts",
    "init/index": "src/init/index.ts",
  },
  format: ["esm"],
  outExtensions: () => ({ js: ".js" }),
  platform: "node",
});
