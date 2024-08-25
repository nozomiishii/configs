// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  overrides: [
    {
      files: ['**/*.test.{ts,tsx}'],
      excludedFiles: ['**/e2e/**', '!**/*.stories.test.{ts,tsx}', '!**/.playwright/**'],
      extends: [
        /**
         * @vitest/eslint-plugin
         * {@link https://github.com/vitest-dev/eslint-plugin-vitest?tab=readme-ov-file#rules}
         */
        'plugin:@vitest/legacy-all',
      ],
      rules: {
        // DevDependenciesでいい
        'import/no-extraneous-dependencies': 'off',

        // 明示的にvitestからimportする
        // @types/testing-library__jest-domのせいで勝手にjest.testなどがglobal変数として扱われるため
        'no-restricted-globals': [
          'error',
          {
            name: 'test',
            message: "Use import { test } from 'vitest' instead",
          },
          {
            name: 'describe',
            message: "Use import { describe } from 'vitest' instead",
          },
          {
            name: 'expect',
            message: "Use import { expect } from 'vitest' instead",
          },
        ],

        // itでなくtest句でテスト書く
        'vitest/consistent-test-it': ['warn', { fn: 'test' }],

        // 同一テスト内で複数expectやめる
        'vitest/max-expects': ['error', { max: 1 }],

        // describeのネストやめる
        'vitest/max-nested-describe': ['error', { max: 1 }],

        // 非同期テストなどで、期待されるアサーションが呼び出されない場合を防ぐ
        'vitest/prefer-expect-assertions': [
          'warn',
          {
            onlyFunctionsWithAsyncKeyword: true,
            onlyFunctionsWithExpectInLoop: true,
            onlyFunctionsWithExpectInCallback: true,
          },
        ],
      },
    },
  ],
});
