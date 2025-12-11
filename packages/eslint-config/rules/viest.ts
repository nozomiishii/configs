import eslintPluginVitest from '@vitest/eslint-plugin';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

/**
 * @returns eslint-plugin-vitest
 *
 * @see https://github.com/vitest-dev/eslint-plugin-vitest
 */
export function viest() {
  return defineConfig([
    {
      ...eslintPluginVitest.configs.all,
      files: ['**/*.test.{ts,tsx}'],
      ignores: ['**/e2e/**'],
      name: name('viest'),

      rules: {
        ...eslintPluginVitest.configs.all.rules,

        /**
         * itでなくtest句でテスト書く
         */
        'vitest/consistent-test-it': ['warn', { fn: 'test' }],

        /**
         * 同一テスト内で複数expectやめる
         */
        'vitest/max-expects': ['error', { max: 1 }],

        /**
         * describeのネストやめる
         */
        'vitest/max-nested-describe': ['error', { max: 1 }],

        /**
         * Deprecated
         * allじゃなくってrecommendにして選んでく方針にしようか悩む
         *
         * https://github.com/vitest-dev/eslint-plugin-vitest/issues/312
         */
        'vitest/no-done-callback': 'off',

        /**
         * 非同期テストなどで、期待されるアサーションが呼び出されない場合を防ぐ
         *
         * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/prefer-expect-assertions.md
         */
        'vitest/prefer-expect-assertions': [
          'warn',
          {
            onlyFunctionsWithExpectInCallback: true,
            onlyFunctionsWithExpectInLoop: true,
          },
        ],

        /**
         * describe句は必要に応じて使う
         *
         * @see https://github.com/vitest-dev/eslint-plugin-vitest/blob/main/docs/rules/require-top-level-describe.md
         */
        'vitest/require-top-level-describe': 'off',
      },
    },
  ]);
}
