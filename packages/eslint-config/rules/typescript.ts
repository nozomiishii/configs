import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import type { TypescriptOptions } from "../types";
import { name } from "../utils/name";

/**
 * @returns typescript-eslint
 *
 * @see https://github.com/typescript-eslint/typescript-eslint
 *
 * @see https://typescript-eslint.io/rules
 */
export function typescript({ tsconfigRootDir }: TypescriptOptions = {}) {
  return defineConfig([
    // typescript-eslint/baseとtypescript-eslint/eslint-recommendedの設定がダブってるからなんとかしたい
    //
    // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/flat/strict-type-checked.ts
    tseslint.configs.strictTypeChecked,
    // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/flat/stylistic-type-checked.ts
    tseslint.configs.stylisticTypeChecked,

    /**
     * 型を見る rule を動かすための設定。
     * projectService が各ファイルに型情報を供給し、
     * tsconfigRootDir でその基準ディレクトリを固定する。
     *
     * @see https://typescript-eslint.io/packages/parser/#projectservice
     */
    {
      languageOptions: {
        parserOptions: {
          projectService: true,
          ...(tsconfigRootDir && { tsconfigRootDir }),
        },
      },
      name: name("typescript/parserOptions"),
    },

    {
      files: ["**/*.{ts,tsx}"],
      name: name("typescript"),
      rules: {
        /**
         * interfaceではなくtypeを使う
         *
         * @see https://typescript-eslint.io/rules/consistent-type-definitions
         */
        "@typescript-eslint/consistent-type-definitions": ["warn", "type"],

        // Method shorthand syntaxではなくObject property syntaxで関数の型定義する
        // https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
        "@typescript-eslint/method-signature-style": ["error", "property"],

        // Promiseをちゃんと処理する。VoidやIIFEは無視してよい。
        "@typescript-eslint/no-floating-promises": [
          "error",
          { ignoreIIFE: true, ignoreVoid: true },
        ],

        /**
         * 未使用の変数・引数を検出する
         *
         * @see https://typescript-eslint.io/rules/no-unused-vars
         */
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            // 未使用の引数は _ 始まりで許容
            argsIgnorePattern: "^_",
            // catch の未使用エラーは _ 始まりで許容
            caughtErrorsIgnorePattern: "^_",
            // 配列分割代入の未使用要素は _ 始まりで許容
            destructuredArrayIgnorePattern: "^_",
            // --fix で未使用 import を自動削除する
            enableAutofixRemoval: { imports: true },
            // { a, ...rest } で抜き出した a を未使用扱いしない
            ignoreRestSiblings: true,
            // using / await using は未使用でも許容
            ignoreUsingDeclarations: true,
            // 未使用の局所変数は _ 始まりで許容
            varsIgnorePattern: "^_",
          },
        ],
      },
    },
    {
      files: ["**/*.d.ts"],
      name: name("typescript/d.ts"),
      rules: {
        /**
         * typeではなくinterfaceを使う
         *
         * @see https://typescript-eslint.io/rules/consistent-type-definitions
         */
        "@typescript-eslint/consistent-type-definitions": ["warn", "interface"],
      },
    },
  ]);
}
