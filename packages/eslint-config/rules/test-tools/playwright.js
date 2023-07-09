// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  overrides: [
    {
      files: ['**/e2e/**'],
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

        /**
         * テストタイトルは小文字からはじめる
         * {@link https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/prefer-lowercase-title.md}
         */
        'playwright/prefer-lowercase-title': 'warn',

        /**
         * toBeでいけるところはtoBe
         * {@link https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/prefer-to-be.md}
         */
        'playwright/prefer-to-be': 'warn',

        /**
         * toHaveLengthでいけるところはtoHaveLength
         * {@link https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/prefer-to-have-length.md}
         */
        'playwright/prefer-to-have-length': 'warn',

        /**
         * describe内にテスト書く
         * {@link https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/require-top-level-describe.md}
         */
        'playwright/require-top-level-describe': 'error',
      },
    },
  ],
});
