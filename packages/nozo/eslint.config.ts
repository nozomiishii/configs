import { defineConfig, node } from "@nozomiishii/eslint-config";

// nozoはCLIなのでnode presetでlintする
export default defineConfig([...node()]);
