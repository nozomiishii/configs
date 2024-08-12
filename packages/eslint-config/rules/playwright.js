// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  overrides: [
    {
      files: ['**/e2e/**', '**/*.stories.test.{ts,tsx}'],
      extends: [
        /**
         * eslint-plugin-playwright
         * {@link https://www.npmjs.com/package/eslint-plugin-playwright}
         */
        'plugin:playwright/playwright-test',
      ],
      rules: {
        // DevDependenciesでいい
        'import/no-extraneous-dependencies': 'off',

        // 明示的に@playwright/testからimportする
        // @types/testing-library__jest-domのせいで勝手にjest.testなどがglobal変数として扱われるため
        // 'no-restricted-globals': [
        //   'error',
        //   {
        //     name: 'test',
        //     message: "Use import { test } from '@playwright/test' instead",
        //   },
        //   {
        //     name: 'describe',
        //     message: "Use import { describe } from '@playwright/test' instead",
        //   },
        //   {
        //     name: 'expect',
        //     message: "Use import { expect } from '@playwright/test' instead",
        //   },
        // ],

        /**
         * setup and teardown hooksは使わない。関数を逐一呼び出す。
         * {@link https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/no-hooks.md}
         */
        'playwright/no-hooks': 'error',

        /**
         * getByTitleは使わない。built in locatorsを使う。
         * https://playwright.dev/docs/locators
         * https://playwright.dev/docs/best-practices#best-practices
         * {@link https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/no-get-by-title.md}
         */
        'playwright/no-get-by-title': 'warn',

        /**
         * raw locatorsは使わない。built in locatorsを使う。
         * https://playwright.dev/docs/locators
         * https://playwright.dev/docs/best-practices#best-practices
         * {@link https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/no-raw-locators.md}
         */
        'playwright/no-raw-locators': 'error',

        /**
         * テストタイトルは小文字からはじめる
         * {@link https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/prefer-lowercase-title.md}
         */
        'playwright/prefer-lowercase-title': 'warn',

        /**
         * comparison-matcherでいけるところはcomparison-matcher使う
         * {@link https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/prefer-comparison-matcher.md}
         */
        'playwright/prefer-comparison-matcher': 'warn',

        /**
         * toBeでいけるところはtoBe
         * {@link https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/prefer-to-be.md}
         */
        'playwright/prefer-to-be': 'warn',

        /**
         * toContainでいけるところはtoContain
         * {@link https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/prefer-to-contain.md}
         */
        'playwright/prefer-to-contain': 'warn',

        /**
         * toHaveLengthでいけるところはtoHaveLength
         * {@link https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/prefer-to-have-length.md}
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
  ],
});
