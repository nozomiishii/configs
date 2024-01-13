// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  plugins: [
    /**
     * eslint-plugin-import
     * {@link https://www.npmjs.com/package/eslint-plugin-import}
     */
    'import',

    /**
     * eslint-plugin-perfectionist
     * {@link https://www.npmjs.com/package/eslint-plugin-perfectionist}
     */
    'perfectionist',
  ],
  extends: ['plugin:perfectionist/recommended-natural'],
  rules: {
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
    'perfectionist/sort-imports': [
      'error',
      {
        type: 'natural',
        order: 'asc',
        groups: [
          'type',
          ['builtin', 'external'],
          'internal-type',
          'internal',
          ['parent-type', 'sibling-type', 'index-type'],
          ['parent', 'sibling', 'index'],
          'object',
          'unknown',
        ],
        'newlines-between': 'never',
        'internal-pattern': ['@/**', '~/**'],
      },
    ],
  },
});
