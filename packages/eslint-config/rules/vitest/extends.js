// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  overrides: [
    {
      files: ['**/*.test.*'],
      excludedFiles: ['**/e2e/**'],
      extends: [
        /**
         * eslint-plugin-vitest
         * {@link https://www.npmjs.com/package/eslint-plugin-vitest}
         */
        'plugin:vitest/all',
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
      },
    },
  ],
});
