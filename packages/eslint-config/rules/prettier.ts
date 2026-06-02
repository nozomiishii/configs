import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig } from "eslint/config";
import { name } from "../utils/name";

/**
 * @returns eslint-config-prettier
 *
 * @see https://github.com/prettier/eslint-config-prettier
 */
export function prettier() {
  return defineConfig([
    {
      ...eslintConfigPrettier,
      name: name("prettier"),
    },

    {
      name: name("prettier/overrides"),
      rules: {
        /**
         * eslint-config-prettier が off にする safe な special rule を後段で再有効化。
         * "all" は Prettier と競合しないため、prettier 適用後の再設定が推奨されている。
         *
         * @see https://github.com/prettier/eslint-config-prettier?tab=readme-ov-file#curly
         */
        curly: ["warn", "all"],
      },
    },
  ]);
}
