import { defineConfig } from "eslint/config";
import path from "node:path";
import { node } from "./presets/node";

export default defineConfig([
  ...node({ typescript: { tsconfigRootDir: import.meta.dirname } }),

  /**
   * Node.js が直接実行する全パッケージの ESM bin を検査する。
   *
   * @see https://nodejs.org/api/esm.html#mandatory-file-extensions
   * @see https://github.com/un-ts/eslint-plugin-import-x/blob/HEAD/docs/rules/extensions.md
   */
  {
    basePath: path.resolve(import.meta.dirname, "../.."),
    files: ["packages/*/bin/**/*.js"],
    name: "project/node-esm-bins",
    rules: {
      "import-x/extensions": ["warn", "ignorePackages"],
    },
  },
]);
