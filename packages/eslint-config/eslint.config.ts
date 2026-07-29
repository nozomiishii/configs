import { defineConfig } from "eslint/config";
import { node } from "./presets/node";

export default defineConfig([
  ...node({ typescript: { tsconfigRootDir: import.meta.dirname } }),

  /**
   * Node.js が直接実行する ESM bin の相対 import は拡張子を必須にする。
   *
   * @see https://nodejs.org/api/esm.html#mandatory-file-extensions
   * @see https://github.com/un-ts/eslint-plugin-import-x/blob/HEAD/docs/rules/extensions.md
   */
  {
    files: ["bin/**/*.js"],
    name: "project/node-esm-bin",
    rules: {
      "import-x/extensions": ["warn", "ignorePackages"],
    },
  },
]);
