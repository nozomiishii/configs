import { defineConfig, node } from "@nozomiishii/eslint-config";
import { fileURLToPath } from "node:url";

const tsconfigRootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig([
  ...node({ typescript: { tsconfigRootDir } }),
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.ts", "tsdown.config.ts"],
        },
      },
    },
    name: "project/typescript",
  },
]);
