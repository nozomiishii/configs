import eslintPluginPlaywright from 'eslint-plugin-playwright';
import { defineConfig } from 'eslint/config';
import { name } from '../utils/name';

const config = eslintPluginPlaywright.configs['flat/recommended'];

/**
 * @returns eslint-plugin-playwright
 *
 * @see https://github.com/playwright-community/eslint-plugin-playwright
 */
export function playwright() {
  return defineConfig([
    {
      ...config,
      files: ['**/e2e/**'],
      name: name('playwright'),
      rules: {
        ...config.rules,

        /**
         * test内のexpectの数の制限
         *
         * @see https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/max-expects.md
         */
        'playwright/max-expects': ['error', { max: 5 }],

        /**
         * describeはnestの数の制限
         *
         * @see https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/max-nested-describe.md
         */
        'playwright/max-nested-describe': ['error', { max: 2 }],

        /**
         * getByTitleは使わない。built in locatorsを使う。
         * https://playwright.dev/docs/locators
         * https://playwright.dev/docs/best-practices#best-practices
         *
         * @see https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/no-get-by-title.md
         */
        'playwright/no-get-by-title': 'warn',

        /**
         * setup and teardown hooksは使わない。関数を逐一呼び出す。
         *
         * @see https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/no-hooks.md
         */
        'playwright/no-hooks': 'error',

        /**
         * raw locatorsは使わない。built in locatorsを使う。
         * https://playwright.dev/docs/locators
         * https://playwright.dev/docs/best-practices#best-practices
         *
         * @see https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/no-raw-locators.md
         */
        'playwright/no-raw-locators': 'error',

        /**
         * comparison-matcherでいけるところはcomparison-matcher使う
         *
         * @see https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/prefer-comparison-matcher.md
         */
        'playwright/prefer-comparison-matcher': 'warn',

        /**
         * テストタイトルは小文字からはじめる
         *
         * @see https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/prefer-lowercase-title.md
         */
        'playwright/prefer-lowercase-title': 'warn',

        /**
         * toBeでいけるところはtoBe
         *
         * @see https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/prefer-to-be.md
         */
        'playwright/prefer-to-be': 'warn',

        /**
         * toContainでいけるところはtoContain
         *
         * @see https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/prefer-to-contain.md
         */
        'playwright/prefer-to-contain': 'warn',

        /**
         * toHaveLengthでいけるところはtoHaveLength
         *
         * @see https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/prefer-to-have-length.md
         */
        'playwright/prefer-to-have-length': 'warn',

        // /**
        //  * describe内にテスト書く
        //  * {@link https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/require-top-level-describe.md}
        //  */
        // 'playwright/require-top-level-describe': 'error',

        // /**
        //  * expect.softを使う
        //  * {@link https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/require-soft-assertions.md}
        //  */
        // 'playwright/require-soft-assertions': 'warn',
      },
    },
  ]);
}
