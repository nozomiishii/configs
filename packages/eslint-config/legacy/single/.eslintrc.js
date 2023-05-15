// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  root: true,
  env: {
    browser: true,
    node: true,
  },
  settings: {
    'import/resolver': {
      typescript: true,
    },
    react: {
      version: 'detect',
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
    sourceType: 'module',
  },
  ignorePatterns: ['.eslintrc*', '*.config.*'],
  plugins: ['import', 'unicorn', 'tsdoc', 'sort-keys-custom-order'],
  extends: [
    // JS
    'airbnb-base',
    'plugin:unicorn/recommended',
    'plugin:eslint-comments/recommended',

    // TS
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict',

    // React
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    require.resolve('@vercel/style-guide/eslint/react'),

    // Next.js
    'plugin:@next/next/recommended',
    'plugin:@next/next/core-web-vitals',

    // CSS
    'plugin:tailwindcss/recommended',

    // code style
    'prettier',
  ],

  /**
   * ルールをhoverするとその要約と@seeに詳細Linkが出てくる
   * Link対応してないルールは@linkで付け足してる
   *
   *
   * ルールを付け足す際は以下用に対応するのがおすすめ
   *
   * waring - fixコマンド対応してる。もしくは、ほっとくとCIで落ちる。
   * error  - 自らで直す
   */
  rules: {
    // ----------------------------------------------------------------
    // Base
    // ----------------------------------------------------------------
    // 略語の許容
    'unicorn/prevent-abbreviations': [
      'warn',
      {
        replacements: {
          args: {
            arguments: false,
          },
          env: {
            environment: false,
          },
          e: {
            event: false,
          },
          props: {
            properties: false,
          },
          req: {
            request: false,
          },
          res: {
            response: false,
          },
        },
      },
    ],
    // ----------------------------------------------------------------
    // Base - Format
    // ----------------------------------------------------------------
    // return句の改行ルール
    'padding-line-between-statements': [
      'warn',
      {
        blankLine: 'always',
        next: 'return',
        prev: '*',
      },
    ],

    // import句の後改行する
    'import/newline-after-import': ['warn', { considerComments: true }],

    // import文の並び替え
    'import/order': [
      'warn',
      {
        alphabetize: { caseInsensitive: true, order: 'asc' },
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'object', 'type', 'index'],
        'newlines-between': 'never',
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],

    /**
     * keyを並び替え
     * {@link https://github.com/hugoattal/eslint-plugin-sort-keys-custom-order}
     */
    'sort-keys-custom-order/export-object-keys': [
      'warn',
      {
        orderedKeys: ['id', 'key', 'name', 'title', 'default'],
      },
    ],
    'sort-keys-custom-order/import-object-keys': [
      'warn',
      {
        orderedKeys: ['id', 'key', 'name', 'title', 'default'],
      },
    ],
    'sort-keys-custom-order/object-keys': [
      'warn',
      {
        orderedKeys: ['id', 'key', 'name', 'title', 'default'],
      },
    ],
    'sort-keys-custom-order/type-keys': [
      'warn',
      {
        orderedKeys: ['id', 'key', 'name', 'title', 'default'],
      },
    ],

    // ----------------------------------------------------------------
    // TypeScript
    // ----------------------------------------------------------------
    // シャドウイングの許容
    '@typescript-eslint/no-shadow': 'off',

    // 使ってない引数はアンダースコア始まりにする
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
      },
    ],

    // interfaceではなくtypeを使う
    '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],

    // EnumではなくUnion typeを使う
    'no-restricted-syntax': [
      'error',
      {
        selector: 'TSEnumDeclaration',
        message: "Don't use enums. Use Union type instead.",
      },
    ],

    /**
     * tsdocのsyntaxチェック
     * {@link https://tsdoc.org/pages/packages/eslint-plugin-tsdoc/}
     */
    'tsdoc/syntax': 'error',
  },

  overrides: [
    // ----------------------------------------------------------------
    // Test tools
    // ----------------------------------------------------------------
    {
      files: ['**/*.test.ts', '**/e2e/**', '**/*.stories.ts'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },

    // ----------------------------------------------------------------
    // Vitest
    // ----------------------------------------------------------------
    {
      files: ['**/*.test.ts'],
      excludedFiles: '**/e2e/**',
      extends: ['plugin:vitest/all'],
      rules: {
        // itでなくtest句でテスト書く
        'vitest/consistent-test-it': ['warn', { fn: 'test' }],

        // 同一テスト内で複数expectやめる
        'vitest/max-expects': ['error', { max: 1 }],

        // describeのネストやめる
        'vitest/max-nested-describe': ['error', { max: 1 }],
      },
    },

    // ----------------------------------------------------------------
    // testing-library
    // ----------------------------------------------------------------
    {
      files: ['**/*.test.ts', '**/*.stories.ts'],
      excludedFiles: '**/e2e/**',
      extends: ['plugin:testing-library/react'],
    },

    // ----------------------------------------------------------------
    // playwright
    // ----------------------------------------------------------------
    {
      files: ['**/e2e/**'],
      extends: ['plugin:playwright/playwright-test'],
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

    // ----------------------------------------------------------------
    // storybook
    // ----------------------------------------------------------------
    {
      files: ['**/*.stories.*', '**/.storybook/main.*'],
      extends: ['plugin:storybook/recommended', 'plugin:storybook/csf-strict'],
      rules: {
        /**
         * metaにcomponent渡し忘れ防止
         * {@link https://github.com/storybookjs/eslint-plugin-storybook/blob/main/docs/rules/csf-component.md}
         */
        'storybook/csf-component': 'error',
      },
    },
  ],
});
