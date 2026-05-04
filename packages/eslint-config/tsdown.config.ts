import { defineConfig } from "tsdown";

export default defineConfig({
  banner: { js: "#!/usr/bin/env node" },
  clean: true,
  dts: true,
  entry: ["src/init.ts"],
  format: ["esm"],
  outExtensions: () => ({ dts: ".d.ts", js: ".js" }),
  platform: "node",
});
