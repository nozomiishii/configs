import { defineConfig } from "eslint/config";
import { node } from "./presets/node";

export default defineConfig([
  ...node({ typescript: { tsconfigRootDir: import.meta.dirname } }),
]);
