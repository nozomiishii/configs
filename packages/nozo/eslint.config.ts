import { defineConfig, node } from "@nozomiishii/eslint-config";

export default defineConfig([
  ...node({ typescript: { tsconfigRootDir: import.meta.dirname } }),
]);
