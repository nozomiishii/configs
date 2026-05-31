import eslintPluginVitest from "@vitest/eslint-plugin";
import { defineConfig } from "eslint/config";
import { name } from "../utils/name";

/**
 * @returns eslint-plugin-vitest
 *
 * @see https://github.com/vitest-dev/eslint-plugin-vitest
 */
export function viest() {
  return defineConfig([
    {
      ...eslintPluginVitest.configs.all,
      files: ["**/*.{test,spec}.{ts,tsx}"],
      ignores: ["**/e2e/**"],
      name: name("viest"),

      rules: {
        ...eslintPluginVitest.configs.all.rules,

        /**
         * テストファイル名は .test.{ts,tsx} に統一する。
         * .spec.* も識別対象に含めた上で、ファイル名規則違反としてエラーにする。
         *
         * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/consistent-test-filename.md
         */
        "vitest/consistent-test-filename": ["error", { pattern: String.raw`.*\.test\.[tj]sx?$` }],

        /**
         * itでなくtest句でテスト書く
         */
        "vitest/consistent-test-it": ["warn", { fn: "test" }],

        /**
         * 1テスト1振る舞いに合わせ、同じ振る舞いを検証する複数 expect は許容する。
         *
         * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/max-expects.md
         */
        "vitest/max-expects": "off",

        /**
         * describeのネストやめる
         */
        "vitest/max-nested-describe": ["error", { max: 1 }],

        /**
         * Deprecated
         * allじゃなくってrecommendにして選んでく方針にしようか悩む
         *
         * https://github.com/vitest-dev/eslint-plugin-vitest/issues/312
         */
        "vitest/no-done-callback": "off",

        /**
         * 関数ごとにファイル分けているのでテストの中であえて関数と明示しなくても良いという判断。
         *
         * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/prefer-describe-function-title.md
         */
        "vitest/prefer-describe-function-title": "off",

        /**
         * 非同期テストなどで、期待されるアサーションが呼び出されない場合を防ぐ
         *
         * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/prefer-expect-assertions.md
         */
        "vitest/prefer-expect-assertions": [
          "warn",
          {
            onlyFunctionsWithExpectInCallback: true,
            onlyFunctionsWithExpectInLoop: true,
          },
        ],

        /**
         * bunが対応してないのと、playwrightっぽくexpectをそのままassertしてもいいという判断
         *
         * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/prefer-expect-resolves.md
         */
        "vitest/prefer-expect-resolves": "off",

        /**
         * describe句は必要に応じて使う
         *
         * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/require-top-level-describe.md
         */
        "vitest/require-top-level-describe": "off",
      },
    },
  ]);
}
