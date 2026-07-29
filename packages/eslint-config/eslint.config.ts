import { defineConfig } from "eslint/config";
import path from "node:path";
import tseslint from "typescript-eslint";
import { node } from "./presets/node";

export default defineConfig([
  ...node({ typescript: { tsconfigRootDir: import.meta.dirname } }),

  /**
   * Node.js が直接実行する全パッケージの ESM bin を検査する。
   * bin は各パッケージの tsconfig 対象外なので、型情報を使わない。
   *
   * @see https://nodejs.org/api/esm.html#mandatory-file-extensions
   * @see https://github.com/un-ts/eslint-plugin-import-x/blob/HEAD/docs/rules/extensions.md
   * @see https://typescript-eslint.io/users/configs#disable-type-checked
   */
  {
    ...tseslint.configs.disableTypeChecked,
    basePath: path.resolve(import.meta.dirname, "../.."),
    files: ["packages/*/bin/**/*.js"],
    name: "project/node-esm-bins",
    rules: {
      ...tseslint.configs.disableTypeChecked.rules,
      "import-x/extensions": ["warn", "ignorePackages"],
    },
  },
]);
