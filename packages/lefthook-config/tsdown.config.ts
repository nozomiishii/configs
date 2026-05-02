import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/cli.ts", "src/init.ts"],
  format: ["esm"],
  clean: true,
  dts: true,
  platform: "node",
  loader: { ".yaml": "text" },
  outExtensions: () => ({ js: ".js" }),
});
