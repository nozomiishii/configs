import eslintPluginVitest from '@vitest/eslint-plugin';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

/**
 * @returns eslint-plugin-perfectionist
 *
 * @see https://github.com/azat-io/eslint-plugin-perfectionist
 */
export function viest() {
  return defineConfig([
    {
      files: ['**/*.test.{ts,tsx}'],
      ignores: ['**/e2e/**'],
      name: name('viest'),
      plugins: {
        vitest: eslintPluginVitest,
      },
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
