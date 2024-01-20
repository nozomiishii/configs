// @ts-check
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  plugins: [
    /**
     * eslint-plugin-perfectionist
     * {@link https://www.npmjs.com/package/eslint-plugin-perfectionist}
     */
    'perfectionist',
  ],
  extends: ['plugin:perfectionist/recommended-natural'],
  rules: {
    // コード改行ルール
    'padding-line-between-statements': [
      'warn',
      { blankLine: 'always', prev: '*', next: 'block' },
      { blankLine: 'always', prev: '*', next: 'cjs-export' },
      { blankLine: 'always', prev: '*', next: 'export' },
      { blankLine: 'always', prev: '*', next: 'for' },
      { blankLine: 'always', prev: '*', next: 'function' },
      { blankLine: 'always', prev: '*', next: 'if' },
      { blankLine: 'always', prev: 'import', next: '*' },
      { blankLine: 'never', prev: 'import', next: 'import' },
      { blankLine: 'always', next: 'return', prev: '*' },
      { blankLine: 'always', prev: '*', next: 'try' },
    ],

    // コメント改行ルール
    'lines-around-comment': [
      'warn',
      {
        beforeBlockComment: true,
        beforeLineComment: true,
        allowBlockStart: true,
        allowObjectStart: true,
        allowClassStart: true,
        allowArrayStart: true,
      },
    ],

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
