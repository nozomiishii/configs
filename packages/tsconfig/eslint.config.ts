import { defineConfig, node } from "@nozomiishii/eslint-config";
import { fileURLToPath } from "node:url";

const tsconfigRootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig([
  ...node({ typescript: { tsconfigRootDir } }),
  {
    files: ["eslint.config.ts"],
    languageOptions: {
      parserOptions: {
        project: "./config/tsconfig.json",
        projectService: false,
      },
    },
    name: "project/eslint-config-typescript",
  },
]);
