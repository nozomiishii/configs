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
         */
        'vitest/prefer-expect-assertions': [
          'warn',
          {
            onlyFunctionsWithAsyncKeyword: true,
            onlyFunctionsWithExpectInCallback: true,
            onlyFunctionsWithExpectInLoop: true,
          },
        ],
      },
    },
  ]);
}
