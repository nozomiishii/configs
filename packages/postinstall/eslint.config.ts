import { defineConfig, node } from "@nozomiishii/eslint-config";
import { fileURLToPath } from "node:url";

const tsconfigRootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig([
  ...node({ typescript: { tsconfigRootDir } }),
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            "bin/*.js",
            "eslint.config.ts",
            "tests/*.ts",
            "tsdown.config.ts",
          ],
        },
      },
    },
    name: "project/typescript",
  },
  {
    files: ["bin/**/*.js"],
    name: "project/node-esm-bin",
    rules: {
      "import-x/extensions": ["warn", "ignorePackages"],
    },
  },
]);
