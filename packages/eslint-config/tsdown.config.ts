import { defineConfig } from "tsdown";

const base = defineConfig({
  format: ["esm"],
  platform: "node",
  outExtensions: () => ({ dts: ".d.ts", js: ".js" }),
});

export default defineConfig([
  {
    ...base,
    entry: { "init/index": "src/init/index.ts" },
    dts: true,
    clean: true,
  },
  {
    ...base,
    entry: { "init/bin": "src/init/bin.ts" },
    dts: false,
    clean: false,
    banner: { js: "#!/usr/bin/env node" },
  },
]);
