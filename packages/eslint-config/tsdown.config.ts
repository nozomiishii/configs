import { defineConfig } from "tsdown";

const base = defineConfig({
  format: ["esm"],
  outExtensions: () => ({ dts: ".d.ts", js: ".js" }),
  platform: "node",
});

export default defineConfig([
  {
    ...base,
    clean: true,
    dts: true,
    entry: { "init/index": "src/init/index.ts" },
  },
  {
    ...base,
    banner: { js: "#!/usr/bin/env node" },
    clean: false,
    dts: false,
    entry: { "init/bin": "src/init/bin.ts" },
  },
]);
