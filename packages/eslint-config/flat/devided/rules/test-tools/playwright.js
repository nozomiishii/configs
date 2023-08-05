// FIXME: pluginsのflat-config未対応、対応後@ts-checkを有効にする
import { defineFlatConfig } from 'eslint-define-config';
import * as pluginPlaywright from 'eslint-plugin-playwright';

/**
 * {@link https://github.com/playwright-community/eslint-plugin-playwright}
 */
export default defineFlatConfig([
  {
    files: ['**/e2e/**'],
    plugins: {
      playwright: pluginPlaywright,
    },
    rules: {
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
]);
