import { defineConfig } from "tsdown";

const base = defineConfig({
  format: ["esm"],
  platform: "node",
  outExtensions: () => ({ js: ".js", dts: ".d.ts" }),
});

export default defineConfig([
  {
    ...base,
    entry: {
      "index": "src/index.ts",
      "init/index": "src/init/index.ts",
    },
    dts: true,
    clean: true,
  },
  {
    ...base,
    entry: {
      "cli": "src/cli.ts",
      "init/bin": "src/init/bin.ts",
    },
    dts: false,
    clean: false,
    banner: { js: "#!/usr/bin/env node" },
  },
]);
