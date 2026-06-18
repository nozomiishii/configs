import eslintConfigJavascript from "@eslint/js";
import { defineConfig } from "eslint/config";
import { name } from "../utils/name";

/**
 * @returns `@eslint/js`
 *
 * @see https://eslint.org/docs/latest/rules/
 */
export function javascript() {
  return defineConfig([
    {
      files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
      name: name("javascript"),
      plugins: {
        js: eslintConfigJavascript,
      },
      rules: {
        ...eslintConfigJavascript.configs.recommended.rules,
        /**
         * prettier 層が off にするため ./prettier.ts(prettier/overrides)で有効化中。
         * stylistic へ移行したらここを復活させる。
         *
         * if, else, while, for などで波括弧を省略しないように統一
         *
         * @see https://github.com/prettier/eslint-config-prettier?tab=readme-ov-file#curly
         */
        curly: ["warn", "all"],

        /**
         * == と != の使用を禁止し、=== と !== の使用を強制
         *
         * @see https://eslint.org/docs/latest/rules/eqeqeq
         */
        eqeqeq: ["warn", "allow-null"],

        /**
         * ブロックのネスト深さを制限し、深い入れ子を防ぐ。
         *
         * @see https://eslint.org/docs/latest/rules/max-depth
         */
        "max-depth": "error",

        /**
         * consoleの消し忘れ防止
         *
         * @see https://eslint.org/docs/latest/rules/no-console
         */
        "no-console": ["warn", { allow: ["warn", "error"] }],

        /**
         * 早期 return 後の不要な else を禁止し、ガード句を促す。
         *
         * @see https://eslint.org/docs/latest/rules/no-else-return
         */
        "no-else-return": ["warn", { allowElseIf: false }],

        /**
         * 入れ子の三項演算子を禁止
         *
         * @see https://eslint.org/docs/latest/rules/no-nested-ternary
         */
        "no-nested-ternary": "error",

        /**
         * 不必要な再命名防止
         *
         * @see https://eslint.org/docs/latest/rules/no-useless-rename
         */
        "no-useless-rename": "warn",

        /**
         * var を禁止し、ブロックスコープの let / const に統一
         *
         * @see https://eslint.org/docs/latest/rules/no-var
         */
        "no-var": "warn",

        /**
         * 再代入しない let は const に統一
         *
         * @see https://eslint.org/docs/latest/rules/prefer-const
         */
        "prefer-const": "warn",

        /**
         * 比較式において、リテラルを前に置く「ヨーダ条件」を禁止
         *
         * @see https://eslint.org/docs/latest/rules/yoda
         */
        yoda: "warn",
      },
    },
  ]);
}
