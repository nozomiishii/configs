import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/init.ts", "src/starter.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  platform: "node",
  outExtensions: () => ({ js: ".js", dts: ".d.ts" }),
});
